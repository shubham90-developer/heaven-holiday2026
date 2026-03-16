"use client";

import Breadcrumb from "@/app/components/Breadcum";
import React, { useState, useRef } from "react";
import { useCreateFeedbackMutation } from "../../../../store/reviewsFeedback/reviewsApi";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
const FeedbackForm = () => {
  const [countryCode, setCountryCode] = useState("91");
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    experience: "",
  });

  // RTK Query mutation
  const [createFeedback, { isLoading, isSuccess, isError, error }] =
    useCreateFeedbackMutation();

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
      // Attach country code to mobile
      const payload = {
        ...formData,
        mobile: `+${countryCode}${formData.mobile}`,
      };

      const result = await createFeedback(payload).unwrap();

      // Reset form
      setFormData({
        name: "",
        mobile: "",
        email: "",
        experience: "",
      });

      setCountryCode("91"); // reset to default if needed

      toast.success("Feedback submitted successfully!");
    } catch (err) {
      toast.error(
        err?.data?.message || "Failed to submit feedback. Please try again.",
      );
    }
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Feedback Form", href: null },
        ]}
      />
      <section className="py-10 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Content */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Heaven Holiday Feedback
                </h3>
                <p className="text-gray-600 text-sm">
                  We would love to hear from you about your Heaven Holiday
                  experience. Drop a Heaven Holiday tour review or tell us about
                  your booking experience.
                </p>
                <img
                  src="/assets/img/testimonials/write-review.webp"
                  alt="feedback"
                  className="mt-6 w-full"
                />
              </div>

              {/* Right Form */}
              <div>
                {/* Success Message */}
                {isSuccess && (
                  <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
                    ✓ Feedback submitted successfully!
                  </div>
                )}

                {/* Error Message */}
                {isError && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                    ✕{" "}
                    {error?.data?.message ||
                      "Failed to submit feedback. Please try again."}
                  </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name*"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-2 rounded-md text-sm"
                    required
                    disabled={isLoading}
                  />

                  <PhoneInput
                    country={"in"}
                    value={countryCode + formData.mobile}
                    onChange={(value, data) => {
                      setCountryCode(data.dialCode);
                      setFormData((prev) => ({
                        ...prev,
                        mobile: value.slice(data.dialCode.length),
                      }));
                    }}
                    inputStyle={{
                      width: "100%",
                      height: "40px",
                      fontSize: "14px",
                      borderRadius: "6px",
                    }}
                    containerStyle={{ marginBottom: "16px" }}
                    disabled={isLoading}
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address*"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-2 rounded-md text-sm"
                    required
                    disabled={isLoading}
                  />

                  <textarea
                    rows="4"
                    name="experience"
                    placeholder="Tell us about your Heaven Holiday experience*"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-2 rounded-md text-sm"
                    required
                    disabled={isLoading}
                  ></textarea>

                  <button
                    type="submit"
                    className="w-full cursor-pointer text-xs bg-red-700 hover:bg-yellow-500 text-white font-medium py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? "Submitting..." : "Submit"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FeedbackForm;
