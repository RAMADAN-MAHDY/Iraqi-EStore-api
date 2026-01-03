# واجهة برمجة تطبيقات التجارة الإلكترونية - دليل جلب الفئات

###  https://iraqi-e-store-api.vercel.app/

يشرح هذا الدليل كيفية جلب بيانات الفئات من واجهة برمجة تطبيقات التجارة الإلكترونية. نقطة نهاية API للفئات هي `/api/categories`.

## نقطة نهاية API


`GET /api/categories`

تقوم نقطة النهاية هذه بجلب جميع الفئات. لا تتطلب مصادقة للوصول العام.

### أمثلة جلب الفئات

فيما يلي أمثلة لكيفية جلب الفئات باستخدام طرق مختلفة:

#### 1. استخدام `fetch` (واجهة برمجة تطبيقات المتصفح الأصلية)

```javascript
// جلب جميع الفئات
fetch('http://localhost:5000/api/categories')
  .then(response => {
    if (!response.ok) {
      throw new Error(`خطأ HTTP! الحالة: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('الفئات (fetch):', data);
  })
  .catch(error => {
    console.error('خطأ أثناء جلب الفئات باستخدام fetch:', error);
  });

// جلب الفئات حسب المعرف (مثال: categoryId = 'someCategoryId')
// استبدل 'someCategoryId' بمعرف فئة حقيقي
fetch('http://localhost:5000/api/categories/someCategoryId')
  .then(response => {
    if (!response.ok) {
      throw new Error(`خطأ HTTP! الحالة: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('الفئة حسب المعرف (fetch):', data);
  })
  .catch(error => {
    console.error('خطأ أثناء جلب الفئة حسب المعرف باستخدام fetch:', error);
  });
```

#### 2. استخدام `axios` (مكتبة عميل HTTP شائعة)

أولاً، تأكد من تثبيت `axios`:
`npm install axios` أو `yarn add axios`

```javascript
import axios from 'axios';

// جلب جميع الفئات
axios.get('http://localhost:5000/api/categories')
  .then(response => {
    console.log('الفئات (axios):', response.data);
  })
  .catch(error => {
    console.error('خطأ أثناء جلب الفئات باستخدام axios:', error);
  });

// جلب الفئات حسب المعرف (مثال: categoryId = 'someCategoryId')
// استبدل 'someCategoryId' بمعرف فئة حقيقي
axios.get('http://localhost:5000/api/categories/someCategoryId')
  .then(response => {
    console.log('الفئة حسب المعرف (axios):', response.data);
  })
  .catch(error => {
    console.error('خطأ أثناء جلب الفئة حسب المعرف باستخدام axios:', error);
  });

## قسم 2: تفاعل واجهة الأمامية مع نظام المصادقة

### 1. إنشاء حساب مستخدم (من خلال <mcfile name="authController.js" path="d:\new valume 1 D\my project\projects with dina abaza\e-comm\controllers\authController.js"></mcfile>)
مسار الخلفية: `POST /api/auth/register`

#### مثال واجهة الأمامية (axios)
```javascript
import axios from 'axios';

const registerUser = async (userData) => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', userData, {
      withCredentials: true // لدعم الكوكيز (من <mcfile name="server.js" path="d:\new valume 1 D\my project\projects with dina abaza\e-comm\server.js"></mcfile>)
    });
    console.log('تم إنشاء الحساب:', response.data);
  } catch (error) {
    console.error('خطأ إنشاء الحساب:', error.response.data);
  }
};

// استدعاء الدالة
registerUser({ username: 'مثال', email: 'مثال@بريد.com', password: '123456' });
```

### 2. تسجيل الدخول (وضع الويب والموبايل)
- وصف الخلفية: من خلال `loginUser` في <mcfile name="authController.js" path="d:\new valume 1 D\my project\projects with dina abaza\e-comm\controllers\authController.js"></mcfile>
- مسار الخلفية: `POST /api/auth/login`

#### مثال واجهة الأمامية (وضع الويب - كوكيز)
```javascript
// من خلال fetch
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'مثال@بريد.com', password: '123456', client: 'web' }),
  credentials: 'include' // لدعم الكوكيز (من <mcfolder name="middleware" path="d:\new valume 1 D\my project\projects with dina abaza\e-comm\middleware"></mcfolder>)
})
.then(response => response.json())
.then(data => console.log('تم تسجيل الدخول:', data))
.catch(error => console.error('خطأ تسجيل الدخول:', error));
```

#### مثال واجهة الأمامية (وضع الموبايل - رموز مميزة)
```javascript
import axios from 'axios';

const loginMobile = async (userData) => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      ...userData,
      client: 'mobile'
    });
    // حفظ الرموز مميزة في تخزين الموبايل
    localStorage.setItem('accessToken', response.data.tokens.accessToken);
    localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
  } catch (error) {
    console.error('خطأ تسجيل الدخول:', error.response.data);
  }
};
```

### 3. تحديث الرمز المميز (refresh token)
- وصف الخلفية: من خلال `refreshAccessToken` في <mcfile name="authController.js" path="d:\new valume 1 D\my project\projects with dina abaza\e-comm\controllers\authController.js"></mcfile>
- مسار الخلفية: `POST /api/auth/refresh-token`

#### مثال واجهة الأمامية
```javascript
const refreshToken = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client: 'web' }),
      credentials: 'include'
    });
    console.log('تم تحديث الرمز المميز:', response.data);
  } catch (error) {
    console.error('خطأ تحديث الرمز المميز:', error);
  }
};
```

### 4. تسجيل الدخول كمسؤول (admin)
- وصف الخلفية: من خلال `logiadmin` في <mcfile name="authController.js" path="d:\new valume 1 D\my project\projects with dina abaza\e-comm\controllers\authController.js"></mcfile> و <mcsymbol name="adminAuthMiddleware" filename="adminAuthMiddleware.js" path="d:\new valume 1 D\my project\projects with dina abaza\e-comm\middleware\adminAuthMiddleware.js" startline="1" type="function"></mcsymbol>
- مسار الخلفية: `POST /api/auth/loginadmin`

#### مثال واجهة الأمامية
```javascript
const loginAdmin = async (adminData) => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/loginadmin', adminData, {
      withCredentials: true
    });
    console.log('تم تسجيل الدخول كمسؤول:', response.data);
  } catch (error) {
    console.error('خطأ تسجيل الدخول كمسؤول:', error.response.data);
  }
};
```


## ملاحظات هامة
- استبدل `http://localhost:5000` بعنوان URL الأساسي لواجهة برمجة التطبيقات الفعلية إذا كان مختلفًا في بيئة النشر الخاصة بك.


