import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';
import { sendOrderConfirmationEmail } from './emailService.js';
import { sendNewOrderNotification } from './telegramService.js';

export const createOrder = async (userId, address, phone) => {
  const cart = await Cart.findOne({ userId }).populate('items.productId');

  if (!cart || cart.items.length === 0) {
    throw new Error('Cart is empty');
  }

  let total = 0;
  const orderItems = [];

  for (const item of cart.items) {
    const product = item.productId;
    if (product.stock < item.qty) {
      throw new Error(`Not enough stock for ${product.name}. Available: ${product.stock}`);
    }
    orderItems.push({
      productId: product._id,
      name: product.name,
      qty: item.qty,
      priceAtOrder: item.priceAtAdd,
    });
    total += item.qty * item.priceAtAdd;

    // Decrease product stock
    product.stock -= item.qty;
    await product.save();
  }

  const order = new Order({
    userId,
    items: orderItems,
    total,
    address,
    phone,
  });

  await order.save();

  // Get user info for notifications
  const user = await User.findById(userId);

  // Prepare order details for notifications
  const orderDetails = {
    orderId: order._id,
    userInfo: { name: user.name, email: user.email },
    address: order.address,
    total: order.total,
    itemsList: order.items,
    status: order.status,
  };

  // Send notifications
  await sendOrderConfirmationEmail(user.email, orderDetails);
  await sendNewOrderNotification(orderDetails);

  // Clear the cart after order creation
  cart.items = [];
  await cart.save();

  return order;
};

export const getOrdersByUserId = async (userId) => {
  return await Order.find({ userId }).populate('items.productId', 'name image');
};

export const getAllOrders = async () => {
  return await Order.find({}).populate('userId', 'name email').populate('items.productId', 'name image');
};

export const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error('Order not found');
  }

  order.status = status;
  await order.save();
  return order;
};

export const deleteOrder = async (orderId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error('Order not found');
  }

  await order.deleteOne();
  return { message: 'Order removed' };
};