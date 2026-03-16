"use client";
import React from "react";
import { useGetEmpoweringQuery } from "../../../../store/careers/empoweringWomen";

const Empowering = () => {
  const { data, isLoading, error } = useGetEmpoweringQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading data</p>;
  }

  const empoweringData = data?.data;

  return (
    <>
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            {/* Title */}
            <p className="texbt-2xl md:text-3xl font-bold text-black">
              {empoweringData?.title || "Empowering the women of tomorrow"}
            </p>

            {/* Subtitle */}
            <p className="text-lg md:text-xl font-semibold text-black mb-10">
              {empoweringData?.subtitle ||
                "Heaven Holiday women are creating the future — and you can too."}
            </p>

            {/* Dynamic Paragraphs */}
            {empoweringData?.paragraphs?.map((paragraph, idx) => (
              <div
                key={idx}
                className="text-sm md:text-md font-medium text-gray-600"
                dangerouslySetInnerHTML={{ __html: paragraph }}
              />
            ))}

            {/* Footer Title */}
            {empoweringData?.footerTitle && (
              <h5 className="text-lg md:text-xl font-semibold text-black mt-10">
                {empoweringData.footerTitle}
              </h5>
            )}

            {/* Disclaimer */}
            {empoweringData?.disclaimer && (
              <div
                className="text-sm md:text-md font-semibold"
                dangerouslySetInnerHTML={{ __html: empoweringData.disclaimer }}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Empowering;
