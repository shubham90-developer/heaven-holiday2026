"use client";
import React from "react";
import {
  FaCheckCircle,
  FaUser,
  FaCalendar,
  FaMapMarkerAlt,
} from "react-icons/fa";

const BookingReview = ({
  tourData,
  selectedDate,
  departureCity,
  departureDate,
  endDate,
  travellerCount,
  travellers,
  totalPrice,
  advanceAmount,
  onConfirm,
  onBack,
  isLoading,
}) => {
  const leadTraveller = travellers.find((t) => t.isLeadTraveler);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <FaCheckCircle className="text-green-600" />
          Review Your Booking
        </h2>
        <p className="text-sm text-gray-500">
          Please verify all details before confirming
        </p>
      </div>

      {/* Tour Details */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-lg mb-3 text-gray-800">
          Tour Details
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tour Package:</span>
            <span className="font-medium text-gray-800">{tourData?.title}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium text-gray-800">
              {tourData?.days} Days / {tourData?.nights} Nights
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Route:</span>
            <span className="font-medium text-gray-800">{tourData?.route}</span>
          </div>
        </div>
      </div>

      {/* Departure Details */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-lg mb-3 text-gray-800 flex items-center gap-2">
          <FaCalendar className="text-blue-600" />
          Departure Details
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Departure City:</span>
            <span className="font-medium text-gray-800 flex items-center gap-1">
              <FaMapMarkerAlt className="text-red-600" />
              {departureCity}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Departure Date:</span>
            <span className="font-medium text-gray-800">{departureDate}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Return Date:</span>
            <span className="font-medium text-gray-800">{endDate}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Package Type:</span>
            <span className="font-medium text-gray-800">
              {selectedDate?.packageType || "Joining Package"}
            </span>
          </div>
        </div>
      </div>

      {/* Traveller Summary */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-lg mb-3 text-gray-800 flex items-center gap-2">
          <FaUser className="text-purple-600" />
          Traveller Summary
        </h3>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Adults:</span>
            <span className="font-medium text-gray-800">
              {travellerCount.adults}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Children:</span>
            <span className="font-medium text-gray-800">
              {travellerCount.children}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Infants:</span>
            <span className="font-medium text-gray-800">
              {travellerCount.infants}
            </span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t">
            <span className="text-gray-800 font-semibold">
              Total Travellers:
            </span>
            <span className="font-bold text-blue-600">
              {travellerCount.total}
            </span>
          </div>
        </div>

        {/* Lead Traveller Info */}
        {leadTraveller && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-700 mb-2">
              Lead Traveller (Primary Contact):
            </p>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-800">
                {leadTraveller.title} {leadTraveller.firstName}{" "}
                {leadTraveller.lastName}
              </p>
              <p className="text-xs text-gray-600">{leadTraveller.email}</p>
              <p className="text-xs text-gray-600">{leadTraveller.phone}</p>
            </div>
          </div>
        )}
      </div>

      {/* All Travellers List */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-lg mb-3 text-gray-800">
          All Travellers
        </h3>
        <div className="space-y-3">
          {travellers.map((traveller, index) => (
            <div
              key={index}
              className="p-3 bg-gray-50 rounded-lg flex justify-between items-start"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {index + 1}. {traveller.title} {traveller.firstName}{" "}
                  {traveller.lastName}
                  {traveller.isLeadTraveler && (
                    <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded">
                      Lead
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {traveller.type} • {traveller.gender} • Age: {traveller.age}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50">
        <h3 className="font-semibold text-lg mb-3 text-gray-800">
          Pricing Summary
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Base Price per Person (Twin Sharing):
            </span>
            <span className="font-medium text-gray-800">
              ₹{(totalPrice / travellerCount.total).toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Number of Travellers:</span>
            <span className="font-medium text-gray-800">
              {travellerCount.total}
            </span>
          </div>
          <div className="flex justify-between text-base font-semibold pt-2 border-t">
            <span className="text-gray-800">Total Amount:</span>
            <span className="text-blue-600 text-xl">
              ₹{totalPrice.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t bg-yellow-100 -mx-4 px-4 py-2 rounded">
            <span className="text-gray-800 font-semibold">
              Advance Payment Required (20%):
            </span>
            <span className="text-orange-600 font-bold text-lg">
              ₹{advanceAmount.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            required
            className="w-4 h-4 mt-1 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-xs text-gray-700">
            I agree to the{" "}
            <a href="#" className="text-blue-600 underline">
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 underline">
              Cancellation Policy
            </a>
            . I confirm that all traveller details provided are accurate and
            match government-issued identification documents.
          </span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
        >
          Back to Travellers
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating Booking..." : "Confirm & Proceed to Payment"}
        </button>
      </div>
    </div>
  );
};

export default BookingReview;
