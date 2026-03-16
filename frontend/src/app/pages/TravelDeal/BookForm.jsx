"use client";
import { useCreateEnquiryMutation } from "../../../../store/enquiryApi/enquiryApi";
import React, { useState } from "react";

const BookForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mono: "",
    email: "",
    modeOfCommunication: "call",
  });

  const [createEnquiry, { isLoading }] = useCreateEnquiryMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const submitData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        mono: formData.mono,
        email: formData.email,
        destinations: "-",
        message: "-",
        modeOfCommunication: formData.modeOfCommunication,
      };

      await createEnquiry(submitData).unwrap();

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        mono: "",
        email: "",
        modeOfCommunication: "call",
      });

      alert("Your holiday booking request has been submitted successfully!");
    } catch (error) {
      console.error("Failed to submit booking:", error);
      alert(error?.data?.message || "Failed to submit. Please try again.");
    }
  };

  return (
    <section className="py-10 bg-blue-100">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Side - Title */}
        <div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Contact us to book your holiday
          </h2>
        </div>

        {/* Right Side - Form */}
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First + Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={isLoading}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={isLoading}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Mobile */}
            <input
              type="tel"
              placeholder="Mobile Number"
              name="mono"
              value={formData.mono}
              onChange={handleInputChange}
              disabled={isLoading}
              pattern="[0-9]{10}"
              maxLength={10}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {/* Preferred Mode of Communication */}
            <div>
              <p className="text-gray-700 font-medium mb-2">
                Preferred Mode of Communication
              </p>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="modeOfCommunication"
                    value="call"
                    checked={formData.modeOfCommunication === "call"}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  Call
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="modeOfCommunication"
                    value="email"
                    checked={formData.modeOfCommunication === "email"}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  Email
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-600 text-black py-3 rounded-lg font-semibold text-xs cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Submitting..." : "Plan My Holiday"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BookForm;
