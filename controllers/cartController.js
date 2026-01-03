import asyncHandler from 'express-async-handler';
import { getCartByUserId, addItemToCart, updateCartItemQuantity, removeItemFromCart } from '../services/cartService.js';

// @desc    Get user cart
// @route   GET /api/cart/:userId
// @access  Private
export const getCart = asyncHandler(async (req, res) => {
  try {
    const cart = await getCartByUserId(req.params.userId);
    res.json(cart);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addItem = asyncHandler(async (req, res) => {
  const { userId, productId, qty } = req.body;

  try {
    const cart = await addItemToCart(userId, productId, qty);
    res.status(201).json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/item
// @access  Private
export const updateItem = asyncHandler(async (req, res) => {
  const { userId, productId, qty } = req.body;

  try {
    const cart = await updateCartItemQuantity(userId, productId, qty);
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/item
// @access  Private
export const removeItem = asyncHandler(async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const cart = await removeItemFromCart(userId, productId);
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});