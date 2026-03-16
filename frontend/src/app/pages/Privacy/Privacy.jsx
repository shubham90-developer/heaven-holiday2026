"use client";
import Breadcrumb from "@/app/components/Breadcum";
import React from "react";
import { useGetPrivacyPolicyQuery } from "../../../../store/privacyPolicyApi/privacyPolicyApi";

const PrivacyPolicy = () => {
  const { data, isError, isLoading } = useGetPrivacyPolicyQuery();

  // Skeleton loader
  if (isLoading) {
    return (
      <>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Privacy Policy", href: null },
          ]}
        />
        <section className="py-10 bg-gray-100">
          <div className="max-w-4xl mx-auto px-4 bg-white p-5 rounded-lg shadow animate-pulse space-y-4">
            {/* Title skeleton */}
            <div className="h-10 bg-gray-200 rounded w-1/2 mx-auto mb-6"></div>
            {/* Content skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-red-600 py-10">
        Failed to load privacy policy. Please try again.
      </p>
    );
  }

  const response = data?.data;

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy", href: null },
        ]}
      />
      <section className="py-10 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 bg-red-700 p-5 text-white rounded-lg shadow">
          <div>
            <p className="text-2xl font-bold bg-black text-white p-4 mb-10 text-center">
              Privacy Policy
            </p>
            <p
              className="text-md text-justify mb-4"
              dangerouslySetInnerHTML={{ __html: response?.content || "" }}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicy;
