import Product from '../models/Product.js';

export const createProduct = async (name, price, category, stock, image) => {
  const product = new Product({ name, price, category, stock, image });
  await product.save();
  return product;
};

export const getProducts = async (categoryId = null, page = 1, limit = 10) => {
  const query = categoryId ? { category: categoryId } : {};
  const products = await Product.find(query)
    .populate('category', 'name')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();
  const count = await Product.countDocuments(query);
  return { products, totalPages: Math.ceil(count / limit), currentPage: page };
};

export const getProductById = async (id) => {
  return await Product.findById(id).populate('category', 'name');
};

export const updateProduct = async (id, name, price, category, stock, image) => {
  const product = await Product.findById(id);
  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock || product.stock;
    product.image = image || product.image;
    await product.save();
    return product;
  } else {
    throw new Error('Product not found');
  }
};

export const deleteProduct = async (id) => {
  const product = await Product.findById(id);
  if (product) {
    await product.deleteOne();
    return { message: 'Product removed' };
  } else {
    throw new Error('Product not found');
  }
};