import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

// Initialize invisible reCAPTCHA programmatically
export const setupRecaptcha = () => {
  const auth = getAuth();
  return new RecaptchaVerifier(
    "recaptcha-container", // can be a hidden div in DOM or just any id
    { size: "invisible" },
    auth,
  );
};

// Send OTP programmatically
export const sendOtp = async (phoneNumber) => {
  const auth = getAuth();
  const appVerifier = setupRecaptcha();
  const confirmationResult = await signInWithPhoneNumber(
    auth,
    phoneNumber,
    appVerifier,
  );
  return confirmationResult; // contains .confirm(otp)
};
