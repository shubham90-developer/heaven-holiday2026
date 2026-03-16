"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useCreateEnquiryMutation } from "store/enquiryApi/enquiryApi";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const ContactForm = () => {
  const [createEnquiry, { isLoading: isSubmitting }] =
    useCreateEnquiryMutation();

  const [countryCode, setCountryCode] = useState("91");
  const [mobile, setMobile] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    destinations: "-",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEnquiry({
        ...formData,
        mono: `+${countryCode} ${mobile}`,
      }).unwrap();
      alert("Enquiry submitted successfully!");
      setFormData({
        name: "",
        email: "",
        message: "",
        destinations: "-",
      });
      setMobile("");
    } catch (err) {
      console.error("Failed to submit enquiry:", err);
      alert("Failed to submit enquiry. Please try again.");
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 px-6 items-center">
        {/* Left Section */}
        <div>
          <h2 className="text-2xl font-bold mb-3">
            Planning a trip! Have queries?
          </h2>
          <p className="text-gray-600 mb-6">
            Stay relaxed, our expert Travel Advisors are here and ready to help.
          </p>
          <Image
            src="/assets/img/contact/contact.avif"
            alt="Relax illustration"
            width={400}
            height={300}
            className="mx-auto md:mx-0"
          />
        </div>

        {/* Right Section: Form */}
        <div className="bg-white">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <input
              type="text"
              placeholder="Full Name*"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            />

            {/* Phone Input with Country Code */}
            <PhoneInput
              country={"in"}
              value={countryCode + mobile}
              onChange={(value, data) => {
                setCountryCode(data.dialCode);
                setMobile(value.slice(data.dialCode.length));
              }}
              inputStyle={{
                width: "100%",
                height: "48px",
                fontSize: "14px",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
              }}
              buttonStyle={{
                border: "1px solid #d1d5db",
                borderRadius: "6px 0 0 6px",
                background: "#f9fafb",
              }}
              containerStyle={{ width: "100%" }}
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email ID*"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            />

            {/* Description */}
            <textarea
              placeholder="Description*"
              rows="4"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            ></textarea>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full cursor-pointer bg-red-700 hover:bg-yellow-500 text-white font-medium py-3 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
