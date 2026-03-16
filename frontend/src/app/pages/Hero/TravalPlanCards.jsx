"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetProfileQuery } from "store/authApi/authApi";
import { useGetUserBookingsQuery } from "store/bookingApi/bookingApi";

const TravalPlanCards = () => {
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useGetProfileQuery();

  const {
    data: booking,
    isLoading: loadingBooking,
    error: errorBooking,
  } = useGetUserBookingsQuery();

  const isLoading = profileLoading || loadingBooking;

  if (isLoading) {
    return (
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4 bg-gray-50 py-6 rounded-2xl">
          <div className="h-6 w-64 bg-gray-300 rounded animate-pulse mb-6" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-white flex gap-3 items-center rounded-lg border border-gray-200 p-3 animate-pulse"
              >
                <div className="w-20 h-20 bg-gray-300 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4" />
                  <div className="h-3 bg-gray-300 rounded w-1/2" />
                  <div className="h-4 bg-gray-300 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const bookings = booking?.data?.bookings || [];
  console.log("baby", bookings);
  if (bookings.length === 0) return null;

  return (
    <section className="py-10">
      <div className="max-w-6xl mx-auto px-4 bg-gray-50 py-6 rounded-2xl">
        <h2 className="text-lg font-semibold mb-6">
          {profile?.data?.user?.name || "Hey User"},{" "}
          <span className="font-normal">Continue your travel plan</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bookings.map((plan) => (
            <Link
              href={`/tour-details/${plan.tourPackage?._id}`}
              key={plan._id}
              className="bg-white flex gap-3 items-center rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition p-3"
            >
              <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={
                    plan.tourPackage?.galleryImages?.[0] ||
                    plan.tourPackage?.category?.image ||
                    "/assets/img/tour-card/1.avif"
                  }
                  alt={plan.tourPackage?.title || "Tour"}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-sm text-gray-800 line-clamp-1">
                  {plan.tourPackage?.title || "Tour Package"}
                </h3>
                <p className="text-xs text-gray-500">
                  {plan.tourPackage?.days || 0} Days
                </p>
                <p className="text-xs font-bold text-gray-900">
                  ₹{plan.pricing?.adultCost?.toLocaleString() || 0}
                </p>

                <p className="inline-block text-black text-sm font-bold hover:underline mt-1">
                  Book Now →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TravalPlanCards;
