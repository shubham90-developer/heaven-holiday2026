"use client";
import React from "react";
import { useGetAllServicesQuery } from "../../../../store/aboutUsApi/servicesApi";

const WhyVeenaWorld = () => {
  const { data, isLoading, error } = useGetAllServicesQuery();

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-600">Loading services...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-red-600">
            Failed to load services. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  const response = data?.data;
  const features = response?.items || [];
  const activeFeatures = features.filter((item) => item.status === "active");

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Heading */}
        <h4 className="text-gray-500 text-sm font-medium mb-2">
          {response?.title || "Why Heaven Holiday?"}
        </h4>
        <h2 className="text-3xl md:text-3xl font-bold text-gray-900 mb-12">
          {response?.subtitle || "Everything under One Roof"}
        </h2>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {activeFeatures.map((item, index) => (
            <div
              key={item._id || index}
              className="flex flex-col items-center text-center space-y-3"
            >
              {/* Icon Image */}
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100">
                <img
                  src={item.icon}
                  alt={item.iconTitle}
                  className="w-10 h-10 object-contain"
                />
              </div>

              <h3 className="text-md mb-0 font-semibold">
                {item.iconTitle || ""}
              </h3>
              <p
                className="text-xs text-gray-600"
                dangerouslySetInnerHTML={{ __html: item.iconDescription || "" }}
              ></p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyVeenaWorld;
