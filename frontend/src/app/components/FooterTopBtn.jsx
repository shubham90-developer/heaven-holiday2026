"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCreateEnquiryMutation } from "store/enquiryApi/enquiryApi";
const city = [
  {
    id: 1,
    cityName: "Europe, South East Asia, America",
    url: "/tour-list",
  },
  {
    id: 2,
    cityName: "Australia, New Zealand, Africa",
    url: "/tour-list",
  },
  {
    id: 3,
    cityName: "Japan, China, Korea, Taiwan",
    url: "/tour-list",
  },
];

const FooterTopBtn = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createEnquiry, { isLoading: isSubmitting }] =
    useCreateEnquiryMutation();

  const [formData, setFormData] = useState({
    name: "",
    mono: "",
    email: "",
    message: "",
    modeOfCommunication: "call",
    destinations: "-",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEnquiry(formData).unwrap();
      alert("Enquiry submitted successfully!");
      setFormData({
        name: "",
        mono: "",
        email: "",
        message: "",
        modeOfCommunication: "call",
        destinations: "-",
      });
    } catch (err) {
      console.error("Failed to submit enquiry:", err);
      alert("Failed to submit enquiry. Please try again.");
    }
  };
  return (
    <>
      {/* Footer */}
      <footer className="bg-[#0c1b2a]  relative">
        {/* Floating Buttons */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 items-end">
          {/* Book Online Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 border border-white cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-700"
          >
            <span className="bg-white text-orange-600 text-xs px-2 py-1 rounded-full">
              Book Online
            </span>
            <span className="text-xs font-semibold">
              365 days, 24*7 <br /> from your city!
            </span>
          </button>

          {/* Quick Enquiry Button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 animate-bounce bg-red-700 text-xs cursor-pointer text-white px-5 py-3 rounded-full shadow-md font-semibold hover:bg-yellow-500"
          >
            ✏️ Quick Enquiry
          </button>
        </div>
      </footer>

      {/* Drawer (Quick Enquiry) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsDrawerOpen(false)}
          ></div>

          {/* Drawer Content */}
          <div className="relative w-full sm:w-[400px] bg-white text-black h-full shadow-lg p-6 overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
            >
              <X size={24} />
            </button>

            <h2 className="text-xl font-bold mb-5">QUICK ENQUIRY</h2>
            <form className="space-y-4 text-sm" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Full Name*"
                className="w-full border border-gray-300 p-2 rounded"
                onChange={handleInputChange}
                name="name"
                value={formData.name}
              />
              <input
                type="tel"
                placeholder="+91 Mobile Number*"
                className="w-full border border-gray-300 p-2 rounded"
                onChange={handleInputChange}
                name="mono"
                value={formData.mono}
              />
              <input
                type="email"
                placeholder="Email ID*"
                className="w-full border border-gray-300 p-2 rounded"
                onChange={handleInputChange}
                value={formData.email}
                name="email"
              />
              <textarea
                placeholder="Drop us a small description"
                className="w-full border border-gray-300 p-2 rounded"
                rows="3"
                onChange={handleInputChange}
                value={formData.message}
                name="message"
              />
              <div className="mt-6 border-t border-gray-600 border-dashed pt-4">
                <p className="text-xs">
                  Would you like to share more info? It will help us curate the
                  best tours for you. (Optional)
                </p>
                <Link
                  href="/contact-us"
                  className="text-blue-800 font-semibold hover:underline"
                >
                  Additional Details
                </Link>
              </div>
              <button
                type="submit"
                className="w-full bg-red-700 py-3 rounded font-semibold hover:bg-red-500 text-white cursor-pointer"
              >
                Submit Enquiry
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal (365 Book Online) */}
      {isModalOpen && (
        <div className="fixed inset-0 text-black z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal Box */}
          <div className="relative bg-white rounded-lg p-6 w-[90%] max-w-lg shadow-lg">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
            >
              <X size={24} />
            </button>

            <h2 className="text-lg font-bold text-center mb-4">
              Book online anytime, anywhere!
            </h2>
            <div className="grid grid-cols-3 gap-6 text-center mb-6">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <Image
                  src="/assets/img/f5.svg"
                  alt="Step 1"
                  width={50}
                  height={50}
                  className="mb-2"
                />
                <p className="font-semibold text-sm text-gray-700">Step 1</p>
                <p className="text-xs text-gray-600">
                  Choose your favourite tour
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <Image
                  src="/assets/img/f6.svg"
                  alt="Step 2"
                  width={50}
                  height={50}
                  className="mb-2"
                />
                <p className="font-semibold text-sm text-gray-700">Step 2</p>
                <p className="text-xs text-gray-600">
                  Select your departure city & date
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <Image
                  src="/assets/img/f7.svg"
                  alt="Step 3"
                  width={50}
                  height={50}
                  className="mb-2"
                />
                <p className="font-semibold text-sm text-gray-700">Step 3</p>
                <p className="text-xs text-gray-600">Book online instantly!</p>
              </div>
            </div>

            <p className="text-sm text-center">
              Discover our{" "}
              <span className="font-bold">⚡ Trending Group Tours</span>
            </p>
            <ul className="text-center text-blue-600 underline space-y-1 mt-2">
              {city &&
                city.map((city) => (
                  <Link key={city.id} href={city.url}>
                    <li>{city.cityName}</li>
                  </Link>
                ))}
            </ul>
            <p className="text-sm text-center mt-4">
              you're just a few clicks away from your next unforgettable
              journey!
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default FooterTopBtn;
