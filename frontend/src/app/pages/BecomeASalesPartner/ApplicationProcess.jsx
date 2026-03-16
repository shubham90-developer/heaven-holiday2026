"use client";
import React from "react";
import Image from "next/image";
import { useGetAllApplicationsQuery } from "store/becomeSalesPartner/applicationProcessApi";

const ApplicationProcess = () => {
  const { data, isLoading, error } = useGetAllApplicationsQuery();

  if (isLoading) {
    return <p>loading</p>;
  }
  if (error) {
    return <p>error</p>;
  }

  const steps = data?.data || [];

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
          Application Process
        </h2>
        <p className="text-gray-500 text-center mt-2">
          A step-by-step guide of the application process
        </p>

        {/* Timeline */}
        <div className="relative mt-16">
          {/* Dotted Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full border-l-2 border-dashed border-gray-300"></div>

          {/* Steps */}
          <div className="flex flex-col gap-16">
            {steps.map((step, index) => {
              const isLeft = index % 2 === 0;
              return (
                <div
                  key={step._id}
                  className={`flex w-full items-center ${
                    isLeft ? "justify-start" : "justify-end"
                  }`}
                >
                  <div className="relative bg-white p-6 rounded-xl shadow-md w-72">
                    {/* Number on line */}
                    <div
                      className={`absolute ${isLeft ? "-right-12" : "-left-12"} top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-700 border-2 border-gray-400`}
                    >
                      {index + 1}
                    </div>

                    {/* Image */}
                    <Image
                      src={step.image}
                      alt={step.title}
                      width={80}
                      height={80}
                      className="mx-auto"
                    />

                    {/* Text */}
                    <h3 className="font-semibold text-gray-800 mt-3">
                      {step.title}
                    </h3>
                    <div
                      className="text-sm text-gray-500"
                      dangerouslySetInnerHTML={{ __html: step.description }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplicationProcess;
