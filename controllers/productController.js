import asyncHandler from 'express-async-handler';
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from '../services/productService.js';

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
export const create = asyncHandler(async (req, res) => {
  const { name, price, category, stock, image } = req.body;

  try {
    const product = await createProduct(name, price, category, stock, image);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get all products or products by category
// @route   GET /api/products or /api/products/category/:categoryId
// @access  Public
export const getAll = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  try {
    const products = await getProducts(categoryId, page, limit);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
export const getById = asyncHandler(async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const update = asyncHandler(async (req, res) => {
  const { name, price, category, stock, image } = req.body;

  try {
    const product = await updateProduct(req.params.id, name, price, category, stock, image);
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const remove = asyncHandler(async (req, res) => {
  try {
    const result = await deleteProduct(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});