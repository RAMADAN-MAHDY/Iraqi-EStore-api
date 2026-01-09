# Phone Number Authentication with Twilio OTP (Next.js Frontend)

This document outlines how to integrate phone number authentication with SMS verification using Twilio OTP for a Next.js frontend application.

## 1. Send OTP Code

To initiate the phone number verification process, the frontend needs to send a request to the backend to generate and send an OTP (One-Time Password) to the user's provided phone number.

**Endpoint:** `POST /api/auth/send-otp`

**Request Body:**

```json
{
  "phone": "+1234567890" // User's phone number with country code
}
```

**Example using Axios:**

```javascript
import axios from 'axios';

const sendOtpCode = async (phoneNumber) => {
  try {
    const response = await axios.post('/api/auth/send-otp', {
      phone: phoneNumber,
    });
    console.log(response.data.message); // OTP sent successfully
    return response.data;
  } catch (error) {
    console.error('Error sending OTP:', error.response.data.message);
    throw error;
  }
};

// Usage
sendOtpCode('+1234567890');
```

## 2. Verify OTP Code and Login

After the user receives the OTP, they will input it into the frontend. The frontend then sends this OTP along with the phone number to the backend for verification. If the OTP is valid, the user will be logged in, and the backend will return authentication tokens (e.g., JWTs).

**Endpoint:** `POST /api/auth/verify-otp`

**Request Body:**

```json
{
  "phone": "+1234567890",
  "otpCode": "123456" // The OTP received by the user
}
```

**Example using Axios:**

```javascript
import axios from 'axios';

const verifyOtpCode = async (phoneNumber, otp) => {
  try {
    const response = await axios.post('/api/auth/verify-otp', {
      phone: phoneNumber,
      otpCode: otp,
    });
    console.log(response.data.message); // Login successful
    // Store tokens (e.g., in cookies or local storage) and redirect user
    console.log('User:', response.data.user);
    return response.data;
  } catch (error) {
    console.error('Error verifying OTP:', error.response.data.message);
    throw error;
  }
};

// Usage
verifyOtpCode('+1234567890', '123456');
```

## 3. Handling Authentication Tokens

Upon successful OTP verification and login, the backend will set `accessToken` and `refreshToken` as HTTP-only cookies. Your Next.js frontend should be configured to automatically send these cookies with subsequent requests to authenticated endpoints. You typically don't need to manually access these cookies from JavaScript in the browser due to the `httpOnly` flag, which enhances security.

If you need to access user information on the frontend, the login response will include a `user` object. You can store this information in your application's state management (e.g., Redux, React Context) or local storage (with caution for sensitive data).

## Important Considerations for Next.js:

*   **API Routes:** For Next.js, you would typically create API routes (e.g., `pages/api/auth/send-otp.js` and `pages/api/auth/verify-otp.js`) that proxy these requests to your backend. This helps in managing environment variables securely and can simplify cookie handling.
*   **Environment Variables:** Ensure your Twilio `ACCOUNT_SID` and `AUTH_TOKEN` are securely stored as environment variables in your backend (`.env` file) and not exposed to the frontend.
*   **Error Handling:** Implement robust error handling on the frontend to provide meaningful feedback to the user (e.g., invalid phone number, incorrect OTP, network issues).
*   **UI/UX:** Design a clear user interface for entering phone numbers and OTPs, including loading states and success/error messages.
*   **Rate Limiting:** The backend already includes rate limiting. Ensure your frontend doesn't spam the `send-otp` endpoint.

This documentation provides a basic guide. Depending on your application's specific needs, you might need to implement additional features like OTP retry mechanisms, cooldown periods, and more advanced error handling.