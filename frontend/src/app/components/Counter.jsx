"use client";
import React from "react";
import {
  FaSmile,
  FaTrophy,
  FaUserTie,
  FaMapMarkerAlt,
  FaRocket,
} from "react-icons/fa";
import { useGetCounterQuery } from "../../../store/counterApi/counterApi";

const Counter = () => {
  const { data, isLoading, error } = useGetCounterQuery();
  const responce = data?.data;

  const stats = [
    {
      id: 1,
      icon: <FaSmile className="text-yellow-400 text-4xl" />,
      number: responce?.guests,
      label: "Happy guests",
    },
    {
      id: 2,
      icon: <FaTrophy className="text-yellow-400 text-4xl" />,
      number: responce?.toursCompleted,
      label: "Tours completed",
    },
    {
      id: 3,
      icon: <FaUserTie className="text-yellow-400 text-4xl" />,
      number: responce?.tourExpert + "+",
      label: "Tour Experts",
    },
    {
      id: 4,
      icon: <FaMapMarkerAlt className="text-yellow-400 text-4xl" />,
      number: responce?.tourDestination + "+",
      label: "Tour destinations",
    },
    {
      id: 5,
      icon: <FaRocket className="text-yellow-400 text-4xl" />,
      number: responce?.bigTravelCompany,
      label: "Bharat Ki Sabse Behtareen Travel Company",
    },
  ];

  return (
    <section className="bg-[#0b1c38] text-white py-14 relative bg-[url('/assets/img/World-map.svg')] bg-cover bg-center bg-no-repeat">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        {isLoading ? (
          <div className="mb-12 border-l border-yellow-400 pl-2 space-y-3">
            <div className="h-4 w-64 bg-gray-600 animate-pulse rounded"></div>
            <div className="h-6 w-80 bg-gray-500 animate-pulse rounded"></div>
          </div>
        ) : (
          <div className="text-left mb-12 border-l border-yellow-400 pl-2 border-opacity-50">
            <p className="text-gray-300">{responce?.title || ""}</p>
            <h2 className="text-2xl md:text-3xl font-bold text-yellow-400">
              {responce?.subTitle || ""}
            </h2>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-red-400 text-center">
            Failed to load counter data.
          </p>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 text-center">
          {isLoading
            ? [...Array(5)].map((_, i) => (
                <div key={i} className="flex flex-col items-center space-y-3">
                  <div className="w-10 h-10 bg-gray-600 rounded-full animate-pulse"></div>
                  <div className="h-6 w-16 bg-gray-500 rounded animate-pulse"></div>
                  <div className="h-3 w-24 bg-gray-600 rounded animate-pulse"></div>
                </div>
              ))
            : stats.map((item) => (
                <div key={item.id} className="flex flex-col items-center">
                  {item.icon}
                  <h3 className="text-2xl md:text-3xl font-bold mt-3">
                    {item.number}
                  </h3>
                  <p className="text-gray-300 text-sm mt-1">{item.label}</p>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default Counter;
