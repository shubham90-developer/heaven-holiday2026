"use client";
import React, { useState } from "react";
import { X } from "lucide-react";

const PricingModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div>
      {/* Trigger Link */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          openModal();
        }}
        className="text-blue-300 underline font-semibold"
      >
        View Pricing Table
      </a>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-500 cursor-pointer bg-gray-300 p-2 rounded-full"
              onClick={closeModal}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <h2 className="text-lg font-bold mb-1">Detailed Tour price</h2>
            <p className="text-sm text-gray-500 mb-4">
              Prices & discounts are Per Person only.
            </p>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-3 border-b">Room Type</th>
                    <th className="p-3 border-b">Basic Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border-b">Single Occupancy</td>
                    <td className="p-3 border-b">₹36,000</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 border-b">Twin Sharing</td>
                    <td className="p-3 border-b">₹30,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 border-b">Triple Sharing</td>
                    <td className="p-3 border-b">₹29,000</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 border-b">Infant</td>
                    <td className="p-3 border-b">₹6,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 border-b">
                      Child (5 - 11) With Mattress
                    </td>
                    <td className="p-3 border-b">₹24,000</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 border-b">Child (2 - 4)</td>
                    <td className="p-3 border-b">₹19,000</td>
                  </tr>
                  <tr>
                    <td className="p-3">Child (5 - 11) Without Mattress</td>
                    <td className="p-3">₹21,000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Notes */}
            <ul className="mt-4 text-sm text-gray-600 space-y-1">
              <li>• Terms and Conditions apply.</li>
              <li>• 5% GST is applicable on given tour price.</li>
              <li>• Mentioned tour prices are Per Person.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingModal;
