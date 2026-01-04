import Product from '../models/Product.js';

export const createProduct = async (name, price, discountedPrice, discountActive, category, stock, image) => {
    // Safety check
    if (price <= 0) {
      throw new Error("Price must be greater than 0");
    }
  
    let finalDiscountPercent = 0;
    let finalDiscountPrice = price;
  
    if (discountActive && discountedPrice < price) {
      finalDiscountPercent = ((price - discountedPrice) / price) * 100;
      finalDiscountPercent = Math.max(0, parseFloat(finalDiscountPercent.toFixed(2))); // تقريب للـ 2 decimal
      finalDiscountPrice = discountedPrice;
    } else {
      discountActive = false;
      finalDiscountPrice = price;
    }
  
    const product = new Product({
      name,
      price,
      discountPercent: finalDiscountPercent,
      discountActive,
      discountPrice: finalDiscountPrice,
      category,
      stock,
      image,
    });
  
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

export const updateProduct = async (id, updates) => {
    const product = await Product.findById(id);
  
    if (!product) {
      const error = new Error("Product not found (المنتج غير موجود)");
      error.statusCode = 404;
      throw error;
    }
  
    // حذف أي undefined عشان MongoDB
    Object.keys(updates).forEach(
      key => updates[key] === undefined && delete updates[key]
    );
  
    // حساب الخصم
    if (
      updates.price !== undefined ||
      updates.discountPrice !== undefined ||
      updates.discountActive !== undefined
    ) {
      // Validate discount conditions if discountActive is true
      if (updates.discountActive === true && updates.discountPrice !== undefined && updates.discountPrice >= (updates.price ?? product.price)) {
        console.warn('Warning: discountActive is true but discountedPrice is not less than the product price. This will set discountPercent to 0.');
      }
      const price = updates.price ?? product.price;
      const discountedPrice = updates.discountPrice ?? product.discountPrice ?? price;
      const discountActive = updates.discountActive ?? product.discountActive ?? false;
  
      updates.discountPercent = (discountActive && discountedPrice < price)
        ? parseFloat(((price - discountedPrice) / price * 100).toFixed(2))
        : 0;
  
      updates.discountPrice = (discountActive && discountedPrice < price) ? discountedPrice : price;
      updates.discountActive = discountActive && discountedPrice < price;
    }


  
    // تحديث بشكل Atomic
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
  
    if (!updatedProduct) {
      const error = new Error("Product not found after update (المنتج غير موجود بعد التحديث)");
      error.statusCode = 404;
      throw error;
    }
  
    return {
      status: "Success (نجاح)",
      event: "Product Updated (تم تحديث المنتج)",
      product: updatedProduct
    };
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

export const getOfferProducts = async (page = 1, limit = 10) => {
  const query = { discountActive: true, discountPrice: { $lt: '$price' } };
  const products = await Product.find(query)
    .populate('category', 'name')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();
  const count = await Product.countDocuments(query);
  return { products, totalPages: Math.ceil(count / limit), currentPage: page };
};