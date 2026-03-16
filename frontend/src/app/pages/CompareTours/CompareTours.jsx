"use client";
import React, { useState } from "react";
import { FaCcVisa, FaStar } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Bus,
  Camera,
  Cookie,
  Heart,
  PlaneTakeoff,
  User,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/app/components/Breadcum";

const initialTours = {
  Europe: [
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
  Japan: [
    {
      id: 3,
      img: "/assets/img/tour-card/3.avif",
      tag: "Durga Puja Spl.Departures",
      badge: "GROUP Tour JPN",
      title: "European Wonders",
      reviews: 39,
      days: 13,
      destinations: "11 Countries 21 Cities",
      departures: "5 Dates",
      emi: "₹10,858/mo",
      price: "₹3,22,000",
    },
  ],
};

const CompareTours = () => {
  const router = useRouter();

  // ✅ Combine all tours into a single array & store in state
  const [compareTours, setCompareTours] = useState(
    Object.values(initialTours).flat()
  );

  // 🗑️ Remove tour from compare list
  const handleRemove = (id) => {
    setCompareTours(compareTours.filter((tour) => tour.id !== id));
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Compare Tours", href: null },
        ]}
      />

      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-2xl font-semibold text-gray-800">
              Compare Tours
            </p>
          </div>

          {compareTours.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {compareTours.map((tour) => (
                <div
                  key={tour.id}
                  className="border border-gray-300 rounded-lg shadow-sm bg-white overflow-hidden relative"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Left Image Section */}
                    <div className="relative sm:w-1/2">
                      <Image
                        src={tour.img}
                        alt={tour.title}
                        width={1000}
                        height={600}
                        className="w-full h-full object-cover rounded-lg p-2"
                      />

                      {/* Top-Right Action Icons */}
                      <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                        {/* 🗑️ Remove Icon */}
                        <button
                          className="p-2 bg-red-600 rounded-full shadow hover:bg-red-700 cursor-pointer group relative"
                          onClick={() => handleRemove(tour.id)}
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                          <span className="absolute top-full right-1/2 translate-x-1/2 mt-1 hidden group-hover:flex items-center justify-center bg-black text-white text-xs rounded px-2 py-1 shadow z-10 whitespace-nowrap">
                            Remove from Compare
                          </span>
                        </button>

                        {/* ❤️ Wishlist Heart Icon */}
                        <button
                          className="p-2 bg-gray-400 rounded-full shadow hover:bg-gray-500 relative cursor-pointer group"
                          onClick={() => router.push("/wishlist")}
                        >
                          <Heart className="w-4 h-4 text-white" />
                          <span className="absolute top-full right-1/2 translate-x-1/2 mt-1 hidden group-hover:flex items-center justify-center bg-black text-white text-xs rounded px-2 py-1 shadow z-10 whitespace-nowrap">
                            Add to Wishlist
                          </span>
                        </button>
                      </div>

                      {/* Tag */}
                      <span className="absolute bottom-2 left-2 bg-orange-500 text-white text-[10px] px-2 py-1 rounded">
                        {tour.tag.slice(0, 16)}...
                      </span>
                    </div>

                    {/* Right Content Section */}
                    <div className="sm:w-1/2 p-3 flex flex-col justify-between">
                      <div>
                        <p className="bg-orange-500 text-white inline-block py-0.5 px-2 text-[10px] rounded-2xl">
                          {tour.badge}
                        </p>
                        <h3 className="font-bold text-lg mt-1 text-gray-800">
                          {tour.title.slice(0, 25)}...
                        </h3>
                        <div className="flex items-center text-yellow-500 text-sm my-2">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} />
                          ))}
                          <span className="ml-2 text-gray-600">
                            {tour.reviews} Reviews
                          </span>
                        </div>

                        {/* All Inclusive Tooltip */}
                        <div className="relative group inline-block mb-2">
                          <p className="text-blue-600 text-sm cursor-pointer">
                            ∞ All Inclusive
                          </p>
                          <div className="absolute -left-10 mt-2 hidden group-hover:block w-64 bg-white text-gray-800 text-sm rounded-lg p-4 shadow-lg border border-gray-200 z-50">
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
                            <p className="text-red-600 text-xs mt-3">
                              *Economy class air travel is included for all
                              departure cities, except for joining/leaving
                              points; Taxes Extra.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="p-4 pt-0">
                    <div className="text-sm text-gray-600 flex justify-between mb-4">
                      <div>
                        <p className="font-semibold text-xs">Days:</p>
                        <p className="text-black font-bold">{tour.days}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-xs">Destinations:</p>
                        <p className="text-blue-900 font-bold">
                          {tour.destinations}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-xs">Departures:</p>
                        <p className="text-blue-900 font-bold">
                          {tour.departures}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-2xl border border-gray-200">
                      <div className="text-xs text-gray-600 mb-3 flex justify-between">
                        <div>
                          <p>EMI from</p>
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

                      <div className="flex justify-between gap-2">
                        <Link
                          href="/tour-details"
                          className="flex-1 border border-blue-600 text-center font-bold text-blue-600 px-2 py-2 rounded-md text-sm"
                        >
                          View Tour Details
                        </Link>
                        <Link
                          href="/tour-details"
                          className="flex-1 bg-red-700 text-center text-white font-bold px-2 py-2 rounded-md text-sm"
                        >
                          Book Online
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-lg">
              No tours to compare.
            </p>
          )}
        </div>
      </section>
    </>
  );
};

export default CompareTours;
