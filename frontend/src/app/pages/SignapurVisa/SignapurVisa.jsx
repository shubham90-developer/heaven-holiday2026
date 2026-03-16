"use client";
import Breadcrumb from "@/app/components/Breadcum";
import { Phone } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useCreateEnquiryMutation } from "../../../../store/enquiryApi/enquiryApi";

const SignapurVisa = () => {
  const [formData, setFormData] = useState({
    name: "",
    mono: "",
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
        name: formData.name,
        mono: formData.mono,
        destinations: "-",
        email: "-",
        message: "-",
        modeOfCommunication: "call",
      };

      await createEnquiry(submitData).unwrap();

      // Reset form
      setFormData({
        name: "",
        mono: "",
      });

      alert("Call back request submitted successfully!");
    } catch (error) {
      console.error("Failed to submit request:", error);
      alert(error?.data?.message || "Failed to submit. Please try again.");
    }
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Frequently Asked Questions", href: "/how-to-book" },
        ]}
      />
      <section className="py-5 bg-blue-900">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          {/* Left: Text */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Singapore Tourist Visa for Indians
            </h2>
          </div>

          {/* Right: Form */}
          <div className="relative w-full aspect-video flex items-center justify-center">
            <div className="bg-gray-100 shadow rounded-lg p-4 max-w-xs w-full">
              <h3 className="font-semibold text-sm mb-3 text-gray-700">
                How can we help you?
              </h3>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                  className="w-full border rounded-xl p-2 text-xs mb-2 border-gray-300"
                />
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
                  className="w-full border rounded-xl p-2 text-xs mb-2 border-gray-300"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full cursor-pointer text-white bg-red-700 hover:bg-red-500 py-2 rounded font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Phone size={16} className="text-white" />
                  <span>
                    {isLoading ? "Submitting..." : "Request Call Back"}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignapurVisa;
