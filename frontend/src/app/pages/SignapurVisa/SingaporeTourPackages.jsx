"use client";
import React, { useState } from "react";
import { FaCcVisa, FaStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Building,
  Building2,
  Bus,
  Camera,
  Cookie,
  Heart,
  PlaneTakeoff,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";

const toursData = {
  "Vibrant North East": [
    {
      id: 1,
      img: "/assets/img/tour-card/1.avif",
      tag: "Durga Puja Spl.Departures",
      badge: "GROUP Tour EUEP",
      title: "European Splendours",
      reviews: 40,
      days: 10,
      destinations: "10 Countries 16 Cities",
      departures: "7 Dates",
      emi: "₹8,835/mo",
      price: "₹2,62,000",
    },
    {
      id: 2,
      img: "/assets/img/tour-card/2.avif",
      tag: "Durga Puja Spl.Departures",
      badge: "GROUP Tour EUEP",
      title: "European Panorama",
      reviews: 22,
      days: 8,
      destinations: "8 Countries 12 Cities",
      departures: "2 Dates",
      emi: "₹8,363/mo",
      price: "₹2,48,000",
    },
    {
      id: 3,
      img: "/assets/img/tour-card/3.avif",
      tag: "Durga Puja Spl.Departures",
      badge: "GROUP Tour EUEP",
      title: "European Wonders",
      reviews: 39,
      days: 13,
      destinations: "11 Countries 21 Cities",
      departures: "5 Dates",
      emi: "₹10,858/mo",
      price: "₹3,22,000",
    },
    {
      id: 4,
      img: "/assets/img/tour-card/4.avif",
      tag: "Durga Puja Spl.Departures",
      badge: "GROUP Tour EUEP",
      title: "European Jewels with Versailles",
      reviews: 197,
      days: 15,
      destinations: "12 Countries 23 Cities",
      departures: "4 Dates",
      emi: "₹12,982/mo",
      price: "₹3,85,000",
    },
  ],
  "Enchanting Uttar Pradesh": [
    {
      id: 1,
      img: "/assets/img/tour-card/1.avif",
      tag: "Durga Puja Spl.Departures",
      badge: "GROUP Tour EUEP",
      title: "European Splendours",
      reviews: 40,
      days: 10,
      destinations: "10 Countries 16 Cities",
      departures: "7 Dates",
      emi: "₹8,835/mo",
      price: "₹2,62,000",
    },

    {
      id: 3,
      img: "/assets/img/tour-card/3.avif",
      tag: "Durga Puja Spl.Departures",
      badge: "GROUP Tour EUEP",
      title: "European Wonders",
      reviews: 39,
      days: 13,
      destinations: "11 Countries 21 Cities",
      departures: "5 Dates",
      emi: "₹10,858/mo",
      price: "₹3,22,000",
    },
    {
      id: 4,
      img: "/assets/img/tour-card/4.avif",
      tag: "Durga Puja Spl.Departures",
      badge: "GROUP Tour EUEP",
      title: "European Jewels with Versailles",
      reviews: 197,
      days: 15,
      destinations: "12 Countries 23 Cities",
      departures: "4 Dates",
      emi: "₹12,982/mo",
      price: "₹3,85,000",
    },
  ],
  "Royal Rajasthan": [
    {
      id: 1,
      img: "/assets/img/tour-card/1.avif",
      tag: "Durga Puja Spl.Departures",
      badge: "GROUP Tour EUEP",
      title: "European Splendours",
      reviews: 40,
      days: 10,
      destinations: "10 Countries 16 Cities",
      departures: "7 Dates",
      emi: "₹8,835/mo",
      price: "₹2,62,000",
    },
    {
      id: 2,
      img: "/assets/img/tour-card/2.avif",
      tag: "Durga Puja Spl.Departures",
      badge: "GROUP Tour EUEP",
      title: "European Panorama",
      reviews: 22,
      days: 8,
      destinations: "8 Countries 12 Cities",
      departures: "2 Dates",
      emi: "₹8,363/mo",
      price: "₹2,48,000",
    },
  ],
  "Majestic Madhya Pradesh": [
    {
      id: 2,
      img: "/assets/img/tour-card/2.avif",
      tag: "Durga Puja Spl.Departures",
      badge: "GROUP Tour EUEP",
      title: "European Panorama",
      reviews: 22,
      days: 8,
      destinations: "8 Countries 12 Cities",
      departures: "2 Dates",
      emi: "₹8,363/mo",
      price: "₹2,48,000",
    },
    {
      id: 3,
      img: "/assets/img/tour-card/3.avif",
      tag: "Durga Puja Spl.Departures",
      badge: "GROUP Tour EUEP",
      title: "European Wonders",
      reviews: 39,
      days: 13,
      destinations: "11 Countries 21 Cities",
      departures: "5 Dates",
      emi: "₹10,858/mo",
      price: "₹3,22,000",
    },
    {
      id: 4,
      img: "/assets/img/tour-card/4.avif",
      tag: "Durga Puja Spl.Departures",
      badge: "GROUP Tour EUEP",
      title: "European Jewels with Versailles",
      reviews: 197,
      days: 15,
      destinations: "12 Countries 23 Cities",
      departures: "4 Dates",
      emi: "₹12,982/mo",
      price: "₹3,85,000",
    },
  ],
  "Exotic Kerela": [
    {
      id: 1,
      img: "/assets/img/tour-card/1.avif",
      tag: "Durga Puja Spl.Departures",
      badge: "GROUP Tour EUEP",
      title: "European Splendours",
      reviews: 40,
      days: 10,
      destinations: "10 Countries 16 Cities",
      departures: "7 Dates",
      emi: "₹8,835/mo",
      price: "₹2,62,000",
    },
    {
      id: 2,
      img: "/assets/img/tour-card/2.avif",
      tag: "Durga Puja Spl.Departures",
      badge: "GROUP Tour EUEP",
      title: "European Panorama",
      reviews: 22,
      days: 8,
      destinations: "8 Countries 12 Cities",
      departures: "2 Dates",
      emi: "₹8,363/mo",
      price: "₹2,48,000",
    },
    {
      id: 3,
      img: "/assets/img/tour-card/3.avif",
      tag: "Durga Puja Spl.Departures",
      badge: "GROUP Tour EUEP",
      title: "European Wonders",
      reviews: 39,
      days: 13,
      destinations: "11 Countries 21 Cities",
      departures: "5 Dates",
      emi: "₹10,858/mo",
      price: "₹3,22,000",
    },
    {
      id: 4,
      img: "/assets/img/tour-card/4.avif",
      tag: "Durga Puja Spl.Departures",
      badge: "GROUP Tour EUEP",
      title: "European Jewels with Versailles",
      reviews: 197,
      days: 15,
      destinations: "12 Countries 23 Cities",
      departures: "4 Dates",
      emi: "₹12,982/mo",
      price: "₹3,85,000",
    },
  ],
};

const SingapurTourPackages = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Vibrant North East");

  return (
    <section className="py-12 bg-white relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <h2 className="text-2xl md:text-2xl text-center font-bold mb-3">
          Singapore Tour Packages
        </h2>

        {/* Underline Image */}
        <div className="flex justify-center mb-8">
          <img
            src="/assets/img/header-bottom.svg" // 👉 replace with your underline image path
            alt="underline"
            className="w-40 md:w-50"
          />
        </div>

        {/* Slider Wrapper with relative for positioning */}
        <div className="relative ">
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              375: { slidesPerView: 1 },
              640: { slidesPerView: 1 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-10"
          >
            {toursData[activeTab].length > 0 ? (
              toursData[activeTab].map((tour) => (
                <SwiperSlide key={tour.id}>
                  <div className=" border border-gray-300 rounded-lg shadow-sm bg-white overflow-hidden ">
                    <div className="flex ">
                      {/* Left Image with Wishlist */}
                      <div className="relative w-1/2">
                        <Image
                          src={tour.img}
                          alt={tour.title}
                          width={1000}
                          height={600}
                          className="w-full h-full object-cover rounded-2xl p-2"
                        />
                        {/* Wishlist Heart Icon */}
                        <div className="absolute top-3 right-3 group">
                          <button
                            className="p-2 bg-gray-400 rounded-full shadow hover:bg-gray-500 relative cursor-pointer"
                            onClick={() => router.push("/wishlist")}
                          >
                            <Heart className="w-3 h-3 text-white" />
                          </button>

                          {/* Tooltip */}
                          <div
                            className="absolute top-full right-1/2 translate-x-1/2 mt-1 
                  hidden group-hover:flex items-center justify-center
                  bg-black text-white text-xs rounded px-2 py-1 shadow z-10 whitespace-nowrap"
                          >
                            Add to Wishlist
                          </div>
                        </div>

                        {/* Tag */}
                        <span className="absolute bottom-2 left-2 bg-orange-500 text-white text-[10px] px-2 py-1 rounded">
                          {tour.tag.slice(0, 16)}...
                        </span>
                      </div>

                      {/* Right Content */}
                      <div className="w-2/2 p-2">
                        <p className="bg-orange-500 text-white border border-red-500 inline-block py-0.6 px-2 text-[10px] rounded-2xl ">
                          {tour.badge}
                        </p>
                        <h3 className="font-bold text-lg">
                          {tour.title.slice(0, 20)}...
                        </h3>
                        <div className="flex items-center text-yellow-500 text-sm my-2">
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <span className="ml-2 text-gray-600">
                            {tour.reviews} Reviews
                          </span>
                        </div>

                        {/* All Inclusive + Tooltip */}
                        <div className="relative group inline-block mb-2">
                          <p className="text-blue-600 text-sm cursor-pointer">
                            ∞ All Inclusive
                          </p>

                          {/* Tooltip */}
                          <div
                            className="absolute -left-10 mt-2 hidden group-hover:block 
                  w-64 bg-white text-gray-800 text-sm rounded-lg p-4 shadow-lg border border-gray-200 z-50"
                          >
                            <h4 className="font-semibold mb-3">
                              Tour Includes
                            </h4>

                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div className="flex items-center gap-2">
                                <Building2 className="w-5 h-5" />
                                <span>Hotel</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Cookie className="w-5 h-5" />
                                <span>Meals</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <PlaneTakeoff className="w-5 h-5" />
                                <span>Flight</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Camera className="w-5 h-5" />
                                <span>Sightseeing</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Bus className="w-5 h-5" />
                                <span>Transport</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FaCcVisa className="w-5 h-5" />
                                <span>Visa</span>
                              </div>
                              <div className="flex items-center gap-2 col-span-2">
                                <User className="w-5 h-5" />
                                <span>Tour Manager</span>
                              </div>
                            </div>

                            {/* Extra Note */}
                            <p className="text-red-600 text-xs mt-3">
                              *Economy class air travel is included for all
                              departure cities, except for joining/leaving
                              points; Taxes Extra.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      {/* Info */}
                      <div className="text-sm text-gray-600 space-y-1 mb-4 flex justify-between">
                        <div className="text-xs">
                          <p className="font-semibold">Days:</p>
                          <p className="text-black font-bold">{tour.days}</p>
                        </div>
                        <div className="text-xs">
                          <p className="font-semibold">Destinations:</p>{" "}
                          <p className="text-blue-900 font-bold">
                            {" "}
                            {tour.destinations}
                          </p>
                        </div>
                        <div className="text-xs">
                          <p className="font-semibold">Departures:</p>{" "}
                          <p className="text-blue-900 font-bold">
                            {" "}
                            {tour.departures}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-100 p-4 rounded-2xl border border-gray-200">
                        {/* Price */}
                        <div className="text-xs text-gray-600 mb-3 flex justify-between">
                          <div>
                            <p>EMI from </p>
                            <span className="text-blue-600 font-bold">
                              {tour.emi}
                            </span>
                          </div>
                          <div>
                            <p>
                              Starts from{" "}
                              <span className="font-bold">{tour.price}</span>
                            </p>

                            <p>per person on twin sharing</p>
                          </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-between gap-2">
                          <Link
                            href="tour-details"
                            className="flex-1 border border-blue-600 text-center font-bold text-blue-600 px-2 py-2 rounded-md text-sm"
                          >
                            View Tour Details
                          </Link>
                          <Link
                            href="tour-details"
                            className="flex-1 bg-red-700 text-center text-white font-bold px-2 py-2 rounded-md text-sm"
                          >
                            Book Online
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))
            ) : (
              <p className="text-center text-gray-500">No tours available.</p>
            )}
          </Swiper>

          {/* Custom Nav Buttons */}
          <button className="custom-prev absolute top-1/2 -left-3 z-10 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow hover:bg-gray-300 cursor-pointer">
            ❮
          </button>
          <button className="custom-next absolute top-1/2 -right-3 z-10 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow hover:bg-gray-300 cursor-pointer">
            ❯
          </button>
        </div>
      </div>
    </section>
  );
};

export default SingapurTourPackages;
