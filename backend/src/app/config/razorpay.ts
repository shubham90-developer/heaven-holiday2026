// utils/razorpay.ts

import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay
export const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Function to create Razorpay order
export const createRazorpayOrder = async (
  amount: number,
  bookingId: string,
) => {
  try {
    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: bookingId,
      notes: {
        bookingId: bookingId,
        description: 'Tour Package Booking Payment',
      },
    };

    const order = await razorpayInstance.orders.create(options);
    return order;
  } catch (error) {
    throw error;
  }
};

// Function to verify payment signature
export const verifyRazorpaySignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
): boolean => {
  try {
    const text = razorpayOrderId + '|' + razorpayPaymentId;

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex');

    return generatedSignature === razorpaySignature;
  } catch (error) {
    return false;
  }
};
