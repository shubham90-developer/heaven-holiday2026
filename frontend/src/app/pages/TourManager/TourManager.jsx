"use client";
import React from "react";
import Image from "next/image";
import { useGetTourManagerQuery } from "../../../../store/toursManagement/tourManagerHeader";

const TourManager = () => {
  const { data, isLoading, error } = useGetTourManagerQuery();

  if (isLoading) {
    return (
      <section className="pt-10 pb-0 text-center relative overflow-hidden bg-gradient-to-b from-yellow-50 to-white">
        <div className="max-w-5xl mx-auto px-6 animate-pulse">
          {/* Title skeleton */}
          <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto mb-4" />
          {/* Subtitle skeleton */}
          <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-8" />
          {/* Description skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto" />
            <div className="h-4 bg-gray-200 rounded w-4/6 mx-auto" />
          </div>
        </div>
        {/* Bottom illustration skeleton */}
        <div className="mt-12 w-full h-48 bg-gray-200 animate-pulse" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="pt-10 pb-0 text-center relative overflow-hidden bg-gradient-to-b from-yellow-50 to-white">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-gray-500 text-sm">
            Content unavailable at the moment.
          </p>
        </div>
      </section>
    );
  }
  const responce = data?.data;

  return (
    <section className="pt-10 pb-0 text-center relative overflow-hidden bg-gradient-to-b from-yellow-50 to-white">
      <div className="max-w-5xl mx-auto px-6">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {responce?.title || ""}
        </h2>
        <p className="text-lg md:text-xl text-gray-700 mb-8">
          {responce?.subtitle || ""}
        </p>

        {/* Description */}
        <p
          className="text-gray-600 text-sm md:text-base leading-relaxed"
          dangerouslySetInnerHTML={{ __html: responce?.description || "" }}
        ></p>
      </div>

      {/* Bottom Illustration */}
      <div className="mt-12 w-full">
        <Image
          src="/assets/img/tour-manager/1.svg"
          alt="Tour Managers Illustration"
          width={1600}
          height={300}
          className="w-full h-auto object-cover"
        />
      </div>
    </section>
  );
};

export default TourManager;
