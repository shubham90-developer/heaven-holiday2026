"use client";
import Breadcrumb from "@/app/components/Breadcum";
import { Mail, Phone } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useCreateEnquiryMutation } from "../../../../store/enquiryApi/enquiryApi";
import { useGetContactDetailsQuery } from "../../../../store/aboutUsApi/contactApi";
import toast from "react-hot-toast";
const Faq = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    mono: "",
  });

  const [createEnquiry, { isLoading: isSubmitting }] =
    useCreateEnquiryMutation();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.mono) {
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
        destinations: "-",
        status: "active",
      }).unwrap();

      toast.success(
        "Request submitted successfully! We will call you back soon.",
      );
      setFormData({ name: "", mono: "" });
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to submit request. Please try again.",
      );
    }
  };
  const {
    data: contactDetails,
    isLoading: isContactDetailsLoading,
    error: contactDetailsError,
  } = useGetContactDetailsQuery();
  if (isContactDetailsLoading) {
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
          { label: "Frequently Asked Questions", href: "/how-to-book" },
        ]}
      />
      <section className="py-10 bg-blue-900">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          {/* Left: Text */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-white mb-4">
              Common queries about Heaven Holiday tours and services.
            </p>
            <p className="text-white mb-4">
              Prefer to speak to one of our expert advisors?
            </p>
            <Link
              href="tel:1800227979"
              className="text-black hover:underline bg-yellow-300 px-3 py-2 text-xs rounded-xl font-bold"
            >
              {contactDetails?.data?.callUs?.phoneNumbers[0] || ""} /{" "}
              {contactDetails?.data?.callUs?.phoneNumbers[1] || ""}
            </Link>
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
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border rounded-xl p-2 text-xs mb-2 border-gray-300"
                  required
                />
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={formData.mono}
                  onChange={(e) =>
                    setFormData({ ...formData, mono: e.target.value })
                  }
                  pattern="[0-9]{10}"
                  maxLength={10}
                  className="w-full border rounded-xl p-2 text-xs mb-2 border-gray-300"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full cursor-pointer text-white bg-red-700 hover:bg-red-500 py-2 rounded font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Phone size={16} className="text-white" />
                  <span>
                    {isSubmitting ? "Submitting..." : "Request Call Back"}
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

export default Faq;
