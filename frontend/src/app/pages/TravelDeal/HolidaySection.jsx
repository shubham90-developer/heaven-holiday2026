"use client";
import React from "react";
import { CheckCircle2 } from "lucide-react";
import { useGetHolidaySectionQuery } from "../../../../store/travelDealApi/travelDealHeaderApi";

const HolidaySection = () => {
  const { data, isLoading, error } = useGetHolidaySectionQuery();

  if (isLoading) {
    return (
      <section className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center animate-pulse">
          {/* Left side skeleton */}
          <div>
            <div className="h-10 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-10 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="w-12 h-1 bg-gray-200 my-4" />
            <div className="h-5 bg-gray-200 rounded w-full mb-2" />
            <div className="h-5 bg-gray-200 rounded w-4/6" />
          </div>

          {/* Right side skeleton */}
          <div className="grid sm:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-200 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <p className="text-gray-500 text-sm">
            Content unavailable at the moment.
          </p>
        </div>
      </section>
    );
  }

  const holidayData = data?.data;
  const features = holidayData?.features || [];

  return (
    <section className="bg-gray-50">
      <div className="max-w-6xl  mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side */}
        <div>
          <div
            className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug"
            dangerouslySetInnerHTML={{ __html: holidayData?.heading || "" }}
          />
          <div className="w-12 h-1 bg-red-700 my-4"></div>
          <div
            className="text-lg text-gray-700"
            dangerouslySetInnerHTML={{ __html: holidayData?.subheading || "" }}
          />
        </div>

        {/* Right Side */}
        <div className="grid sm:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={feature._id || index} className="flex items-start gap-3">
              <CheckCircle2 className="text-teal-600 w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">
                  {feature.title || ""}
                </h3>
                <div
                  className="text-gray-600 text-sm"
                  dangerouslySetInnerHTML={{
                    __html: feature.description || "",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HolidaySection;
