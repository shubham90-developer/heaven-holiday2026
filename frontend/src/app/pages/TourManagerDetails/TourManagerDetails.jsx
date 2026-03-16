"use client";
import Breadcrumb from "@/app/components/Breadcum";
import Image from "next/image";
import React from "react";

const TourManagerDetails = () => {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Tours Manager", href: "/tours" },
    { label: "Abhishek Narvekar", href: null },
  ];

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />

      <section className="py-10">
        <div
          className="
            max-w-6xl mx-auto 
            px-4 sm:px-6 lg:px-8 
            grid grid-cols-1 md:grid-cols-2 
            gap-8 lg:gap-16 
            items-center
          "
        >
          {/* LEFT CONTENT */}
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-light text-gray-700">
              Hello, I’m{" "}
              <span className="text-blue-600 font-semibold">Abhishek</span>{" "}
              <span className="font-semibold text-gray-900">Narvekar</span>
            </h2>
            <p className="text-gray-500 text-sm">Heaven Holiday Tour Manager</p>

            {/* Bio */}
            <p className="text-gray-600 text-sm leading-relaxed italic">
              “Abhishek Narvekar is from Prabhadevi, Mumbai, Maharashtra. A
              strong part of the Heaven Holiday team of tour managers, Abhishek
              loves Playing Musical Instruments And Going On Bike Rides. When it
              comes to food, his favourite food is Maharashtrian, North Indian &
              Sea Food. As a sports lover, his favourite sports include Cricket,
              Swimming & Kabaddi. And finally, when it comes to travel, his
              favourite travel destinations include Leh Ladakh, Rajasthan,
              Himachal Pradesh, Kerala, Sikkim & North East.”
            </p>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="bg-[#f1f4ff] px-6 py-4 rounded-md text-center flex-1">
                <h4 className="text-xl font-semibold text-gray-900">46+</h4>
                <p className="text-sm text-gray-600">Tours Conducted</p>
              </div>
              <div className="bg-[#f1f4ff] px-6 py-4 rounded-md text-center flex-1">
                <h4 className="text-xl font-semibold text-gray-900">1079+</h4>
                <p className="text-sm text-gray-600">Guests enjoyed on tour</p>
              </div>
            </div>

            {/* Planning Text */}
            <div>
              <p className="font-bold text-lg md:text-xl">Planning a tour?</p>
              <p className="text-sm text-gray-600">
                Enter your details and we will get back to you.
              </p>
            </div>

            {/* Enquiry Form */}
            <form className="mt-2 flex flex-col md:flex-row gap-2">
              <input
                type="text"
                placeholder="Full Name*"
                className="flex-1 px-4 py-3 rounded-md text-gray-900 bg-white text-sm focus:outline-none border border-gray-300"
              />
              <div className="flex items-center bg-white rounded-md px-3 border   border-gray-300 flex-1">
                <span className="text-sm">🇮🇳</span>
                <span className="text-gray-500 ml-2 mr-2">+91</span>
                <input
                  type="tel"
                  placeholder=""
                  className="flex-1 py-3 text-gray-900 focus:outline-none text-sm  "
                />
              </div>
              <button
                type="submit"
                className="bg-red-700  cursor-pointer hover:bg-red-500 text-white font-medium px-6 py-3 rounded-md transition text-sm whitespace-nowrap"
              >
                Request Call Back
              </button>
            </form>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative">
            <Image
              src="/assets/img/tour-manager/2.avif"
              alt="Tour Manager"
              width={400}
              height={600}
              className="rounded-2xl h-[300px] shadow-md object-cover w-[400px]"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default TourManagerDetails;
