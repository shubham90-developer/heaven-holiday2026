"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import Link from "next/link";
import { useGetTourManagerDirectoryQuery } from "../../../../store/toursManagement/tourManagersApi";

const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const TourManagerDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState(""); // 🔹 Selected alphabet
  const { data, isLoading, isError } = useGetTourManagerDirectoryQuery();

  if (isLoading) {
    return (
      <section className="relative bg-gray-100 animate-pulse">
        <div className="absolute top-0 left-0 w-full h-50 bg-linear-to-b from-[#0b1a27] via-[#1d2d50] to-[#2a3f65]" />

        <div className="relative max-w-6xl mx-auto px-4 pt-32 pb-16">
          <div className="bg-gray-100 p-5 rounded-2xl">
            {/* Dark Header Skeleton */}
            <div className="bg-[#1c2b3a] rounded-2xl p-6 md:p-10 shadow-lg text-center">
              {/* Heading */}
              <div className="h-6 bg-yellow-400/40 rounded w-2/3 mx-auto mb-6"></div>

              {/* Search Bar */}
              <div className="max-w-lg mx-auto">
                <div className="h-10 bg-gray-500 rounded-full"></div>
              </div>

              <div className="h-4 bg-yellow-400/40 rounded w-40 mx-auto mt-4"></div>

              {/* Alphabet Skeleton */}
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 bg-gray-500 rounded-full"
                  ></div>
                ))}
              </div>
            </div>

            {/* Cards Skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mt-12">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="text-center">
                  <div className="w-full h-48 bg-gray-300 rounded-xl"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mt-3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-red-600">
            Failed to load tour managers. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  const response = data?.data || {};
  const managers = response.managers || [];

  //  Only active managers
  const activeManagers = managers.filter((manager) => {
    if (typeof manager.status === "string") {
      return manager.status.toLowerCase() === "active";
    }
    if (typeof manager.status === "boolean") {
      return manager.status === true;
    }
    return true;
  });

  const filteredManagers = activeManagers.filter((manager) => {
    const name = manager.name || "";
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLetter = selectedLetter
      ? name[0].toUpperCase() === selectedLetter
      : true;
    return matchesSearch && matchesLetter;
  });

  return (
    <section className="relative bg-gray-100">
      <div className="absolute top-0 left-0 w-full h-50 bg-linear-to-b from-[#0b1a27] via-[#1d2d50] to-[#2a3f65]" />

      <div className="relative max-w-6xl mx-auto px-4 pt-32 pb-16">
        <div className="bg-gray-100 p-5 rounded-2xl">
          <div className="bg-[#1c2b3a] rounded-2xl p-6 md:p-10 shadow-lg text-center">
            <h3 className="text-yellow-400 font-semibold text-lg md:text-xl mb-6">
              {response.heading ||
                "Explore the complete profile of the Heaven Holiday tour managers."}
            </h3>

            {/* Search */}
            <div className="relative max-w-lg mx-auto">
              <input
                type="search"
                placeholder="Search tour manager by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-white px-6 py-2 rounded-full border border-gray-300 focus:outline-none shadow-md"
              />
              <button className="absolute right-3 top-2 bg-gray-200 p-2 rounded-full">
                <Search className="w-3 h-3 text-gray-600" />
              </button>
            </div>

            <p className="text-yellow-400 text-sm mt-3">or browse all below</p>

            {/* Alphabet buttons */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {alphabets.map((letter) => (
                <button
                  key={letter}
                  onClick={() =>
                    setSelectedLetter(selectedLetter === letter ? "" : letter)
                  }
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-medium shadow transition ${
                    selectedLetter === letter
                      ? "bg-red-700 text-white"
                      : "bg-white text-gray-700 hover:bg-red-700 hover:text-white"
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          {/* Manager cards */}
          {filteredManagers.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mt-12">
              {filteredManagers.map((manager) => (
                <Link
                  key={manager._id}
                  href={`/tour-manager/${encodeURIComponent(
                    manager.name || "",
                  )}`}
                  className="text-center group"
                >
                  <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-lg border border-gray-200">
                    <Image
                      src={manager.image || "/assets/img/placeholder.png"}
                      alt={manager.name || "Tour Manager"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="mt-3 text-sm font-medium text-gray-900 bg-white py-1 px-2 rounded-md shadow-sm">
                    {manager.name}
                  </h4>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 mt-12">
              No tour managers found.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default TourManagerDirectory;
