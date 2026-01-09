# API Documentation for Products and Categories

This document outlines the API endpoints for managing products and categories, including examples for frontend integration using `axios` and `fetch`.

## Base URL
### https://iraqi-e-store-api.vercel.app/

## Authentication

Most endpoints require authentication. For web applications, the authentication token is typically stored in cookies. For other clients, ensure you include the authentication token in the `Authorization` header as a Bearer token.

**For Web (Token in Cookies):**

When making requests from a web browser, the authentication token is usually sent automatically via cookies after a successful login. Ensure your `axios` or `fetch` calls include `withCredentials: true` (for axios) or `credentials: 'include'` (for fetch) to send cookies.

**Example with `axios` (for web):**

```javascript
import axios from 'axios';

const config = {
  withCredentials: true, // Important for sending cookies
  headers: {
    'Content-Type': 'application/json' // For JSON payloads
  }
};
```

**Example with `fetch` (for web):**

```javascript
const config = {
  credentials: 'include', // Important for sending cookies
  headers: {
    'Content-Type': 'application/json' // For JSON payloads
  }
};
```
---

## Category Endpoints

### 1. Create a New Category

- **URL:** `/api/categories`
- **Method:** `POST`
- **Access:** Private/Admin
- **Description:** Creates a new category. Requires `name` and optionally an `image` file.

**Request Body (multipart/form-data):**

| Field   | Type   | Required | Description                               |
| :------ | :----- | :------- | :---------------------------------------- |
| `name`  | String | Yes      | Name of the category                      |
| `image` | File   | No       | Category image (field name must be 'image')|

**Example with `axios`:**

```javascript
import axios from 'axios';

const createCategory = async (categoryData, imageFile) => {
  const formData = new FormData();
  for (const key in categoryData) {
    formData.append(key, categoryData[key]);
  }
  if (imageFile) {
    formData.append('image', imageFile); // 'image' must match Multer's expected field name
  }

  try {
    const config = {
      withCredentials: true, // Important for sending cookies
      headers: {
        // 'Content-Type': 'multipart/form-data' is automatically set by browser for FormData
      },
    };
    const response = await axios.post('http://localhost:3000/api/categories', formData, config);
    console.log('Category created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Usage example:
const newCategoryData = {
  name: 'New Category',
};
const imageInput = document.querySelector('#categoryImage'); // Assuming an input type="file" with id="categoryImage"
const imageFile = imageInput.files[0];

createCategory(newCategoryData, imageFile);
```

**Example with `fetch`:**

```javascript
const createCategoryFetch = async (categoryData, imageFile) => {
  const formData = new FormData();
  for (const key in categoryData) {
    formData.append(key, categoryData[key]);
  }
  if (imageFile) {
    formData.append('image', imageFile);
  }

  try {
    const response = await fetch('http://localhost:3000/api/categories', {
      method: 'POST',
      credentials: 'include', // Important for sending cookies
      headers: {
        // 'Content-Type' is automatically set by browser for FormData
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create category');
    }
    console.log('Category created:', data);
    return data;
  } catch (error) {
    console.error('Error creating category:', error.message);
    throw error;
  }
};

// Usage example (same as axios):
// const newCategoryData = { ... };
// const imageInput = document.querySelector('#categoryImage');
// const imageFile = imageInput.files[0];
// createCategoryFetch(newCategoryData, imageFile);
```

### 2. Get All Categories

- **URL:** `/api/categories`
- **Method:** `GET`
- **Access:** Public
- **Description:** Retrieves all categories.

**Example with `axios`:**

```javascript
import axios from 'axios';

const getAllCategories = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/categories');
    console.log('All categories:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error.response ? error.response.data : error.message);
    throw error;
  }
};

getAllCategories();
```

**Example with `fetch`:**

```javascript
const getAllCategoriesFetch = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/categories');
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch categories');
    }
    console.log('All categories:', data);
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    throw error;
  }
};

getAllCategoriesFetch();
```

### 3. Get Category by ID

- **URL:** `/api/categories/:id`
- **Method:** `GET`
- **Access:** Public
- **Description:** Retrieves a single category by its ID.

**Path Parameters:**

| Field | Type   | Description       |
| :---- | :----- | :---------------- |
| `id`  | String | ID of the category|

