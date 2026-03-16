"use client";
import React from "react";
import Image from "next/image";
import { useGetHowWeHireQuery } from "../../../../store/careers/hiringStepsApi";

const HowWeHire = () => {
  const { data, error, isLoading } = useGetHowWeHireQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading data</p>;
  }

  const howWeHireData = data?.data;

  return (
    <section className="bg-gray-50 py-14">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-2xl md:text-2xl text-center font-bold mb-3">
          {howWeHireData?.heading || "How we hire"}
        </h2>

        {/* Underline Image */}
        <div className="flex justify-center mb-8">
          <img
            src="/assets/img/header-bottom.svg"
            alt="underline"
            className="w-40 md:w-50"
          />
        </div>

        {/* Intro Text */}
        {howWeHireData?.introText && (
          <div
            className="text-gray-600 max-w-3xl mx-auto"
            dangerouslySetInnerHTML={{ __html: howWeHireData.introText }}
          />
        )}

        {/* Sub Text */}
        {howWeHireData?.subText && (
          <div
            className="text-gray-600 max-w-4xl mx-auto mt-3"
            dangerouslySetInnerHTML={{ __html: howWeHireData.subText }}
          />
        )}

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-12 mt-12">
          {howWeHireData?.steps?.map((step, idx) => (
            <div
              key={step._id || idx}
              className="flex flex-col items-center text-center"
            >
              {/* Image */}
              <div className="w-40 h-40 flex items-center justify-center mb-6">
                <Image
                  src={step.img}
                  alt={step.title}
                  width={150}
                  height={150}
                  className="object-contain"
                />
              </div>
              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-800">
                {step.title}
              </h3>
              {/* Description */}
              <div
                className="text-gray-600 mt-2 text-xs leading-relaxed"
                dangerouslySetInnerHTML={{ __html: step.description }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowWeHire;
