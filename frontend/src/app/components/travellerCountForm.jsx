"use client";
import React, { useState } from "react";
import { FaUser, FaChild, FaBaby } from "react-icons/fa";

const TravellerCountForm = ({ onSubmit }) => {
  const [counts, setCounts] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    total: 1,
  });

  const handleIncrement = (type) => {
    setCounts((prev) => {
      const newCounts = { ...prev };
      newCounts[type] += 1;
      newCounts.total =
        newCounts.adults + newCounts.children + newCounts.infants;
      return newCounts;
    });
  };

  const handleDecrement = (type) => {
    setCounts((prev) => {
      const newCounts = { ...prev };
      if (type === "adults" && newCounts.adults > 1) {
        newCounts.adults -= 1;
      } else if (type !== "adults" && newCounts[type] > 0) {
        newCounts[type] -= 1;
      }
      newCounts.total =
        newCounts.adults + newCounts.children + newCounts.infants;
      return newCounts;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (counts.total === 0) {
      alert("Please add at least one traveller");
      return;
    }
    onSubmit(counts);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-6">
        Select Number of Travellers
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Adults */}
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaUser className="text-blue-600 text-xl" />
              <div>
                <h3 className="font-semibold text-gray-800">Adults</h3>
                <p className="text-xs text-gray-500">Age 12+ years</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => handleDecrement("adults")}
                disabled={counts.adults <= 1}
                className={`w-10 h-10 rounded-full font-bold ${
                  counts.adults <= 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                -
              </button>
              <span className="font-semibold text-lg w-8 text-center">
                {counts.adults}
              </span>
              <button
                type="button"
                onClick={() => handleIncrement("adults")}
                className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Children */}
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaChild className="text-green-600 text-xl" />
              <div>
                <h3 className="font-semibold text-gray-800">Children</h3>
                <p className="text-xs text-gray-500">Age 2-12 years</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => handleDecrement("children")}
                disabled={counts.children <= 0}
                className={`w-10 h-10 rounded-full font-bold ${
                  counts.children <= 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                -
              </button>
              <span className="font-semibold text-lg w-8 text-center">
                {counts.children}
              </span>
              <button
                type="button"
                onClick={() => handleIncrement("children")}
                className="w-10 h-10 rounded-full bg-green-600 text-white font-bold hover:bg-green-700"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Infants */}
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaBaby className="text-purple-600 text-xl" />
              <div>
                <h3 className="font-semibold text-gray-800">Infants</h3>
                <p className="text-xs text-gray-500">Below 2 years</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => handleDecrement("infants")}
                disabled={counts.infants <= 0}
                className={`w-10 h-10 rounded-full font-bold ${
                  counts.infants <= 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                -
              </button>
              <span className="font-semibold text-lg w-8 text-center">
                {counts.infants}
              </span>
              <button
                type="button"
                onClick={() => handleIncrement("infants")}
                className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold hover:bg-purple-700"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Total Summary */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-800">
              Total Travellers
            </span>
            <span className="text-2xl font-bold text-blue-600">
              {counts.total}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Continue to Traveller Details
        </button>
      </form>
    </div>
  );
};

export default TravellerCountForm;