**Example with `axios`:**

```javascript
import axios from 'axios';

const getCategoryById = async (categoryId) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/categories/${categoryId}`);
    console.log('Category by ID:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching category by ID:', error.response ? error.response.data : error.message);
    throw error;
  }
};

getCategoryById('60d5ec49f8c7b00015f6e4a1'); // Replace with actual category ID
```

**Example with `fetch`:**

```javascript
const getCategoryByIdFetch = async (categoryId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/categories/${categoryId}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch category by ID');
    }
    console.log('Category by ID:', data);
    return data;
  } catch (error) {
    console.error('Error fetching category by ID:', error.message);
    throw error;
  }
};

getCategoryByIdFetch('60d5ec49f8c7b00015f6e4a1');
```

### 4. Update a Category

- **URL:** `/api/categories/:id`
- **Method:** `PUT`
- **Access:** Private/Admin
- **Description:** Updates an existing category. Can update `name` and `image`.

**Path Parameters:**

| Field | Type   | Description       |
| :---- | :----- | :---------------- |
| `id`  | String | ID of the category|

**Request Body (multipart/form-data or application/json):**

Can include `name` and `image`. If updating the image, send `multipart/form-data` with the new `image` file. If only updating `name`, `application/json` can be used.

**Example with `axios` (updating image and name):**

```javascript
import axios from 'axios';

