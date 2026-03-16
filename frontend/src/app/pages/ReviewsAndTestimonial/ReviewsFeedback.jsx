"use client";
import React, { useState } from "react";

const ReviewsFeedback = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        {/* Section Heading */}
        <h2 className="text-2xl font-semibold text-gray-800">
          Have you travelled with us?
        </h2>
        <p className="text-gray-600 mt-2">
          We would love to hear from you about your Heaven Holiday travel
          experience.
        </p>

        {/* Write a Review Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="mt-6 px-6 py-3 text-xs cursor-pointer bg-red-700 hover:bg-red-500 text-white font-medium rounded-md shadow"
        >
          Write a Review
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-500">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-0 right-0 text-gray-600 hover:text-black cursor-pointer bg-gray-400 p-2 rounded-full text-xs"
            >
              ✕
            </button>

            {/* Modal Content */}
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
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Name*"
                    className="w-full border border-gray-300 p-2 rounded-md text-sm"
                  />

                  <div className="flex">
                    <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-sm">
                      +91
                    </span>
                    <input
                      type="text"
                      placeholder="Mobile Number*"
                      className="w-full border border-gray-300 p-2 rounded-r-md text-sm"
                    />
                  </div>

                  <input
                    type="email"
                    placeholder="Email Address*"
                    className="w-full border border-gray-300 p-2 rounded-md text-sm"
                  />

                  <textarea
                    rows="4"
                    placeholder="Tell us about your Heaven Holiday experience*"
                    className="w-full border border-gray-300 p-2 rounded-md text-sm"
                  ></textarea>

                  <button
                    type="submit"
                    className="w-full cursor-pointer text-xs bg-red-700 hover:bg-yellow-500 text-black font-medium py-2 rounded-md"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ReviewsFeedback;
