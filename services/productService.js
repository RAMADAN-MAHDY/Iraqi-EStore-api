import Product from '../models/Product.js';

/**
 * Calculate discount details based on price and discount settings.
 * @param {number} price - Original price
 * @param {number} discountPrice - Price after discount
 * @param {boolean} discountActive - Whether discount is active
 * @returns {object} { discountPercent, discountPrice, discountActive }
 */
const calculateDiscount = (price, discountPrice, discountActive) => {
  if (!discountActive) {
    return {
      discountPercent: 0,
      discountPrice: price,
      discountActive: false
    };
  }

  // Business Rule: If discountActive is true, discountPrice must be less than price
  if (discountPrice >= price) {
    throw new Error("Discount price must be less than the original price (سعر الخصم يجب أن يكون أقل من السعر الأصلي)");
  }

  const discountPercent = parseFloat(((price - discountPrice) / price * 100).toFixed(2));

  return {
    discountPercent,
    discountPrice,
    discountActive: true
  };
};

export const createProduct = async (data) => {
  const {
    name,
    price,
    category,
    image,
    weight,
    description,
    stock,
    discountActive = false
  } = data;

  // Handle both field names (legacy support)
  const inputDiscountPrice = data.discountPrice ?? data.discountedPrice ?? price;

  // Calculate Discount Logic
  const discountDetails = calculateDiscount(price, inputDiscountPrice, discountActive);

  const product = new Product({
    name,
    price,
    category,
    image,
    weight,
    description,
    stock: stock ?? 0, // Default stock to 0 if not provided
    ...discountDetails
  });

  await product.save();
  return product;
};

export const getProducts = async (categoryId = null, page = 1, limit = 10) => {
  const query = categoryId ? { category: categoryId } : {};
  const products = await Product.find(query)
    .populate('category')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();
  const count = await Product.countDocuments(query);
  return { products, totalPages: Math.ceil(count / limit), currentPage: page };
};

export const getProductById = async (id) => {
  return await Product.findById(id).populate('category');
};

export const updateProduct = async (id, updates) => {
  const product = await Product.findById(id);
  if (!product) {
    const error = new Error("Product not found (المنتج غير موجود)");
    error.statusCode = 404;
    throw error;
  }

  // Determine new values for price/discount calculation
  // Use new value if present in updates, otherwise keep existing
  const newPrice = updates.price !== undefined ? updates.price : product.price;
  
  // Handle discountPrice/discountedPrice from updates
  let newDiscountPrice = product.discountPrice;
  if (updates.discountPrice !== undefined) newDiscountPrice = updates.discountPrice;
  else if (updates.discountedPrice !== undefined) newDiscountPrice = updates.discountedPrice;
  // If price changed but discount didn't, we still have newDiscountPrice = old discountPrice. 
  // If discount wasn't active, it might be equal to price. 
  // We need to be careful. If user only updates price, what happens to discount?
  // Usually, we re-validate the existing relationship.
  
  const newDiscountActive = updates.discountActive !== undefined ? updates.discountActive : product.discountActive;

  // Recalculate if any pricing field is affected
  if (
    updates.price !== undefined ||
    updates.discountPrice !== undefined ||
    updates.discountedPrice !== undefined ||
    updates.discountActive !== undefined
  ) {
    // If we are enabling discount but didn't provide a new discount price,
    // and the old discount price is invalid (>= new price), we should check.
    // However, calculateDiscount will throw if invalid.
    
    // Corner case: User updates price to 100 (was 200), discountPrice was 150. discountActive=true.
    // newPrice=100, newDiscountPrice=150. 150 >= 100 -> Error. Correct.
    
    // Corner case: User updates discountActive=true. price=100. discountPrice=100 (default).
    // 100 >= 100 -> Error. User must provide discountPrice if enabling discount.
    
    // We should allow implicit fallback? No, explicit is better for "Production-ready".
    // But let's be safe: if discountPrice is not provided in updates, and we are activating it, 
    // we use the old one. If old one is invalid, we throw.
    
    const discountDetails = calculateDiscount(newPrice, newDiscountPrice, newDiscountActive);
    Object.assign(updates, discountDetails);
    
    // Cleanup redundant fields from updates to avoid overwriting (though assign handles it)
    delete updates.discountedPrice; 
  }

  // Atomic Update
  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true }
  );

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
  const query = { discountActive: true, $expr: { $lt: ['$discountPrice', '$price'] } };
  const products = await Product.find(query)
    .populate('category')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();
  const count = await Product.countDocuments(query);
  return { products, totalPages: Math.ceil(count / limit), currentPage: page };
};

// ==========================
// Search Products
// ==========================
export const searchProducts = async (keyword, page = 1, limit = 10) => {
  if (!keyword) return { products: [], totalPages: 0, currentPage: page };

  const query = { $text: { $search: keyword } };

  const products = await Product.find(query, 'name price discountPrice discountPercent discountActive stock category image weight description')
    .populate('category', 'name')
    .sort({ score: { $meta: 'textScore' } })
    .limit(limit)
    .skip((page - 1) * limit)
    .lean();

  // Calculate final price for display
  const productsWithFinalPrice = products.map(p => {
    let finalPrice = p.price;
    if (p.discountActive) {
      if (p.discountPrice != null) finalPrice = p.discountPrice;
      else if (p.discountPercent != null) finalPrice = p.price - (p.price * p.discountPercent / 100);
    }
    return { ...p, finalPrice };
  });

  const count = await Product.countDocuments(query);

  return { 
    products: productsWithFinalPrice,
    totalPages: Math.ceil(count / limit),
    currentPage: page
  };
};

export const getProductCount = async () => {
  return await Product.countDocuments();
};

export const getOfferProductCount = async () => {
  const query = { discountActive: true, $expr: { $lt: ['$discountPrice', '$price'] } };
  return await Product.countDocuments(query);
};

// ==========================
// Autocomplete Products
// ==========================
export const autocompleteProducts = async (keyword, limit = 5) => {
  if (!keyword) return [];

  const regex = new RegExp(`^${keyword}`, 'i');

  const products = await Product.find(
    { name: regex },
    { name: 1, price: 1, discountPrice: 1, discountPercent: 1, discountActive: 1 , description: 1 }
  )
    .sort({ name: 1 })
    .limit(limit)
    .lean();

  return products.map(p => {
    let finalPrice = p.price;
    if (p.discountActive) {
      if (p.discountPrice != null) finalPrice = p.discountPrice;
      else if (p.discountPercent != null) finalPrice = p.price - (p.price * p.discountPercent / 100);
    }

    return {
      _id: p._id,
      name: p.name,
      finalPrice
    };
  });
};
