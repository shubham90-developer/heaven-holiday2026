"use client";
import React from "react";
import { FaHandsHelping, FaBullhorn, FaLaptop, FaUsers } from "react-icons/fa";
import { useGetCounterQuery } from "store/counterApi/counterApi";
const SalesPartnerSection = () => {
  const features = [
    {
      icon: <FaHandsHelping className="text-blue-600 text-2xl" />,
      title: "Support & Training",
      desc: "Our team is connected with you all 365 days of the year",
    },
    {
      icon: <FaBullhorn className="text-blue-600 text-2xl" />,
      title: "Marketing",
      desc: "Continuous marketing deliverables to reach a larger audience",
    },
    {
      icon: <FaLaptop className="text-blue-600 text-2xl" />,
      title: "Online Booking Engine",
      desc: "Check seat availability and book for your guests instantly",
    },
    {
      icon: <FaUsers className="text-blue-600 text-2xl" />,
      title: "MICE & Corporate Travel",
      desc: "For larger group sizes, we have a dedicated team to assist you",
    },
  ];
  const { data, isLoading, error } = useGetCounterQuery();
  if (isLoading) {
    return <p>loading</p>;
  }
  if (error) {
    return <p>error</p>;
  }
  const responce = data.data;

  return (
    <section className="grid md:grid-cols-2">
      {/* Left Column */}
      <div className="bg-white p-8 space-y-6">
        {features.map((item, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="flex-shrink-0 bg-gray-100 p-3 rounded-full">
              {item.icon}
            </div>
            <div>
              <h3 className="text-blue-800 font-semibold text-lg">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Right Column */}
      <div className="bg-[#294999] text-white flex flex-col justify-center items-center p-10 text-center">
        <p className="italic text-lg max-w-lg">
          We are making memories and celebrating life on tour with our guests!
          Just one more reason to apply and be a Heaven Holiday Sales Partner
          today!
        </p>
        <div className="flex gap-12 mt-8">
          <div>
            <h2 className="text-3xl font-bold">{responce?.guests || ""}</h2>
            <p className="text-sm text-gray-200">happy travellers</p>
          </div>
          <div>
            <h2 className="text-3xl font-bold">
              {responce?.toursCompleted || ""}
            </h2>
            <p className="text-sm text-gray-200">successful tours</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalesPartnerSection;
