"use client";
import React, { useState } from "react";
import { useCreateEnquiryMutation } from "../../../../store/enquiryApi/enquiryApi";

const EnquiryForm = () => {
  const [createEnquiry, { isLoading }] = useCreateEnquiryMutation();

  const [formData, setFormData] = useState({
    name: "",
    mono: "",
    destinations: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.mono || !formData.destinations) {
      alert("Please fill all fields!");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.mono)) {
      alert("Mobile number must be exactly 10 digits!");
      return;
    }

    try {
      await createEnquiry({
        name: formData.name,
        mono: formData.mono,
        destinations: formData.destinations,
        status: "active",
      }).unwrap();

      alert("Enquiry submitted successfully! We will get back to you soon.");
      setFormData({ name: "", mono: "", destinations: "" });
    } catch (error) {
      alert(
        error?.data?.message || "Failed to submit enquiry. Please try again.",
      );
    }
  };

  return (
    <section className="py-10 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-[#0b1a27] rounded-lg p-6 md:p-10">
          {/* Left Text */}
          <div className="mb-6 md:mb-8">
            <h3 className="text-lg md:text-xl font-semibold text-yellow-400">
              Planning a tour?
            </h3>
            <p className="text-sm text-gray-200 mt-1">
              Enter your details and we will get back to you.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row gap-4 w-full"
          >
            {/* Full Name */}
            <input
              type="text"
              placeholder="Full Name*"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="flex-1 min-w-50 px-4 py-3 rounded-md text-gray-900 bg-white focus:outline-none text-sm"
              required
            />

            {/* Mobile */}
            <div className="flex-1 min-w-50 flex items-center bg-white rounded-md px-3 py-3">
              <span className="text-sm">🇮🇳</span>
              <span className="text-gray-500 mx-2">+91</span>
              <input
                type="tel"
                placeholder="9284599055"
                value={formData.mono}
                onChange={(e) =>
                  setFormData({ ...formData, mono: e.target.value })
                }
                pattern="[0-9]{10}"
                maxLength={10}
                className="flex-1 text-gray-900 focus:outline-none text-sm"
                required
              />
            </div>

            {/* Destination */}
            <input
              type="text"
              placeholder="Destinations"
              value={formData.destinations}
              onChange={(e) =>
                setFormData({ ...formData, destinations: e.target.value })
              }
              className="flex-1 min-w-50 px-4 py-3 rounded-md text-gray-900 bg-white focus:outline-none text-sm"
              required
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="bg-red-700 hover:bg-red-500 text-white font-medium px-6 py-3 rounded-md transition text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send Enquiry"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EnquiryForm;
