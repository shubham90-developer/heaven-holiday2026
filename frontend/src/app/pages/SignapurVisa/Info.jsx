"use client";
import React from "react";
import { useGetVisaInfoQuery } from "../../../../store/singaporeVisaApi/singaporevisaApi";

const Info = () => {
  const { data, isLoading, error } = useGetVisaInfoQuery();
  if (isLoading) {
    return (
      <section className="py-10 bg-amber-100">
        <div className="max-w-6xl mx-auto px-4 animate-pulse">
          <div className="space-y-3">
            <div className="h-4 bg-amber-300 rounded w-3/4"></div>
            <div className="h-4 bg-amber-300 rounded w-full"></div>
            <div className="h-4 bg-amber-300 rounded w-5/6"></div>
          </div>
        </div>
      </section>
    );
  }
  if (error) {
    return <p>error</p>;
  }

  return (
    <>
      <section className="py-10  bg-amber-100">
        <div className="max-w-6xl mx-auto px-4">
          <div>
            <p
              className="text-xs md:text-sm font-medium text-black mb-4"
              dangerouslySetInnerHTML={{
                __html: data?.data?.heading || "",
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Info;
