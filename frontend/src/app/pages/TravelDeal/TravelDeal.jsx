"use client";
import Breadcrumb from "@/app/components/Breadcum";
import React from "react";
import { useGetTravelDealBannerQuery } from "../../../../store/travelDealApi/banner";
const TravelDeal = () => {
  const { data, isLoading, error } = useGetTravelDealBannerQuery();
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 w-40 mx-auto mt-6 rounded"></div>
        <div className="h-75 md:h-100 bg-gray-300 mt-6"></div>
      </div>
    );
  }
  if (error) {
    return <p>error</p>;
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Special offers", href: "/travel-deals" },
        ]}
      />

      <section
        className="py-20 bg-cover bg-center relative"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.2)), url(${data?.data?.image || ""})`,
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-white">
            <p className="text-5xl font-bold">Special offers</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default TravelDeal;
