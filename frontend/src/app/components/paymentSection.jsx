"use client";
import React, { useState } from "react";
import {
  FaCreditCard,
  FaMoneyBillWave,
  FaMobileAlt,
  FaUniversity,
  FaWallet,
  FaCheckCircle,
} from "react-icons/fa";
import { useAddPaymentMutation } from "store/bookingApi/bookingApi";

const PaymentSection = ({ bookingData, advanceAmount, totalPrice }) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentType, setPaymentType] = useState("advance"); // 'advance' or 'full'
  const [transactionId, setTransactionId] = useState("");
  const [remarks, setRemarks] = useState("");

  const [addPayment, { isLoading: isProcessingPayment }] =
    useAddPaymentMutation();

  const paymentMethods = [
    { value: "Card", label: "Credit/Debit Card", icon: FaCreditCard },
    { value: "UPI", label: "UPI", icon: FaMobileAlt },
    { value: "Net Banking", label: "Net Banking", icon: FaUniversity },
    { value: "Cash", label: "Cash", icon: FaMoneyBillWave },
    { value: "Wallet", label: "Wallet", icon: FaWallet },
  ];

  const paymentAmount = paymentType === "advance" ? advanceAmount : totalPrice;

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    try {
      const paymentData = {
        paymentId:
          `PAY${Date.now()}${Math.random().toString(36).substr(2, 9)}`.toUpperCase(),
        amount: paymentAmount,
        paymentMethod: paymentMethod,
        paymentStatus: "Success", // In real scenario, this would come from payment gateway
        transactionId: transactionId || `TXN${Date.now()}`,
        remarks: remarks,
      };

      await addPayment({
        bookingId: bookingData.bookingId,
        paymentData: paymentData,
      }).unwrap();

      alert("Payment successful! Your booking is confirmed.");
      // Redirect to booking confirmation page or show success modal
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Booking Confirmation */}
      <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
        <div className="flex items-center gap-3 mb-4">
          <FaCheckCircle className="text-green-600 text-3xl" />
          <div>
            <h2 className="text-xl font-semibold text-green-800">
              Booking Created Successfully!
            </h2>
            <p className="text-sm text-green-700">
              Booking ID: {bookingData.bookingId}
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-700">
          Complete your payment to confirm your booking
        </p>
      </div>

      {/* Payment Type Selection */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">Select Payment Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => setPaymentType("advance")}
            className={`p-4 border-2 rounded-lg cursor-pointer transition ${
              paymentType === "advance"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 hover:border-blue-400"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-800">
                Advance Payment (20%)
              </span>
              {paymentType === "advance" && (
                <FaCheckCircle className="text-blue-600" />
              )}
            </div>
            <p className="text-2xl font-bold text-orange-600">
              ₹{advanceAmount.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Pay 20% now and rest before departure
            </p>
          </div>

          <div
            onClick={() => setPaymentType("full")}
            className={`p-4 border-2 rounded-lg cursor-pointer transition ${
              paymentType === "full"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 hover:border-blue-400"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-800">Full Payment</span>
              {paymentType === "full" && (
                <FaCheckCircle className="text-blue-600" />
              )}
            </div>
            <p className="text-2xl font-bold text-green-600">
              ₹{totalPrice.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Pay full amount now and save time
            </p>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <div
                key={method.value}
                onClick={() => setPaymentMethod(method.value)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition flex flex-col items-center justify-center ${
                  paymentMethod === method.value
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400"
                }`}
              >
                <Icon
                  className={`text-3xl mb-2 ${
                    paymentMethod === method.value
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`}
                />
                <span className="text-xs font-medium text-center">
                  {method.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Form */}
      <form
        onSubmit={handlePaymentSubmit}
        className="bg-white p-6 rounded-xl shadow"
      >
        <h3 className="text-lg font-semibold mb-4">Payment Details</h3>

        <div className="space-y-4">
          {/* Transaction ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction ID (Optional)
            </label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter transaction ID if available"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Remarks (Optional)
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add any additional notes"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Payment Summary */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Payment Method:</span>
              <span className="font-semibold">
                {paymentMethod || "Not selected"}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Payment Type:</span>
              <span className="font-semibold">
                {paymentType === "advance" ? "Advance (20%)" : "Full Payment"}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-gray-800 font-semibold">
                Amount to Pay:
              </span>
              <span className="text-2xl font-bold text-blue-600">
                ₹{paymentAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!paymentMethod || isProcessingPayment}
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessingPayment
              ? "Processing Payment..."
              : `Pay ₹${paymentAmount.toLocaleString("en-IN")}`}
          </button>
        </div>
      </form>

      {/* Payment Info */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">
          Payment Information:
        </h4>
        <ul className="text-xs text-gray-700 space-y-1">
          <li>• Your payment is 100% secure and encrypted</li>
          <li>• Advance payment of 20% is required to confirm your booking</li>
          <li>• Balance payment must be completed 15 days before departure</li>
          <li>• You will receive booking confirmation via email and SMS</li>
          <li>• Refunds are subject to cancellation policy</li>
        </ul>
      </div>
    </div>
  );
};

export default PaymentSection;