const updateCategory = async (categoryId, updatedData, imageFile) => {
  const formData = new FormData();
  for (const key in updatedData) {
    formData.append(key, updatedData[key]);
  }
  if (imageFile) {
    formData.append('image', imageFile);
  }

  try {
    const config = {
      withCredentials: true, // Important for sending cookies
      headers: {},
    };
    const response = await axios.put(`http://localhost:3000/api/categories/${categoryId}`, formData, config);
    console.log('Category updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Usage example:
const categoryIdToUpdate = '60d5ec49f8c7b00015f6e4a1'; // Replace with actual category ID
const updatedCategoryData = {
  name: 'Updated Category Name',
};
const newImageInput = document.querySelector('#newCategoryImage');
const newImageFile = newImageInput ? newImageInput.files[0] : null;

updateCategory(categoryIdToUpdate, updatedCategoryData, newImageFile);
```

**Example with `axios` (updating only JSON fields):**

```javascript
import axios from 'axios';

const updateCategoryJson = async (categoryId, updatedData) => {
  try {
    const config = {
      withCredentials: true, // Important for sending cookies
      headers: {
        'Content-Type': 'application/json'
      },
    };
    const response = await axios.put(`http://localhost:3000/api/categories/${categoryId}`, updatedData, config);
    console.log('Category updated (JSON):', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating category (JSON):', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Usage example:
const categoryIdToUpdate = '60d5ec49f8c7b00015f6e4a1';
const updatedCategoryDataJson = {
  name: 'Updated Category Name Only',
};

updateCategoryJson(categoryIdToUpdate, updatedCategoryDataJson);
```

**Example with `fetch` (updating image and name):**

```javascript
const updateCategoryFetch = async (categoryId, updatedData, imageFile) => {
  const formData = new FormData();
  for (const key in updatedData) {
    formData.append(key, updatedData[key]);
  }
  if (imageFile) {
    formData.append('image', imageFile);
  }

  try {
    const response = await fetch(`http://localhost:3000/api/categories/${categoryId}`, {
      method: 'PUT',
      credentials: 'include', // Important for sending cookies
      headers: {},
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update category');
    }
    console.log('Category updated:', data);
    return data;
  } catch (error) {
    console.error('Error updating category:', error.message);
    throw error;
  }
};

// Usage example (same as axios):
// const categoryIdToUpdate = '60d5ec49f8c7b00015f6e4a1';
// const updatedCategoryData = { ... };
// const newImageInput = document.querySelector('#newCategoryImage');
// const newImageFile = newImageInput ? newImageInput.files[0] : null;
// updateCategoryFetch(categoryIdToUpdate, updatedCategoryData, newImageFile);
```

**Example with `fetch` (updating only JSON fields):**

```javascript
const updateCategoryJsonFetch = async (categoryId, updatedData) => {
  try {
    const response = await fetch(`http://localhost:3000/api/categories/${categoryId}`, {
      method: 'PUT',
      credentials: 'include', // Important for sending cookies
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update category (JSON)');
    }
    console.log('Category updated (JSON):', data);
    return data;
  } catch (error) {
    console.error('Error updating category (JSON):', error.message);
    throw error;
  }
};

// Usage example:
// const categoryIdToUpdate = '60d5ec49f8c7b00015f6e4a1';
// const updatedCategoryDataJson = { ... };
// updateCategoryJsonFetch(categoryIdToUpdate, updatedCategoryDataJson);
```

### 5. Delete a Category

- **URL:** `/api/categories/:id`
- **Method:** `DELETE`
- **Access:** Private/Admin
- **Description:** Deletes a category by its ID.

**Path Parameters:**

| Field | Type   | Description       |
| :---- | :----- | :---------------- |
| `id`  | String | ID of the category|

**Example with `axios`:**

```javascript
import axios from 'axios';

const deleteCategory = async (categoryId) => {
  try {
    const config = {
      withCredentials: true, // Important for sending cookies
      headers: {},
    };
    const response = await axios.delete(`http://localhost:3000/api/categories/${categoryId}`, config);
    console.log('Category deleted:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error.response ? error.response.data : error.message);
    throw error;
  }
};

deleteCategory('60d5ec49f8c7b00015f6e4a1'); // Replace with actual category ID
```

**Example with `fetch`:**

```javascript
const deleteCategoryFetch = async (categoryId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/categories/${categoryId}`, {
      method: 'DELETE',
      credentials: 'include', // Important for sending cookies
      headers: {},
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete category');
    }
    console.log('Category deleted:', data);
    return data;
  } catch (error) {
    console.error('Error deleting category:', error.message);
    throw error;
  }
};

deleteCategoryFetch('60d5ec49f8c7b00015f6e4a1');
```

---

## Product Endpoints

### 1. إنشاء منتج جديد

- **المسار (URL):** `/api/products`
- **الأسلوب (Method):** `POST`
- **الوصول (Access):** خاص/مسؤول (Private/Admin)
- **الوصف:** ينشئ منتجًا جديدًا. يتطلب `name` و`price` و`category`. ملف `image` مطلوب أيضًا.

**جسم الطلب (Request Body) (multipart/form-data):**

| الحقل          | النوع    | مطلوب | الوصف                                     |
| :------------- | :------ | :------- | :---------------------------------------- |
| `name`         | String  | نعم      | اسم المنتج                                |
| `description`  | String  | لا       | وصف المنتج                                |
| `price`        | Number  | نعم      | سعر المنتج                                |
| `discountedPrice` | Number  | لا       | السعر المخفض (إن وجد)                     |
| `discountActive` | Boolean | لا       | ما إذا كان الخصم نشطًا (يُرسل كـ "true" أو "false" نصًا) |
| `category`     | String  | نعم      | معرف الفئة (Category ID)                  |
| `stock`        | Number  | لا       | كمية المخزون                              |
| `image`        | File    | نعم      | صورة المنتج (يجب أن يكون اسم الحقل 'image')|
| `weights`      | text   | لا       | الأوزان (إن وجدت)                         |
**مثال باستخدام `axios`:**

```javascript
import axios from 'axios';

const createProduct = async (productData, imageFile) => {
  const formData = new FormData();
  for (const key in productData) {
    formData.append(key, productData[key]);
  }
  formData.append('image', imageFile); // 'image' يجب أن يتطابق مع اسم الحقل المتوقع بواسطة Multer

  try {
    const config = {
      withCredentials: true, // مهم لإرسال ملفات تعريف الارتباط (cookies)
      headers: {
        // 'Content-Type': 'multipart/form-data' يتم تعيينه تلقائيًا بواسطة المتصفح لـ FormData
      },
    };
    const response = await axios.post('http://localhost:3000/api/products', formData, config);
    console.log('تم إنشاء المنتج:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في إنشاء المنتج:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// مثال الاستخدام:
const newProductData = {
  name: 'منتج تجريبي',
  description: 'هذا وصف لمنتج تجريبي.',
  price: 100,
  discountedPrice: 80,
  discountActive: 'true', // أرسل كسلسلة نصية
  category: '60d5ec49f8c7b00015f6e4a1', // استبدل بمعرف الفئة الفعلي
  stock: 50,
  weights: '100g, 200g, 300g'
};
const imageInput = document.querySelector('#productImage'); // بافتراض وجود input type="file" بمعرف "productImage"
const imageFile = imageInput.files[0];

if (imageFile) {
  createProduct(newProductData, imageFile);
} else {
  console.error('الرجاء تحديد ملف صورة.');
}
```

**مثال باستخدام `fetch`:**

```javascript
const createProductFetch = async (productData, imageFile) => {
  const formData = new FormData();
  for (const key in productData) {
    formData.append(key, productData[key]);
  }
  formData.append('image', imageFile);

  try {
    const token = 'YOUR_AUTH_TOKEN';
    const response = await fetch('http://localhost:3000/api/products', {
      method: 'POST',
      credentials: 'include', // مهم لإرسال ملفات تعريف الارتباط (cookies)
      headers: {
        // 'Content-Type' يتم تعيينه تلقائيًا بواسطة المتصفح لـ FormData
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'فشل في إنشاء المنتج');
    }
    console.log('تم إنشاء المنتج:', data);
    return data;
  } catch (error) {
    console.error('خطأ في إنشاء المنتج:', error.message);
    throw error;
  }
};

// مثال الاستخدام (نفس مثال axios):
const newProductDataFetch = {
  name: 'منتج تجريبي Fetch',
  description: 'هذا وصف لمنتج تجريبي باستخدام Fetch.',
  price: 150,
  discountedPrice: 120,
  discountActive: 'false',
  category: '60d5ec49f8c7b00015f6e4a1',
  stock: 30,
  weights: '50g, 100g'
};
const imageInputFetch = document.querySelector('#productImage');
const imageFileFetch = imageInputFetch ? imageInputFetch.files[0] : null;

if (imageFileFetch) {
  createProductFetch(newProductDataFetch, imageFileFetch);
} else {
  console.error('الرجاء تحديد ملف صورة.');
}
```

### 2. الحصول على جميع المنتجات

- **المسار (URL):** `/api/products`
- **الأسلوب (Method):** `GET`
- **الوصول (Access):** عام (Public)
- **الوصف:** يسترد جميع المنتجات. يدعم ترقيم الصفحات.

**معلمات الاستعلام (Query Parameters):**

| الحقل    | النوع   | الافتراضي | الوصف                   |
| :------- | :----- | :-------- | :---------------------- |
| `page`   | Number | 1         | رقم الصفحة              |
| `limit`  | Number | 10        | عدد العناصر في كل صفحة |

**مثال باستخدام `axios`:**

```javascript
import axios from 'axios';

const getAllProducts = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/products?page=${page}&limit=${limit}`);
    console.log('جميع المنتجات:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب المنتجات:', error.response ? error.response.data : error.message);
    throw error;
  }
};

getAllProducts();
```

**مثال باستخدام `fetch`:**

```javascript
const getAllProductsFetch = async (page = 1, limit = 10) => {
  try {
    const response = await fetch(`http://localhost:3000/api/products?page=${page}&limit=${limit}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'فشل في جلب المنتجات');
    }
    console.log('جميع المنتجات:', data);
    return data;
  } catch (error) {
    console.error('خطأ في جلب المنتجات:', error.message);
    throw error;
  }
};

getAllProductsFetch();
```

### 3. الحصول على المنتجات حسب الفئة

- **المسار (URL):** `/api/products/category/:categoryId`
- **الأسلوب (Method):** `GET`
- **الوصول (Access):** عام (Public)
- **الوصف:** يسترد المنتجات التي تنتمي إلى فئة معينة. يدعم ترقيم الصفحات.

**معلمات المسار (Path Parameters):**

| الحقل          | النوع   | الوصف             |
| :------------- | :----- | :---------------- |
| `categoryId` | String | معرف الفئة (Category ID)|

**معلمات الاستعلام (Query Parameters):**

| الحقل    | النوع   | الافتراضي | الوصف                   |
| :------- | :----- | :-------- | :---------------------- |
| `page`   | Number | 1         | رقم الصفحة              |
| `limit`  | Number | 10        | عدد العناصر في كل صفحة |

**مثال باستخدام `axios`:**

```javascript
import axios from 'axios';

const getProductsByCategory = async (categoryId, page = 1, limit = 10) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/products/category/${categoryId}?page=${page}&limit=${limit}`);
    console.log(`المنتجات في الفئة ${categoryId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب المنتجات حسب الفئة:', error.response ? error.response.data : error.message);
    throw error;
  }
};

getProductsByCategory('60d5ec49f8c7b00015f6e4a1'); // استبدل بمعرف الفئة الفعلي
```

**مثال باستخدام `fetch`:**

```javascript
const getProductsByCategoryFetch = async (categoryId, page = 1, limit = 10) => {
  try {
    const response = await fetch(`http://localhost:3000/api/products/category/${categoryId}?page=${page}&limit=${limit}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'فشل في جلب المنتجات حسب الفئة');
    }
    console.log(`المنتجات في الفئة ${categoryId}:`, data);
    return data;
  } catch (error) {
    console.error('خطأ في جلب المنتجات حسب الفئة:', error.message);
    throw error;
  }
};

getProductsByCategoryFetch('60d5ec49f8c7b00015f6e4a1');
```

### 4. الحصول على منتج حسب المعرف

- **المسار (URL):** `/api/products/:id`
- **الأسلوب (Method):** `GET`
- **الوصول (Access):** عام (Public)
- **الوصف:** يسترد منتجًا واحدًا بواسطة المعرف الخاص به.

**معلمات المسار (Path Parameters):**

| الحقل | النوع   | الوصف             |
| :---- | :----- | :---------------- |
| `id`  | String | معرف المنتج (Product ID)|

**مثال باستخدام `axios`:**

```javascript
import axios from 'axios';

const getProductById = async (productId) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/products/${productId}`);
    console.log('المنتج بواسطة المعرف:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب المنتج بواسطة المعرف:', error.response ? error.response.data : error.message);
    throw error;
  }
};

getProductById('60d5ec49f8c7b00015f6e4a2'); // استبدل بمعرف المنتج الفعلي
```

**مثال باستخدام `fetch`:**

```javascript
const getProductByIdFetch = async (productId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/products/${productId}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'فشل في جلب المنتج بواسطة المعرف');
    }
    console.log('المنتج بواسطة المعرف:', data);
    return data;
  } catch (error) {
    console.error('خطأ في جلب المنتج بواسطة المعرف:', error.message);
    throw error;
  }
};

getProductByIdFetch('60d5ec49f8c7b00015f6e4a2');
```

### 5. تحديث منتج

- **المسار (URL):** `/api/products/:id`
- **الأسلوب (Method):** `PUT`
- **الوصول (Access):** خاص/مسؤول (Private/Admin)
- **الوصف:** يقوم بتحديث منتج موجود. يمكن تحديث أي حقل، بما في ذلك الصورة.

**معلمات المسار (Path Parameters):**

| الحقل | النوع   | الوصف             |
| :---- | :----- | :---------------- |
| `id`  | String | معرف المنتج (Product ID)|

**جسم الطلب (Request Body) (multipart/form-data أو application/json):**

يمكن أن يتضمن أيًا من الحقول من قسم "إنشاء منتج جديد". إذا كنت تقوم بتحديث الصورة، أرسل `multipart/form-data` مع ملف `image` الجديد. إذا كنت تقوم بتحديث حقول أخرى فقط، يمكن استخدام `application/json`.

**Example with `axios` (updating image and other fields):**

```javascript
import axios from 'axios';

const updateProduct = async (productId, updatedData, imageFile) => {
  const formData = new FormData();
  for (const key in updatedData) {
    formData.append(key, updatedData[key]);
  }
  if (imageFile) {
    formData.append('image', imageFile);
  }

  try {
    const token = 'YOUR_AUTH_TOKEN';
    const config = {
      withCredentials: true, // Important for sending cookies
      headers: {},
    };
    const response = await axios.put(`http://localhost:3000/api/products/${productId}`, formData, config);
    console.log('Product updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Usage example:
const productIdToUpdate = '60d5ec49f8c7b00015f6e4a2'; // Replace with actual product ID
const updatedProductData = {
  name: 'Updated Product Name',
  price: 120,
  discountActive: 'false',
  // ... other fields to update
};
const newImageInput = document.querySelector('#newProductImage');
const newImageFile = newImageInput ? newImageInput.files[0] : null;

updateProduct(productIdToUpdate, updatedProductData, newImageFile);
```

**Example with `axios` (updating only JSON fields):**

```javascript
import axios from 'axios';

const updateProductJson = async (productId, updatedData) => {
  try {
    const token = 'YOUR_AUTH_TOKEN';
    const config = {
      withCredentials: true, // مهم للرسائل الكوكيز
      headers: {
        'Content-Type': 'application/json'
      },
    };
    const response = await axios.put(`http://localhost:3000/api/products/${productId}`, updatedData, config);
    console.log('تم تحديث المنتج (JSON):', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في تحديث المنتج (JSON):', error.response ? error.response.data : error.message);
    throw error;
  }
};

// مثال على الاستخدام:
const productIdToUpdate = '60d5ec49f8c7b00015f6e4a2';
const updatedProductDataJson = {
  name: 'اسم المنتج المحدث فقط',
  stock: 75,
  description: 'وصف المنتج المحدث هنا'
};

updateProductJson(productIdToUpdate, updatedProductDataJson);
```

**Example with `fetch` (updating image and other fields):**

```javascript
const updateProductFetch = async (productId, updatedData, imageFile) => {
  const formData = new FormData();
  for (const key in updatedData) {
    formData.append(key, updatedData[key]);
  }
  if (imageFile) {
    formData.append('image', imageFile);
  }

  try {
    const token = 'YOUR_AUTH_TOKEN';
    const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
      method: 'PUT',
      credentials: 'include', // Important for sending cookies
      headers: {
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update product');
    }
    console.log('Product updated:', data);
    return data;
  } catch (error) {
    console.error('Error updating product:', error.message);
    throw error;
  }
};

// Usage example (same as axios):
// const productIdToUpdate = '60d5ec49f8c7b00015f6e4a2';
// const updatedProductData = { ... };
// const newImageInput = document.querySelector('#newProductImage');
// const newImageFile = newImageInput ? newImageInput.files[0] : null;
// updateProductFetch(productIdToUpdate, updatedProductData, newImageFile);
```

**Example with `fetch` (updating only JSON fields):**

```javascript
const updateProductJsonFetch = async (productId, updatedData) => {
  try {
    const token = 'YOUR_AUTH_TOKEN';
    const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
      method: 'PUT',
      credentials: 'include', // Important for sending cookies
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update product (JSON)');
    }
    console.log('Product updated (JSON):', data);
    return data;
  } catch (error) {
    console.error('Error updating product (JSON):', error.message);
    throw error;
  }
};

// Usage example:
// const productIdToUpdate = '60d5ec49f8c7b00015f6e4a2';
// const updatedProductDataJson = { ... };
// updateProductJsonFetch(productIdToUpdate, updatedProductDataJson);
```

### 6. Delete a Product

- **URL:** `/api/products/:id`
- **Method:** `DELETE`
- **Access:** Private/Admin
- **Description:** Deletes a product by its ID.

**Path Parameters:**

| Field | Type   | Description   |
| :---- | :----- | :------------ |
| `id`  | String | ID of the product|

**Example with `axios`:**

```javascript
import axios from 'axios';

const deleteProduct = async (productId) => {
  try {
    const token = 'YOUR_AUTH_TOKEN';
    const config = {
      withCredentials: true, // Important for sending cookies
      headers: {},
    };
    const response = await axios.delete(`http://localhost:3000/api/products/${productId}`, config);
    console.log('Product deleted:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error.response ? error.response.data : error.message);
    throw error;
  }
};

deleteProduct('60d5ec49f8c7b00015f6e4a3'); // Replace with actual product ID
```

**Example with `fetch`:**

```javascript
const deleteProductFetch = async (productId) => {
  try {
    const token = 'YOUR_AUTH_TOKEN';
    const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
      method: 'DELETE',
      credentials: 'include', // Important for sending cookies
      headers: {
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete product');
    }
    console.log('Product deleted:', data);
    return data;
  } catch (error) {
    console.error('Error deleting product:', error.message);
    throw error;
  }
};

deleteProductFetch('60d5ec49f8c7b00015f6e4a3');
```

### 7. Get Products on Offer

- **URL:** `/api/products/offers`
- **Method:** `GET`
- **Access:** Public
- **Description:** Retrieves products that have an active discount. Supports pagination.

**Query Parameters:**

| Field   | Type   | Default | Description             |
| :------ | :----- | :------ | :---------------------- |
| `page`  | Number | 1       | Page number             |
| `limit` | Number | 10      | Number of items per page|

**Example with `axios`:**

```javascript
import axios from 'axios';

const getOfferProducts = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/products/offers?page=${page}&limit=${limit}`);
    console.log('Offer products:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching offer products:', error.response ? error.response.data : error.message);
    throw error;
  }
};

getOfferProducts();
```

**Example with `fetch`:**

```javascript
const getOfferProductsFetch = async (page = 1, limit = 10) => {
  try {
    const response = await fetch(`http://localhost:3000/api/products/offers?page=${page}&limit=${limit}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch offer products');
    }
    console.log('Offer products:', data);
    return data;
  } catch (error) {
    console.error('Error fetching offer products:', error.message);
    throw error;
  }
};

getOfferProductsFetch();
```


          
لقد قمت بإنشاء مسار جديد للحصول على العدد الإجمالي للمنتجات. إليك شرح له مع مثال باستخدام Axios:

### 8 . get products count

- **المسار (Route):** `GET /api/products/count`
- **الوصف:** هذا المسار مخصص لجلب العدد الإجمالي للمنتجات الموجودة في قاعدة البيانات.
- **الوصول (Access):** عام (Public)، مما يعني أنه يمكن لأي مستخدم الوصول إليه دون الحاجة إلى مصادقة.
- **الاستجابة (Response):** سيعيد كائن JSON يحتوي على حقل `count` يمثل العدد الإجمالي للمنتجات.

**مثال استخدام Axios:**

لجلب عدد المنتجات باستخدام مكتبة Axios في تطبيقك الأمامي (Frontend)، يمكنك استخدام الكود التالي:

```javascript
import axios from 'axios';

const getProductCount = async () => {
  try {
    const response = await axios.get('/api/products/count');
    console.log('Total product count:', response.data.count);
    return response.data.count;
  } catch (error) {
    console.error('Error fetching product count:', error);
    return null;
  }
};

// يمكنك استدعاء الدالة:
getProductCount();
```

**كيف يعمل هذا الكود؟**

1.  `import axios from 'axios';`: يقوم باستيراد مكتبة Axios.
2.  `axios.get('/api/products/count')`: يرسل طلب `GET` إلى المسار `/api/products/count`.
3.  `response.data.count`: عند نجاح الطلب، تحتوي الاستجابة على كائن JSON، ونحن نستخرج قيمة `count` منه.
4.  تتم معالجة الأخطاء المحتملة في كتلة `catch`.

هذا المسار يوفر طريقة فعالة وسريعة للحصول على إحصائية بسيطة لعدد المنتجات دون الحاجة إلى جلب جميع بيانات المنتجات.
        
---
### get Offer Products Count
**المسار الجديد: `GET /api/products/offers/count`**

*   **الغرض:** يتيح لك هذا المسار استرداد العدد الإجمالي للمنتجات التي عليها عروض حاليًا (أي `discountActive` صحيح و `discountPrice` أقل من `price`).
*   **الوصول:** هذا المسار متاح للعامة ولا يتطلب أي مصادقة.
*   **الاستجابة:** سيعيد المسار كائن JSON يحتوي على عدد المنتجات التي تحتوي علي عروض.

**مثال Axios:**

```javascript
import axios from 'axios';

const getOfferProductsCount = async () => {
  try {
    const response = await axios.get('/api/products/offers/count');
    console.log('Total offer product count:', response.data.count);
    return response.data.count; 
  }
}

يمكنك استخدام Axios من الواجهة الأمامية (frontend) لطل...

### 1. إنشاء منتج جديد

- **المسار (URL):** `/api/products`
- **الأسلوب (Method):** `POST`
- **الوصول (Access):** خاص/مسؤول (Private/Admin)
- **الوصف:** ينشئ منتجًا جديدًا. يتطلب `name` و`price` و`category`. ملف `image` مطلوب أيضًا.

**جسم الطلب (Request Body) (multipart/form-data):**

| الحقل          | النوع    | مطلوب | الوصف                                     |
| :------------- | :------ | :------- | :---------------------------------------- |
| `name`         | String  | نعم      | اسم المنتج                                |
| `description`  | String  | لا       | وصف المنتج                                |
| `price`        | Number  | نعم      | سعر المنتج                                |
| `discountedPrice` | Number  | لا       | السعر المخفض (إن وجد)                     |
| `discountActive` | Boolean | لا       | ما إذا كان الخصم نشطًا (يُرسل كـ "true" أو "false" نصًا) |
| `category`     | String  | نعم      | معرف الفئة (Category ID)                  |
| `stock`        | Number  | لا       | كمية المخزون                              |
| `image`        | File    | نعم      | صورة المنتج (يجب أن يكون اسم الحقل 'image')|
| `weights`      | text   | لا       | الأوزان (إن وجدت)                         |
**مثال باستخدام `axios`:**

```javascript
import axios from 'axios';

const createProduct = async (productData, imageFile) => {
  const formData = new FormData();
  for (const key in productData) {
    formData.append(key, productData[key]);
  }
  formData.append('image', imageFile); // 'image' يجب أن يتطابق مع اسم الحقل المتوقع بواسطة Multer

  try {
    const config = {
      withCredentials: true, // مهم لإرسال ملفات تعريف الارتباط (cookies)
      headers: {
        // 'Content-Type': 'multipart/form-data' يتم تعيينه تلقائيًا بواسطة المتصفح لـ FormData
      },
    };
    const response = await axios.post('http://localhost:3000/api/products', formData, config);
    console.log('تم إنشاء المنتج:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في إنشاء المنتج:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// مثال الاستخدام:
const newProductData = {
  name: 'منتج تجريبي',
  description: 'هذا وصف لمنتج تجريبي.',
  price: 100,
  discountedPrice: 80,
  discountActive: 'true', // أرسل كسلسلة نصية
  category: '60d5ec49f8c7b00015f6e4a1', // استبدل بمعرف الفئة الفعلي
  stock: 50,
  weights: '100g, 200g, 300g'
};
const imageInput = document.querySelector('#productImage'); // بافتراض وجود input type="file" بمعرف "productImage"
const imageFile = imageInput.files[0];

if (imageFile) {
  createProduct(newProductData, imageFile);
} else {
  console.error('الرجاء تحديد ملف صورة.');
}
```

**مثال باستخدام `fetch`:**

```javascript
const createProductFetch = async (productData, imageFile) => {
  const formData = new FormData();
  for (const key in productData) {
    formData.append(key, productData[key]);
  }
  formData.append('image', imageFile);

  try {
    const token = 'YOUR_AUTH_TOKEN';
    const response = await fetch('http://localhost:3000/api/products', {
      method: 'POST',
      credentials: 'include', // مهم لإرسال ملفات تعريف الارتباط (cookies)
      headers: {
        // 'Content-Type' يتم تعيينه تلقائيًا بواسطة المتصفح لـ FormData
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'فشل في إنشاء المنتج');
    }
    console.log('تم إنشاء المنتج:', data);
    return data;
  } catch (error) {
    console.error('خطأ في إنشاء المنتج:', error.message);
    throw error;
  }
};

// مثال الاستخدام (نفس مثال axios):
const newProductDataFetch = {
  name: 'منتج تجريبي Fetch',
  description: 'هذا وصف لمنتج تجريبي باستخدام Fetch.',
  price: 150,
  discountedPrice: 120,
  discountActive: 'false',
  category: '60d5ec49f8c7b00015f6e4a1',
  stock: 30,
  weights: '50g, 100g'
};
const imageInputFetch = document.querySelector('#productImage');
const imageFileFetch = imageInputFetch ? imageInputFetch.files[0] : null;

if (imageFileFetch) {
  createProductFetch(newProductDataFetch, imageFileFetch);
} else {
  console.error('الرجاء تحديد ملف صورة.');
}
```

