"use client";
import React, { useState } from "react";
import DepartureSelector from "./DepartureSelector";
import { FaFileInvoice } from "react-icons/fa";
import Link from "next/link";
import EmiModal from "./EmiModal";
import BookingStepperModal from "@/app/components/bookingModals";
import DepartureBookingSkeleton from "@/app/components/DepartureBookingSkeleton";
import SignInModal from "@/app/components/SignInModal";
import { useGetContactDetailsQuery } from "store/aboutUsApi/contactApi";
const DepartureBooking = ({ tourData, onDepartureSelect }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [preSelectedDeparture, setPreSelectedDeparture] = useState(null);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  // Get first departure for default values
  const firstDeparture = tourData?.departures?.[0];
  const departureCity = firstDeparture?.city || "Mumbai";
  const { data: contact } = useGetContactDetailsQuery();
  // skeleton
  if (!tourData) {
    return <DepartureBookingSkeleton />;
  }

  // Format departure date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const departureDate = firstDeparture?.date
    ? formatDate(firstDeparture.date)
    : "";

  // Calculate end date based on days
  const calculateEndDate = (startDate, days) => {
    if (!startDate || !days) return "";
    const date = new Date(startDate);
    date.setDate(date.getDate() + days);
    return formatDate(date);
  };

  const endDate =
    firstDeparture?.date && tourData?.days
      ? calculateEndDate(firstDeparture.date, tourData.days)
      : "02 Dec 2025";

  // Get pricing
  const basePrice =
    selectedDate?.price ||
    tourData?.baseJoiningPrice ||
    tourData?.baseFullPackagePrice ||
    30000;
  const formattedPrice = `₹${basePrice.toLocaleString("en-IN")}`;

  const handleDepartureSelect = (departure) => {
    setSelectedDate(departure);
    setPreSelectedDeparture(departure);

    // If onDepartureSelect is provided (from Tour Details page), call it
    if (onDepartureSelect) {
      onDepartureSelect(departure);
    } else {
      // Otherwise, open modal here (when used in DepartureBooking section)
      setIsBookingModalOpen(true);
    }
  };

  return (
    <>
      <section id="departure-section" className="py-10 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          {/* Intro */}
          <div className="mb-6">
            <p className="text-md text-black font-bold">
              Select departure city, dates & add guest to book your tour
            </p>
            <p className="text-sm text-gray-500">
              As seats fill, prices increase! So book today!
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: Bigger */}
            <div className="md:col-span-2">
              <DepartureSelector
                departures={tourData?.departures}
                onDateSelect={handleDepartureSelect}
                packageType="Joining Package"
              />
            </div>

            {/* Right: Smaller */}
            <div className="md:col-span-1 bg-white p-5 rounded-xl shadow border border-gray-200">
              <div>
                {/* Title */}
                <h2 className="flex items-center gap-2 font-semibold text-lg mb-4 border-b pb-2">
                  <FaFileInvoice className="text-blue-600" />
                  BOOKING SUMMARY
                </h2>

                <div className="mb-2 flex justify-between text-sm text-gray-700">
                  <span>Dept. city</span>
                  <span className="font-medium">
                    {selectedDate?.city || departureCity}
                  </span>
                </div>

                <div className="mb-2 flex justify-between text-sm text-gray-700 wrap-break-word">
                  <span>Dept. date</span>
                  <span className="font-semibold text-black">
                    {selectedDate?.date
                      ? `${formatDate(selectedDate.date)} → ${calculateEndDate(selectedDate.date, tourData?.days)}`
                      : `${departureDate} → ${endDate}`}
                  </span>
                </div>

                {/* Travellers */}
                <div className="mb-2 flex justify-between text-sm text-gray-700 wrap-break-word">
                  <span>Travellers</span>
                  <span>0 Adult(s) | 0 Child | 0 Infant</span>
                </div>

                {/* Rooms */}
                <div className="mb-4 flex justify-between text-sm text-gray-700">
                  <span>Rooms</span>
                  <span>0 Room</span>
                </div>

                {/* Price Section */}
                <div className="border-t border-dashed pt-4 mb-4">
                  <div className="flex justify-between items-start flex-col sm:flex-row">
                    <span className="text-sm font-medium text-black mb-2 sm:mb-0">
                      Basic Price
                    </span>
                    <div className="flex flex-col items-start sm:items-end">
                      <p className="text-green-600 font-semibold text-xl">
                        {formattedPrice}
                      </p>
                      <p className="text-xs text-gray-500">
                        per person on twin sharing
                      </p>
                    </div>
                  </div>

                  {/* <div className="mt-2 flex flex-wrap gap-3 text-xs">
                  <Link
                    href="#cancellation-policy"
                    className="text-blue-700 underline"
                  >
                    Cancellation Policy
                  </Link>
                </div> */}
                </div>

                {/* EMI */}
                {/* <div className="mb-5">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    EMI Available
                  </span>
                  <span className="font-semibold">{formattedEmi}</span>
                </div>
            
                <EmiModal />
              </div> */}

                {/* Contact Info */}
                <div className="border-t border-dashed pt-4 mb-4 text-sm text-gray-700">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-blue-600">📞</span>
                      <span>{contact?.data?.callUs?.phoneNumbers[0]}</span>
                      <span>|</span>
                      <span>{contact?.data?.callUs?.phoneNumbers[1]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600">📍</span>
                      <Link
                        href="/contact-us"
                        className="text-blue-600 hover:underline"
                      >
                        Locate nearest Heaven Holiday
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Buttons */}

                <div className="flex flex-col sm:flex-row gap-3 bg-gray-900 rounded-lg py-2 px-4">
                  {
                    <SignInModal
                      isOpen={isSignInOpen}
                      onClose={() => setIsSignInOpen(false)}
                    />
                  }
                  <button
                    onClick={() => {
                      const token = localStorage.getItem("authToken");
                      if (!token) {
                        setIsSignInOpen(true);
                      } else {
                        setIsBookingModalOpen(true);
                      }
                    }}
                    className="flex-1 py-2 bg-red-700 rounded-lg font-medium hover:bg-red-500 text-white transition cursor-pointer"
                  >
                    Book Online
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BookingStepperModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setPreSelectedDeparture(null);
        }}
        tourData={tourData}
        preSelectedDeparture={preSelectedDeparture}
      />
    </>
  );
};

export default DepartureBooking;
