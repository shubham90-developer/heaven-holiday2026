"use client";
import React from "react";
import {
  FaSmile,
  FaTrophy,
  FaUserTie,
  FaMapMarkerAlt,
  FaRocket,
} from "react-icons/fa";
import { useGetCounterQuery } from "store/counterApi/counterApi";

const ExperienceCounter = () => {
  const { data, isLoading, error } = useGetCounterQuery();
  if (isLoading) {
    return <p>loading</p>;
  }
  if (error) {
    return <p>error</p>;
  }
  const responce = data?.data;
  const stats = [
    {
      id: 1,
      icon: <FaSmile className="text-yellow-400 text-4xl" />,
      number: `${responce?.guests}`,
      label: "Happy guests",
    },
    {
      id: 2,
      icon: <FaTrophy className="text-yellow-400 text-4xl" />,
      number: `${responce?.toursCompleted}`,
      label: "Tours completed",
    },
    {
      id: 3,
      icon: <FaUserTie className="text-yellow-400 text-4xl" />,
      number: `${responce?.tourExpert}+`,
      label: "Tour Experts",
    },
    {
      id: 4,
      icon: <FaMapMarkerAlt className="text-yellow-400 text-4xl" />,
      number: `${responce?.tourDestination}+`,
      label: "Tour destinations",
    },
    {
      id: 5,
      icon: <FaRocket className="text-yellow-400 text-4xl" />,
      number: `${responce?.bigTravelCompany}`,
      label: "Bharat Ki Sabse Behtareen Travel Company",
    },
  ];
  return (
    <section className="bg-[#0b1c38] text-white py-14 relative bg-[url('/assets/img/World-map.svg')] bg-cover bg-center bg-no-repeat">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="text-left mb-12 border-l border-yellow-400  pl-2 border-opacity-50">
          <p className="text-gray-300">
            {responce?.title || "We're curating experiences that"}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-yellow-400">
            {responce?.subTitle || " win hearts and make you Celebrate Life!"}
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 text-center">
          {stats.map((item) => (
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

export default ExperienceCounter;
