"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useGetAllBookingsQuery } from "store/bookingApi/bookingApi";

const TopBookingAds = () => {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data } = useGetAllBookingsQuery();
  const bookings = data?.data?.bookings || [];

  // Auto-rotation + show/hide logic
  useEffect(() => {
    if (bookings.length === 0) return;

    // Show popup
    setVisible(true);

    // Hide after 2 seconds
    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    // Move to next booking after 15 seconds (2s show + 13s hide)
    const rotateTimer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % bookings.length);
    }, 15000);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(rotateTimer);
    };
  }, [currentIndex, bookings.length]);

  if (!visible || bookings.length === 0) return null;

  const currentBooking = bookings[currentIndex];
  const guestCount = currentBooking?.travelerCount?.total || 1;
  const tourTitle = currentBooking?.tourPackage?.title || "Tour Package";
  const city = currentBooking?.selectedDeparture?.departureCity || "Mumbai";
  const tourImage =
    currentBooking?.tourPackage?.galleryImages?.[0] ||
    "/assets/img/tours/1.avif";

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center bg-[#0b1a33] text-white rounded-xl shadow-lg w-[320px] animate-slideIn">
      {/* Image */}
      <div className="flex-shrink-0 p-2">
        <Image
          src={tourImage}
          alt={tourTitle}
          width={80}
          height={80}
          className="object-cover rounded-lg"
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-3">
        <p className="text-sm text-gray-300">
          {guestCount} guest{guestCount > 1 ? "s" : ""} just booked!
        </p>
        <p className="font-semibold text-white text-base line-clamp-2">
          {tourTitle}
        </p>
        <p className="text-xs text-gray-400 mt-1">Just Now • {city}</p>
      </div>

      {/* Close Button */}
      <button
        onClick={() => setVisible(false)}
        className="p-2 hover:text-white cursor-pointer bg-gray-100 rounded-full text-black hover:bg-gray-200"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default TopBookingAds;
