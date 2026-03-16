"use client";
import { useGetContactDetailsQuery } from "store/aboutUsApi/contactApi";
import React, { useState } from "react";
import { FaSmile, FaPlane, FaStar, FaUserTie } from "react-icons/fa";
import { useGetCounterQuery } from "../../../../store/counterApi/counterApi";

// const states = [
//   "Andhra Pradesh",
//   "Arunachal Pradesh",
//   "Assam",
//   "Bihar",
//   "Chhattisgarh",
//   "Goa",
//   "Gujarat",
//   "Haryana",
//   "Himachal Pradesh",
//   "Jharkhand",
//   "Karnataka",
//   "Kerala",
//   "Madhya Pradesh",
//   "Maharashtra",
//   "Manipur",
//   "Meghalaya",
//   "Mizoram",
//   "Nagaland",
//   "Odisha",
//   "Punjab",
//   "Rajasthan",
//   "Sikkim",
//   "Tamil Nadu",
//   "Telangana",
//   "Tripura",
//   "Uttar Pradesh",
//   "Uttarakhand",
//   "West Bengal",
//   "Delhi",
//   "Jammu & Kashmir",
//   "Ladakh",
//   "Puducherry",
//   "Chandigarh",
//   "Dadra & Nagar Haveli",
//   "Daman & Diu",
//   "Lakshadweep",
//   "Andaman & Nicobar Islands",
// ];

const MapTabs = () => {
  const [selection, setSelection] = useState("All destinations");
  const { data, isLoading, error } = useGetContactDetailsQuery();

  // const dropdownOptions = ["All destinations", "India", ...states];

  const {
    data: counter,
    isLoading: counterLoading,
    isError: counterError,
  } = useGetCounterQuery();

  if (counterLoading) {
    return <p>loading</p>;
  }
  if (counterError) {
    return <p>error</p>;
  }

  const mapLink = data?.data?.offices?.mapLink;

  return (
    <section className="py-10 bg-gray-100">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 px-4">
        {/* Left Side - Map */}
        <div className="bg-white rounded-lg shadow-md p-4">
          {/* Map Area */}
          <div className="relative mt-4 bg-gray-100 rounded-lg h-[400px] flex items-center justify-center">
            {mapLink ? (
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(mapLink)}&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
              />
            ) : (
              <p className="text-gray-500">Map not available</p>
            )}

            {/* Zoom Controls */}
            <div className="absolute right-4 top-1/2 flex flex-col gap-2 -translate-y-1/2">
              <button className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-xl">
                +
              </button>
              <button className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-xl">
                −
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Stats */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* Dropdown */}
          {/* <div className="bg-white rounded-lg shadow-md p-3">
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 focus:ring focus:ring-blue-200"
              value={selection}
              onChange={(e) => setSelection(e.target.value)}
            >
              {dropdownOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div> */}

          {/* Stats Cards */}
          <div className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4">
            <FaSmile className="text-yellow-500 text-2xl" />
            <div>
              <h3 className="text-2xl font-bold text-blue-700">
                {counter?.data?.guests || ""}
              </h3>
              <p className="text-gray-600 text-sm">Happy Guests</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4">
            <FaPlane className="text-gray-500 text-2xl" />
            <div>
              <h3 className="text-2xl font-bold text-blue-700">
                {counter?.data?.toursCompleted || ""}
              </h3>
              <p className="text-gray-600 text-sm">Tours Conducted</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4">
            <FaStar className="text-yellow-400 text-2xl" />
            <div>
              <h3 className="text-2xl font-bold text-blue-700">
                {counter?.data?.tourDestination || ""}
              </h3>
              <p className="text-gray-600 text-sm">Tour Destinations</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4">
            <FaUserTie className="text-gray-600 text-2xl" />
            <div>
              <h3 className="text-2xl font-bold text-blue-700">
                {counter?.data?.tourExpert || ""}
              </h3>
              <p className="text-gray-600 text-sm">Tour Managers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapTabs;
