"use client";
import Breadcrumb from "@/app/components/Breadcum";
import React, { useState } from "react";
import { Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { useGetContactDetailsQuery } from "store/aboutUsApi/contactApi";
import { useCreateEnquiryMutation } from "store/enquiryApi/enquiryApi";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
const EnquiryNow = () => {
  const {
    data: contactDetails,
    isLoading: contactDetailsLoading,
    error: contactDetailsError,
  } = useGetContactDetailsQuery();
  const [createEnquiry, { isLoading: isSubmitting }] =
    useCreateEnquiryMutation();
  const [countryCode, setCountryCode] = useState("91");
  const [mobile, setMobile] = useState("");
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
      await createEnquiry({
        ...formData,
        mono: `+${countryCode} ${mobile}`,
      }).unwrap();
      alert("Enquiry submitted successfully!");
      setFormData({
        name: "",
        email: "",
        message: "",
        modeOfCommunication: "call",
        destinations: "-",
      });
      setMobile("");
    } catch (err) {
      console.error("Failed to submit enquiry:", err);
      alert("Failed to submit enquiry. Please try again.");
    }
  };

  if (contactDetailsLoading) {
    return <p>loading</p>;
  }
  if (contactDetailsError) {
    return <p>error</p>;
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Enquiry Now", href: "/enquiry-now" },
        ]}
      />

      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-12 border border-gray-200">
        {/* Section Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Get in touch with us
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            We're here to help. Reach out or request a call back.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Left Section */}
          <div className="space-y-8">
            {/* Give us a ring */}
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <Phone size={20} className="text-yellow-500" />
                Give us a ring
              </h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Call us or give us your contact details by filling the form and
                we will get in touch with you soon.
              </p>

              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <span className="font-semibold text-gray-800">Phone:</span>{" "}
                  <a
                    href={`tel:${contactDetails?.data?.callUs?.phoneNumbers[0] || ""}`}
                    className="text-blue-900 hover:underline"
                  >
                    {contactDetails?.data?.callUs?.phoneNumbers[0] || ""},{" "}
                    {contactDetails?.data?.callUs?.phoneNumbers[1] || ""}
                  </a>
                </p>

                <Link
                  href={`mailto:${contactDetails?.data?.writeToUs?.emails[0] || ""}`}
                  className="text-blue-900 hover:underline block"
                >
                  {contactDetails?.data?.writeToUs?.emails[0] || ""}
                </Link>
              </div>
            </div>

            {/* Find us at the office */}
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <MapPin size={20} className="text-yellow-500" />
                Find us at the office
              </h3>
              <p
                className="text-sm text-gray-600 mt-2 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: contactDetails?.data?.offices?.description || "",
                }}
              />

              <Link
                href={`${contactDetails?.data?.offices?.mapLink} ` || ""}
                className="text-blue-900 hover:underline text-sm font-medium mt-1 inline-block"
              >
                Get Directions
              </Link>
            </div>
          </div>

          {/* Right Section (Form) */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                  required
                />
              </div>

              <PhoneInput
                country={"in"}
                value={countryCode + mobile}
                onChange={(value, data) => {
                  setCountryCode(data.dialCode);
                  setMobile(value.slice(data.dialCode.length));
                }}
                inputStyle={{
                  width: "100%",
                  height: "38px",
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

              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                />
              </div>

              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us everything that's on your mind."
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-yellow-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-yellow-400 text-gray-800 font-semibold py-2 rounded-md hover:bg-yellow-500 transition"
              >
                <Phone size={16} />{" "}
                {isSubmitting ? "Submitting..." : "Request Call Back"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EnquiryNow;
