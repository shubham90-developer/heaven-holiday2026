// src/app/config/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBTBF0QsmULhUV1XOyVR5ptCZf5kkELE_8",
  authDomain: "heaven-6f1e8.firebaseapp.com",
  projectId: "heaven-6f1e8",
  storageBucket: "heaven-6f1e8.firebasestorage.app",
  messagingSenderId: "958256687073",
  appId: "1:958256687073:web:41f266c07e15c92d58d4a0",
  measurementId: "G-XVHTF8QH39",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize auth
const auth = getAuth(app);

// Initialize invisible reCAPTCHA programmatically
export const setupRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          console.log("reCAPTCHA verified");
        },
      },
    );
  }
  return window.recaptchaVerifier;
};

// Send OTP programmatically
export const sendOtp = async (phoneNumber) => {
  try {
    const appVerifier = setupRecaptcha();
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      appVerifier,
    );
    return confirmationResult; // contains .confirm(otp)
  } catch (error) {
    console.error("Error sending OTP:", error);
    // Clear recaptcha on error so it can be retried
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
    throw error;
  }
};

// Clear recaptcha verifier
export const clearRecaptcha = () => {
  if (window.recaptchaVerifier) {
    window.recaptchaVerifier.clear();
    window.recaptchaVerifier = null;
  }
};

export { app, auth };
