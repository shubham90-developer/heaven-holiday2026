"use client";
import React from "react";
import { useGetAllServicesQuery } from "store/aboutUsApi/servicesApi";

const AllInclusive = () => {
  const { data, isLoading, error } = useGetAllServicesQuery();

  const services = data?.data?.items ?? [];
  const title = data?.data?.title ?? "";
  const subtitle = data?.data?.subtitle ?? "";

  const activeServices = services.filter((item) => item.status === "active");

  return (
    <section className="w-full relative py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Dynamic Title */}
        <h2 className="text-2xl md:text-2xl font-bold mb-3">
          {" "}
          All Inclusive Tours,{" "}
          <span className="text-gray-800">
            Chalo Bag Bharo Nikal Pado!
          </span>{" "}
        </h2>
        <div className="flex justify-center mb-12">
          <img
            src="/assets/img/header-bottom.svg"
            alt="underline"
            className="w-40 md:w-50"
          />
        </div>

        {/* Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-red-500 text-center">Failed to load services.</p>
        )}

        {/* Services Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {activeServices.map((item, index) => (
              <div
                key={item._id || `${item.iconTitle}-${index}`}
                className="flex items-start gap-4 text-left"
              >
                <div className="shrink-0">
                  <img
                    src={item.icon}
                    alt={item.iconTitle}
                    className="w-14 h-14 rounded-full bg-gray-100 p-2"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {item.iconTitle}
                  </h3>
                  <div
                    className="text-gray-600 text-sm"
                    dangerouslySetInnerHTML={{
                      __html: item.iconDescription || "",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AllInclusive;
