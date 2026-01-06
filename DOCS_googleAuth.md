**نقطة النهاية (Endpoint):**
`POST /api/auth/google`

**الوصف:**
تُستخدم نقطة النهاية هذه لمصادقة المستخدمين باستخدام حسابات Google الخاصة بهم. عندما يقوم المستخدم بتسجيل الدخول عبر Google في الواجهة الأمامية، يتم إرسال رمز (token) من Google إلى هذا الـ endpoint.

**الوصول:**
عام (Public) - لا يتطلب مصادقة مسبقة.

**المدخلات (Request Body):**
يجب أن يكون نوع المحتوى `application/json`.

```json
{
  "token": "<GOOGLE_ID_TOKEN>"
}
```

- `token`: (سلسلة نصية، مطلوب) هو `id_token` الذي يتم الحصول عليه من Google بعد تسجيل دخول المستخدم بنجاح.

**المخرجات (Response):**

**عند النجاح (الحالة 200 OK):**
يتم إرجاع رسالة نجاح، و`accessToken` (رمز الوصول الخاص بالخادم)، وبيانات المستخدم.

```json
{
  "message": "Authenticated successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d0fe4f5e2a7b001c8e4d1a",
    "email": "user@example.com",
    "name": "User Name",
    "avatar": "https://lh3.googleusercontent.com/...",
    "createdAt": "2023-01-01T12:00:00.000Z"
  }
}
```

**عند الفشل (الحالة 400 Bad Request أو 401 Unauthorized):**
يتم إرجاع رسالة خطأ توضح سبب الفشل.

```json
{
  "error": "Token is required"
}
```
أو
```json
{
  "error": "Invalid Google token"
}
```

--- 

### **دمج Google Sign-In في Next.js (مثال باستخدام `react-google-login` أو `next-auth`)**

هناك عدة طرق لدمج Google Sign-In في Next.js. سأقدم مثالًا باستخدام مكتبة شائعة مثل `react-google-login` (أو يمكنك استخدام `next-auth` للحصول على حل أكثر شمولاً).

**الخطوة 1: تثبيت المكتبة**

```bash
npm install react-google-login axios
# أو
yarn add react-google-login axios
```

**الخطوة 2: إعداد متغيرات البيئة في Next.js**

في Next.js، يمكنك استخدام متغيرات البيئة عن طريق إنشاء ملف `.env.local` في جذر مشروعك. لكي تكون المتغيرات متاحة في الواجهة الأمامية (المتصفح)، يجب أن تبدأ بـ `NEXT_PUBLIC_`.

أنشئ ملف `.env.local`:

```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

**ملاحظة:** استبدل `YOUR_GOOGLE_CLIENT_ID` بمعرف العميل الخاص بك من Google Cloud Console.

**الخطوة 3: إنشاء مكون تسجيل الدخول بـ Google**

يمكنك إنشاء مكون React لاستخدام زر تسجيل الدخول من Google. على سبيل المثال، في ملف مثل `components/GoogleSignInButton.js`:

```javascript:/components/GoogleSignInButton.js
import React from 'react';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';

const GoogleSignInButton = () => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleGoogleLoginSuccess = async (response) => {
    try {
      const idToken = response.tokenId;
      console.log('Google ID Token:', idToken);

      const backendResponse = await axios.post(`${apiBaseUrl}/auth/google`, {
        token: idToken,
      });

      console.log('Google Auth Success:', backendResponse.data);

      // هنا يمكنك تخزين accessToken وبيانات المستخدم في حالة التطبيق الخاص بك
      // مثال: localStorage.setItem('accessToken', backendResponse.data.accessToken);
      // وتوجيه المستخدم إلى لوحة التحكم أو الصفحة الرئيسية
      // router.push('/dashboard');

    } catch (error) {
      console.error('Google Auth Error:', error.response ? error.response.data : error.message);
      // التعامل مع الأخطاء، مثل عرض رسالة للمستخدم
    }
  };

  const handleGoogleLoginFailure = (error) => {
    console.error('Google Login Failed:', error);
    // التعامل مع فشل تسجيل الدخول من Google
  };

  return (
    <GoogleLogin
      clientId={clientId}
      buttonText="Login with Google"
      onSuccess={handleGoogleLoginSuccess}
      onFailure={handleGoogleLoginFailure}
      cookiePolicy={'single_host_origin'}
      // يمكنك إضافة المزيد من الخصائص هنا مثل `scope` لطلب أذونات إضافية
    />
  );
};

export default GoogleSignInButton;
```

**الخطوة 4: استخدام المكون في صفحة Next.js**

يمكنك استيراد هذا المكون واستخدامه في أي صفحة أو مكون في تطبيق Next.js الخاص بك، على سبيل المثال في `pages/login.js`:

```javascript:/pages/login.js
import React from 'react';
import GoogleSignInButton from '../components/GoogleSignInButton';

const LoginPage = () => {
  return (
    <div>
      <h1>Login</h1>
      <GoogleSignInButton />
    </div>
  );
};

export default LoginPage;
```

--- 

### **ملاحظات هامة للواجهة الأمامية في Next.js:**

1.  **`NEXT_PUBLIC_GOOGLE_CLIENT_ID`**: تأكد من استبدال هذا بمعرف العميل الخاص بك من Google Cloud Console. يجب أن يبدأ بـ `NEXT_PUBLIC_` ليكون متاحًا في المتصفح.
2.  **تخزين الـ `accessToken`**: بعد الحصول على `accessToken` من الخادم، يجب عليك تخزينه بشكل آمن في الواجهة الأمامية (مثل `localStorage` أو `sessionStorage` أو في حالة Redux/Context API). في Next.js، قد تحتاج إلى التأكد من أنك تقوم بالوصول إلى `localStorage` فقط في بيئة العميل (داخل `useEffect` أو بعد التحقق من `typeof window !== 'undefined'`) لتجنب أخطاء SSR.
3.  **إرسال الـ `accessToken`**: في الطلبات اللاحقة التي تتطلب مصادقة، يجب إرسال `accessToken` في رأس الطلب (Authorization header) كـ `Bearer Token`.
    ```javascript
    // مثال لطلب يتطلب مصادقة في Next.js
    import axios from 'axios';

    const getProtectedData = async () => {
      const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null; 
      if (!accessToken) {
        console.log('No access token found.');
        return;
      }
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axios.get(`${apiBaseUrl}/protected-route`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log('Protected Data:', response.data);
      } catch (error) {
        console.error('Error fetching protected data:', error);
      }
    };
    ```
4.  **التعامل مع الأخطاء**: يجب دائمًا التعامل مع الأخطاء المحتملة من الخادم وعرض رسائل مناسبة للمستخدم.
5.  **`next-auth`**: إذا كنت تبحث عن حل مصادقة أكثر قوة وشمولية لتطبيق Next.js، فإن `next-auth` هو خيار ممتاز يدعم Google OAuth ويوفر إدارة الجلسات والمزيد من الميزات الجاهزة للاستخدام.

        