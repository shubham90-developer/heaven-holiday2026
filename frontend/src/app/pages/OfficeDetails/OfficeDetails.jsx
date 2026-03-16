"use client";
import React, { useState, useEffect, useRef } from "react";
import { Phone, Mail, ChevronDown } from "lucide-react";
import Breadcrumb from "@/app/components/Breadcum";
import DekhoApnaDesh from "@/app/pages/Hero/DekhoApnaDesh";
import TourReview from "@/app/components/TourReview";
import HolidayDestinations from "./HolidayDestinations";
import ContactForm from "./ContactForm";
import { useCreateEnquiryMutation } from "store/enquiryApi/enquiryApi";
import {
  useGetOfficeByIdQuery,
  useCheckOfficeStatusQuery,
} from "../../../../store/contact-office/contactOfficeApi";
import { useSearchParams } from "next/navigation";

const OfficeDetails = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchParams = useSearchParams();
  const officeId = searchParams.get("id");

  // Fetch office data
  const { data: officeData, isLoading: isLoadingOffice } =
    useGetOfficeByIdQuery(officeId, {
      skip: !officeId,
    });

  // Fetch office status
  const { data: statusData } = useCheckOfficeStatusQuery(officeId, {
    skip: !officeId,
  });

  const [createEnquiry, { isLoading: isSubmitting }] =
    useCreateEnquiryMutation();

  const [formData, setFormData] = useState({
    name: "",
    mono: "",
    email: "",
    destinations: "-",
  });

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Contact Us", href: null },
  ];

  const office = officeData?.data;
  const officeStatus = statusData?.isOpen ? "OPEN" : "CLOSED";

  // Format office times for display
  const formatOfficeTimes = (officeTimes) => {
    if (!officeTimes || officeTimes.length === 0) {
      return [
        { day: "Mon", time: "10:00 AM - 07:00 PM" },
        { day: "Tue", time: "10:00 AM - 07:00 PM" },
        { day: "Wed", time: "10:00 AM - 07:00 PM" },
        { day: "Thu", time: "10:00 AM - 07:00 PM" },
        { day: "Fri", time: "10:00 AM - 07:00 PM" },
        { day: "Sat", time: "10:00 AM - 07:00 PM", highlight: true },
        { day: "Sun", time: "Closed" },
      ];
    }

    const dayMap = {
      monday: "Mon",
      tuesday: "Tue",
      wednesday: "Wed",
      thursday: "Thu",
      friday: "Fri",
      saturday: "Sat",
      sunday: "Sun",
    };

    return officeTimes.map((time) => ({
      day: dayMap[time.day],
      time: time.isOpen
        ? `${formatTime(time.openTime)} - ${formatTime(time.closeTime)}`
        : "Closed",
      highlight: time.day === getCurrentDay(),
    }));
  };

  const formatTime = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getCurrentDay = () => {
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    return days[new Date().getDay()];
  };

  const getTodayHours = () => {
    if (!office?.officeTimes) return "Sat 10:00 AM - 07:00 PM";
    const today = office.officeTimes.find((t) => t.day === getCurrentDay());
    if (!today) return "Not Available";
    if (!today.isOpen) return "Closed";
    const dayMap = {
      monday: "Mon",
      tuesday: "Tue",
      wednesday: "Wed",
      thursday: "Thu",
      friday: "Fri",
      saturday: "Sat",
      sunday: "Sun",
    };
    return `${dayMap[today.day]} ${formatTime(today.openTime)} - ${formatTime(today.closeTime)}`;
  };

  const hours = office
    ? formatOfficeTimes(office.officeTimes)
    : [
        { day: "Mon", time: "10:00 AM - 07:00 PM" },
        { day: "Tue", time: "10:00 AM - 07:00 PM" },
        { day: "Wed", time: "10:00 AM - 07:00 PM" },
        { day: "Thu", time: "10:00 AM - 07:00 PM" },
        { day: "Fri", time: "10:00 AM - 07:00 PM" },
        { day: "Sat", time: "10:00 AM - 07:00 PM", highlight: true },
        { day: "Sun", time: "Closed" },
      ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEnquiry({
        ...formData,
        message: "Request Call Back",
      }).unwrap();
      alert("Call back request submitted successfully!");
      setFormData({
        name: "",
        mono: "",
        email: "",
        destinations: "-",
      });
    } catch (err) {
      console.error("Failed to submit request:", err);
      alert("Failed to submit request. Please try again.");
    }
  };

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoadingOffice) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />

      <section className="py-10 bg-blue-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left: Office Info */}
            <div className="bg-white rounded-lg shadow p-6 flex-1">
              {/* Tag */}
              <span className="inline-block bg-teal-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Virtual Sales Office
              </span>

              {/* Title */}
              <h2 className="text-2xl font-bold mt-3 flex items-center">
                <span>{office?.city || "Puducherry"}</span>
                <span
                  className={`border-l-2 border-gray-300 pl-2 ml-2 font-semibold text-lg ${officeStatus === "OPEN" ? "text-green-600" : "text-red-600"}`}
                >
                  {officeStatus}
                </span>
              </h2>

              {/* Subtext */}
              <p className="text-gray-600 mt-2">
                Want to connect? Just click 'Schedule a Video Meet' and share
                your details.
              </p>

              {/* Contact Info */}
              <div className="mt-5 space-y-3 text-gray-800">
                <div className="flex items-center gap-2">
                  <Phone size={18} className="text-gray-600" />
                  <span className="font-medium">
                    {office?.phone || "+91 8655755288"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={18} className="text-gray-600" />
                  <span className="font-medium">
                    {office?.email || "travel@heavenHoliday.com"}
                  </span>
                </div>
              </div>

              {/* Working Hours */}
              <div ref={dropdownRef} className="relative inline-block mt-6">
                {/* Trigger */}
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-1 text-gray-900 font-medium cursor-pointer"
                >
                  Working Hours: {getTodayHours()}
                  <ChevronDown size={16} />
                </button>

                {/* Dropdown */}
                {open && (
                  <div className="absolute left-0 mt-2 w-56 bg-white border rounded-md shadow-lg p-3 z-20">
                    {hours.map((h, idx) => (
                      <div
                        key={idx}
                        className={`flex justify-between py-1 text-sm ${
                          h.highlight ? "font-bold text-black" : "text-gray-700"
                        }`}
                      >
                        <span>{h.day}</span>
                        <span>{h.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Call Back Form */}
            <div className="bg-gray-100 shadow rounded-lg p-6 w-full md:w-1/3">
              <h3 className="font-semibold text-base mb-4">
                Want us to call you?
              </h3>

              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Full Name*"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded-xl p-3 text-sm mb-3 border-gray-300 focus:ring focus:ring-yellow-300"
                />
                <input
                  type="tel"
                  placeholder="Mobile Number*"
                  name="mono"
                  value={formData.mono}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded-xl p-3 text-sm mb-3 border-gray-300 focus:ring focus:ring-yellow-300"
                />
                <input
                  type="email"
                  placeholder="Email ID*"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded-xl p-3 text-sm mb-4 border-gray-300 focus:ring focus:ring-yellow-300"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full cursor-pointer text-white bg-red-700 hover:bg-red-500 py-3 rounded font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
      <DekhoApnaDesh />
      <HolidayDestinations />
      <TourReview />
      <ContactForm />
    </>
  );
};

export default OfficeDetails;
