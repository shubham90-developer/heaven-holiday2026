"use client";
import React, { useState } from "react";
import { Globe } from "lucide-react";
import Image from "next/image";
import Logo from "./Logo";
import Link from "next/link";
import FooterTopBtn from "./FooterTopBtn";
import TopBookingAds from "./TopBookingAds";
import { useCreateEnquiryMutation } from "store/enquiryApi/enquiryApi";
import { useGetSettingsQuery } from "store/settings/settingsApi";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
const Footer = () => {
  const {
    data: settings,
    isLoading: settingsLoading,
    error: settingsError,
  } = useGetSettingsQuery();
  const [createEnquiry, { isLoading, isSuccess, isError }] =
    useCreateEnquiryMutation();
  const [countryCode, setCountryCode] = useState("91");
  const [mobile, setMobile] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mono: "",
    destinations: "",
  });
  if (settingsLoading) {
    return <p>error</p>;
  }
  if (settingsError) {
    return <p>error</p>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Add default value for destinations if empty
      const submissionData = {
        ...formData,
        mono: `+${countryCode} ${mobile}`,
        destinations: formData.destinations || "Newsletter Subscription",
      };

      await createEnquiry(submissionData).unwrap();
      // Reset form on success
      setFormData({
        name: "",
        email: "",
        mono: "",
        destinations: "",
      });
      setMobile("");
      alert("Subscription successful!");
    } catch (err) {
      console.error("Failed to subscribe:", err);
      alert("Subscription failed. Please try again.");
    }
  };

  return (
    <footer className="bg-[#0c1b2a] text-white pt-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Column 1 - Logo + Newsletter */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Logo />
          </div>
          <p className="font-semibold mb-2">Keep travelling all year round!</p>
          <p className="text-xs mb-4">
            Subscribe to our newsletter to find travel inspiration in your
            inbox.
          </p>
          {/* Newsletter Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name*"
              className="px-3 py-2 rounded-md bg-[#0c1b2a] border border-gray-600 text-sm w-full"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email ID*"
              className="px-3 py-2 rounded-md bg-[#0c1b2a] border border-gray-600 text-sm w-full"
              required
            />
            <PhoneInput
              country={"in"}
              value={countryCode + mobile}
              onChange={(value, data) => {
                setCountryCode(data.dialCode);
                setMobile(value.slice(data.dialCode.length));
              }}
              inputStyle={{
                width: "100%",
                height: "40px",
                fontSize: "14px",
                borderRadius: "8px",
                background: "#0c1b2a",
                color: "white",
                border: "1px solid #4b5563",
              }}
              buttonStyle={{
                background: "#0c1b2a",
                border: "1px solid #4b5563",
              }}
              dropdownStyle={{
                backgroundColor: "#0c1b2a",
                color: "white",
              }}
              searchStyle={{
                backgroundColor: "#0c1b2a",
                color: "white",
              }}
              containerStyle={{ width: "100%" }}
            />
            <input
              type="hidden"
              name="destinations"
              value={formData.destinations}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-red-700 text-white font-semibold py-2 rounded-md hover:bg-red-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>

          {/* Associated Logos */}
          <div className=" mt-10">
            <div className="bg-white p-2 rounded-md flex items-center justify-center gap-6">
              <Image
                src={settings?.data?.companyLogo || ""}
                alt="IATA"
                width={60}
                height={10}
                className="w-10 h-10 object-contain"
              />
            </div>
          </div>
        </div>

        {/* Column 2 - Discover Us */}
        <div>
          <h3 className="font-semibold mb-4">Discover us</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/reviews-and-testimonials"
                className="hover:text-yellow-400"
              >
                Guests Reviews
              </Link>
            </li>
            <li>
              <Link href="/about-us" className="hover:text-yellow-400">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/our-people" className="hover:text-yellow-400">
                Our Team
              </Link>
            </li>
            <li>
              <Link href="/tour-manager" className="hover:text-yellow-400">
                Tour Managers
              </Link>
            </li>
            <li>
              <Link href="/contact-us" className="hover:text-yellow-400">
                Sales Partners
              </Link>
            </li>
            <li>
              <Link
                href="/become-our-sales-partner"
                className="hover:text-yellow-400"
              >
                Become A Sales Partner
              </Link>
            </li>
            <li>
              <Link href="/careers" className="hover:text-yellow-400">
                Careers{" "}
                <span className="text-yellow-400 text-xs">We're Hiring!</span>
              </Link>
            </li>
            <li>
              <Link href="/csr-policy" className="hover:text-yellow-400">
                CSR Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3 - Support */}
        <div>
          <h3 className="font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/contact-us" className="hover:text-yellow-400">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/feedback-form" className="hover:text-yellow-400">
                Leave Your Feedback
              </Link>
            </li>
            <li>
              <Link href="/how-to-book" className="hover:text-yellow-400">
                How To Book
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-yellow-400">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/travel-deals" className="hover:text-yellow-400">
                Travel Deals
              </Link>
            </li>
            {/* <li>
              <Link
                href="/coronavirus-advisory-and-policy"
                className="hover:text-yellow-400"
              >
                COVID-19 Public Notice
              </Link>
            </li> */}
            <li>
              <Link href="/singapore" className="hover:text-yellow-400">
                Visa
              </Link>
            </li>
            <li>
              {/* <Link href="/annual-return" className="hover:text-yellow-400">
                Annual Return
              </Link> */}
            </li>
            {/* <li>
              <Link
                href="/corporate-governance"
                className="hover:text-yellow-400"
              >
                Corporate Governance
              </Link>
            </li> */}
          </ul>
        </div>

        {/* Column 4 - Resources */}
        <div>
          <h3 className="font-semibold mb-4">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/tour-status" className="hover:text-yellow-400">
                Tour Status
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-yellow-400">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/podcast" className="hover:text-yellow-400">
                Podcasts
              </Link>
            </li>
            <li>
              <Link href="/video-blogs" className="hover:text-yellow-400">
                Video Blogs
              </Link>
            </li>
            {/* <li>
              <Link href="#" className="hover:text-yellow-400">
                Articles By Veena Patil
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-yellow-400">
                Articles By Sunila Patil
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-yellow-400">
                Articles By Neil Patil
              </Link>
            </li> */}
            <li>
              <Link href="/travel-planners" className="hover:text-yellow-400">
                {settings?.data?.travelPlannerLabel || ""}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="max-w-7xl mx-auto px-6 mt-6 text-xs text-gray-400">
        <p className="mb-4 border-t border-b  border-gray-700 py-5 text-gray-50">
          *Caution: {settings?.data?.cautionText || ""}
        </p>
        <p className=" pt-4 pb-5">
          {settings?.data?.copyrightText || ""}
          <Link
            href="/privacy-policy"
            className="ml-4 hover:text-yellow-400 cursor-pointer"
          >
            Privacy Policy
          </Link>{" "}
          |
          <Link
            href="/term-conditions"
            className="ml-2 hover:text-yellow-400 cursor-pointer"
          >
            Terms & Conditions
          </Link>{" "}
          {/* <Link
            href="/sitemap"
            className="ml-2 hover:text-yellow-400 cursor-pointer"
          >
            Site Map
          </Link> */}
        </p>
      </div>

      {/* top menu btn */}
      <FooterTopBtn />
      <TopBookingAds />
    </footer>
  );
};

export default Footer;
