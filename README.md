# واجهة برمجة تطبيقات التجارة الإلكترونية - دليل جلب الفئات

يشرح هذا الدليل كيفية جلب بيانات الفئات من واجهة برمجة تطبيقات التجارة الإلكترونية. نقطة نهاية API للفئات هي `/api/categories`.

## نقطة نهاية API

`GET /api/categories`

تقوم نقطة النهاية هذه بجلب جميع الفئات. لا تتطلب مصادقة للوصول العام.

## أمثلة

فيما يلي أمثلة لكيفية جلب الفئات باستخدام طرق مختلفة:

### 1. استخدام `fetch` (واجهة برمجة تطبيقات المتصفح الأصلية)

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

### 2. استخدام `axios` (مكتبة عميل HTTP شائعة)

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
```


تذكر استبدال `http://localhost:5000` بعنوان URL الأساسي لواجهة برمجة التطبيقات الفعلية إذا كان مختلفًا في بيئة النشر الخاصة بك.
