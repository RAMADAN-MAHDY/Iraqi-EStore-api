## التعامل مع إدارة الطلبات (Orders) من الواجهة الأمامية

لقد قمنا بتجهيز المسارات (routes) التالية في الواجهة الخلفية لإدارة الطلبات:

1.  **إنشاء طلب جديد (Create Order):**
    *   المسار: `/api/orders`
    *   النوع: `POST`
    *   الوصول: خاص (يتطلب مصادقة المستخدم)
    *   يستخدم لإنشاء طلب جديد بناءً على سلة التسوق الخاصة بالمستخدم.

2.  **الحصول على طلبات المستخدم (Get User Orders):**
    *   المسار: `/api/orders/:userId`
    *   النوع: `GET`
    *   الوصول: خاص (يتطلب مصادقة المستخدم)
    *   يستخدم لجلب جميع الطلبات الخاصة بمستخدم معين.

3.  **الحصول على جميع الطلبات (Get All Orders):**
    *   المسار: `/api/orders`
    *   النوع: `GET`
    *   الوصول: خاص بالمسؤول (يتطلب مصادقة المسؤول)
    *   يستخدم لجلب جميع الطلبات في النظام (للمسؤولين فقط).

4.  **تحديث حالة الطلب (Update Order Status):**
    *   المسار: `/api/orders/status`
    *   النوع: `PUT`
    *   الوصول: خاص بالمسؤول (يتطلب مصادقة المسؤول)
    *   يستخدم لتحديث حالة طلب معين (مثل: `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`).

5.  **حذف طلب (Delete Order):**
    *   المسار: `/api/orders/:id`
    *   النوع: `DELETE`
    *   الوصول: خاص بالمسؤول (يتطلب مصادقة المسؤول)
    *   يستخدم لحذف طلب معين من النظام.

### ملاحظة هامة حول المصادقة (Authentication):

**يتم إرسال التوكن (JWT) تلقائيًا عبر الكوكيز (Cookies) مع كل طلب.** لا تحتاج إلى إرساله يدويًا في الـ `headers` عند استخدام `fetch` أو `axios` إذا كنت تتعامل مع نفس النطاق (domain) أو إذا تم إعداد `credentials: 'include'` بشكل صحيح في طلباتك.

--- 

### 1. إنشاء طلب جديد (Create Order)

#### باستخدام `axios`

```javascript
import axios from 'axios';

const createNewOrder = async (userId, address, phone) => {
  try {
    const response = await axios.post('/api/orders', {
      userId,
      address,
      phone,
    }, {
      withCredentials: true, // مهم لإرسال الكوكيز
    });
    console.log('تم إنشاء الطلب بنجاح:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في إنشاء الطلب:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// مثال على الاستخدام:
// createNewOrder('user_id_here', '123 Main St, City', '123-456-7890');
```

#### باستخدام `fetch`

```javascript
const createNewOrder = async (userId, address, phone) => {
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        address,
        phone,
      }),
      credentials: 'include', // مهم لإرسال الكوكيز
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('تم إنشاء الطلب بنجاح:', data);
    return data;
  } catch (error) {
    console.error('خطأ في إنشاء الطلب:', error);
    throw error;
  }
};

// مثال على الاستخدام:
// createNewOrder('user_id_here', '123 Main St, City', '123-456-7890');
```

### 2. الحصول على طلبات المستخدم (Get User Orders)

#### باستخدام `axios`

```javascript
import axios from 'axios';

const getUserOrders = async (userId) => {
  try {
    const response = await axios.get(`/api/orders/${userId}`, {
      withCredentials: true, // مهم لإرسال الكوكيز
    });
    console.log('طلبات المستخدم:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب طلبات المستخدم:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// مثال على الاستخدام:
// getUserOrders('user_id_here');
```

#### باستخدام `fetch`

```javascript
const getUserOrders = async (userId) => {
  try {
    const response = await fetch(`/api/orders/${userId}`, {
      method: 'GET',
      credentials: 'include', // مهم لإرسال الكوكيز
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('طلبات المستخدم:', data);
    return data;
  } catch (error) {
    console.error('خطأ في جلب طلبات المستخدم:', error);
    throw error;
  }
};

// مثال على الاستخدام:
// getUserOrders('user_id_here');
```

### 3. الحصول على جميع الطلبات (Get All Orders) - للمسؤولين فقط

#### باستخدام `axios`

```javascript
import axios from 'axios';

const getAllOrders = async () => {
  try {
    const response = await axios.get('/api/orders', {
      withCredentials: true, // مهم لإرسال الكوكيز
    });
    console.log('جميع الطلبات:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب جميع الطلبات:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// مثال على الاستخدام:
// getAllOrders();
```

#### باستخدام `fetch`

```javascript
const getAllOrders = async () => {
  try {
    const response = await fetch('/api/orders', {
      method: 'GET',
      credentials: 'include', // مهم لإرسال الكوكيز
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('جميع الطلبات:', data);
    return data;
  } catch (error) {
    console.error('خطأ في جلب جميع الطلبات:', error);
    throw error;
  }
};

// مثال على الاستخدام:
// getAllOrders();
```

### 4. تحديث حالة الطلب (Update Order Status) - للمسؤولين فقط

#### باستخدام `axios`

```javascript
import axios from 'axios';

const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.put('/api/orders/status', {
      orderId,
      status,
    }, {
      withCredentials: true, // مهم لإرسال الكوكيز
    });
    console.log('تم تحديث حالة الطلب بنجاح:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في تحديث حالة الطلب:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// مثال على الاستخدام:
// updateOrderStatus('order_id_here', 'shipped');
```

#### باستخدام `fetch`

```javascript
const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await fetch('/api/orders/status', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
        status,
      }),
      credentials: 'include', // مهم لإرسال الكوكيز
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('تم تحديث حالة الطلب بنجاح:', data);
    return data;
  } catch (error) {
    console.error('خطأ في تحديث حالة الطلب:', error);
    throw error;
  }
};

// مثال على الاستخدام:
// updateOrderStatus('order_id_here', 'delivered');
```

### 5. حذف طلب (Delete Order) - للمسؤولين فقط

#### باستخدام `axios`

```javascript
import axios from 'axios';

const deleteOrder = async (orderId) => {
  try {
    const response = await axios.delete(`/api/orders/${orderId}`, {
      withCredentials: true, // مهم لإرسال الكوكيز
    });
    console.log('تم حذف الطلب بنجاح:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في حذف الطلب:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// مثال على الاستخدام:
// deleteOrder('order_id_here');
```

#### باستخدام `fetch`

```javascript
const deleteOrder = async (orderId) => {
  try {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: 'DELETE',
      credentials: 'include', // مهم لإرسال الكوكيز
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('تم حذف الطلب بنجاح:', data);
    return data;
  } catch (error) {
    console.error('خطأ في حذف الطلب:', error);
    throw error;
  }
};

// مثال على الاستخدام:
// deleteOrder('order_id_here');
```

آمل أن يكون هذا الشرح مفيدًا لك في دمج إدارة الطلبات في الواجهة الأمامية!