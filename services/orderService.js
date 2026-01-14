import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';
import { sendOrderConfirmationEmail } from './emailService.js';
import { sendNewOrderNotification } from './telegramService.js';

export const createOrder = async (userId, address, phone) => {
    if (!userId || !address || !phone) {
        throw new Error('Missing required fields (حقول مطلوبة ناقصة)');
    }

    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
        throw new Error('Cart empty (السلة فاضية)');
    }


    // 2) بناء عناصر الطلب من كل السلة
    const orderItems = cart.items.map(item => ({
        productId: item.productId._id,
        name: item.productId.name,
        qty: item.qty,
        priceAtOrder: item.priceAtAdd,
    }));

    const total = cart.items.reduce((sum, item) => sum + Number(item.qty) * item.priceAtAdd, 0);

    console.log(cart.items)
 
    let order;
    let stockDeducted = false; // Flag (علامة) مهم جدًا

  try{
     // 1) إنشاء Order مبدئي
      order = await Order.create({
         userId,
         items: orderItems,
         total,
         address,
         phone,
         status: 'pending'
     });
// 2) التحقق من المخزون
       const stockOps = cart.items
        .filter(item => item.productId.stock != null)
        .map(item => ({
            updateOne: {
                filter: {
                    _id: item.productId._id,
                    stock: { $gte: Number(item.qty) }
                },
                update: { $inc: { stock: -Number(item.qty) } }
            }
        }));

if (stockOps.length > 0) {
      const result = await Product.bulkWrite(stockOps);

      if (result.modifiedCount !== stockOps.length) {
        throw new Error('Insufficient stock (الكمية غير كافية)');
      }

      stockDeducted = true;
    }

  // 3) تأكيد الطلب
  order.status = 'confirmed';
  await order.save();
     // 5) تفريغ السلة بعد إنشاء الطلب
    await Cart.updateOne({ userId }, { items: [] });

    try{
 const user = await User.findById(userId);

      const orderDetails = {
        orderId: order._id,
        userInfo: { name: user.username, email: user.email },
        address,
        phone,
        total,
        itemsList: orderItems,
        status: order.status,
      };

      await sendOrderConfirmationEmail(orderDetails);
      await sendNewOrderNotification(orderDetails);
    } catch (notifyError) {
      console.error('Notification failed', notifyError);
      // لا نلغي الطلب بسبب الإشعارات
    }

    return order;

  } catch (err) {
    // 7) Rollback (استرجاع) آمن
    if (order && stockDeducted) {
      const rollbackOps = cart.items
        .filter(item => item.productId.stock != null)
        .map(item => ({
          updateOne: {
            filter: { _id: item.productId._id },
            update: { $inc: { stock: Number(item.qty) } },
          },
        }));

      if (rollbackOps.length > 0) {
        await Product.bulkWrite(rollbackOps);
      }
    }

    if (order) {
      order.status = 'cancelled';
      await order.save();
    }

    throw err;
  }
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