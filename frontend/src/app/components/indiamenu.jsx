"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useGetTourPackageQuery } from "store/toursManagement/toursPackagesApi";

const TABS = [
  "North India",
  "South India",
  "East & North East India",
  "Rajasthan, West & Central India",
];

export default function IndiaMenu() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [openAccordion, setOpenAccordion] = useState(null);

  const { data, isLoading, error } = useGetTourPackageQuery();

  // Process backend data to create dynamic structure
  const INDIA_DATA = useMemo(() => {
    if (!data?.data) return {};

    const regionData = {
      "North India": [],
      "South India": [],
      "East & North East India": [],
      "Rajasthan, West & Central India": [],
    };

    // Filter only India category tours
    const indiaTours = data.data.filter(
      (tour) => tour.category?.categoryType === "india",
    );

    // Group states by region
    const statesByRegion = {};
    const citiesByState = {};

    indiaTours.forEach((tour) => {
      tour.states?.forEach((state) => {
        const region = state.region;
        const stateName = state.name;

        if (region && TABS.includes(region)) {
          // Initialize region if not exists
          if (!statesByRegion[region]) {
            statesByRegion[region] = new Set();
          }
          statesByRegion[region].add(stateName);

          // Initialize state cities if not exists
          const stateKey = `${region}_${stateName}`;
          if (!citiesByState[stateKey]) {
            citiesByState[stateKey] = new Set();
          }

          // Add cities to the state
          state.cities?.forEach((city) => {
            citiesByState[stateKey].add(city);
          });
        }
      });
    });

    // Convert to the required format
    Object.keys(statesByRegion).forEach((region) => {
      const states = Array.from(statesByRegion[region]);

      states.forEach((stateName) => {
        const stateKey = `${region}_${stateName}`;
        const cities = Array.from(citiesByState[stateKey] || []);

        if (cities.length > 0) {
          regionData[region].push({
            region: stateName,
            cities: cities.sort(), // Sort cities alphabetically
          });
        }
      });
    });

    return regionData;
  }, [data]);

  if (isLoading) {
    return (
      <div className="left-0 w-full lg:w-[850px] bg-white text-black shadow-lg border-t border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading destinations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="left-0 w-full lg:w-[850px] bg-white text-black shadow-lg border-t border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-red-600">
            Failed to load destinations. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="left-0 w-full lg:w-[850px] bg-white text-black shadow-lg border-t border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-0 py-0">
        {/* Desktop Tabs */}
        <div className="hidden lg:grid grid-cols-5 gap-0 text-xs md:text-sm leading-6">
          <nav
            className="col-span-1 pr-0 border-r border-gray-200"
            role="tablist"
          >
            <ul className="space-y-2">
              {TABS.map((tab) => {
                const active = tab === activeTab;
                return (
                  <li key={tab}>
                    <button
                      onMouseEnter={() => setActiveTab(tab)}
                      onClick={() => setActiveTab(tab)}
                      className={`w-full text-left px-4 text-xs cursor-pointer py-2 flex items-center justify-between transition-colors ${
                        active
                          ? "bg-gray-200 text-black font-semibold hover:bg-gray-100"
                          : "text-gray-600 hover:text-blue-900"
                      }`}
                    >
                      <span className={active ? "text-blue-900" : ""}>
                        {tab}
                      </span>
                      <span className="text-gray-300">›</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="col-span-4 max-h-[420px] overflow-y-auto p-4 bg-gray-100">
            {INDIA_DATA[activeTab] && INDIA_DATA[activeTab].length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {INDIA_DATA[activeTab].map((group) => (
                  <div key={group.region}>
                    <h4 className="text-xs font-semibold border-b border-gray-400 pb-2 mb-2">
                      {group.region}
                    </h4>
                    <ul className="flex flex-col gap-y-2 text-[10px] md:text-xs font-normal">
                      {group.cities.map((city) => (
                        <li key={city}>
                          <Link
                            href={`/tour-list?city=${encodeURIComponent(city)}`}
                            className="hover:text-red-600 hover:font-bold"
                          >
                            {city}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No destinations available for this region</p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Accordion */}
        <div className="block lg:hidden p-3">
          <div className="divide-y divide-gray-200">
            {TABS.map((tab) => {
              const isOpen = openAccordion === tab;
              const hasData = INDIA_DATA[tab] && INDIA_DATA[tab].length > 0;

              return (
                <div key={tab} className="py-3">
                  <button
                    onClick={() => setOpenAccordion(isOpen ? null : tab)}
                    className="w-full flex justify-between items-center px-2 py-2 text-left text-gray-800 font-medium hover:text-blue-700"
                    disabled={!hasData}
                  >
                    <span
                      className={`text-sm ${
                        isOpen ? "text-blue-700 font-semibold" : ""
                      } ${!hasData ? "text-gray-400" : ""}`}
                    >
                      {tab}
                    </span>
                    {hasData && (
                      <span
                        className={`transform transition-transform text-lg ${
                          isOpen
                            ? "rotate-90 text-blue-600"
                            : "rotate-0 text-gray-400"
                        }`}
                      >
                        ›
                      </span>
                    )}
                  </button>

                  {isOpen && hasData && (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-5 pl-2 pr-1">
                      {INDIA_DATA[tab].map((group) => (
                        <div key={group.region}>
                          <h4 className="text-sm font-semibold text-gray-900">
                            {group.region}
                          </h4>
                          <div className="w-10 h-[1px] bg-gray-300 my-2" />
                          <ul className="flex flex-col gap-y-1.5 text-xs font-normal">
                            {group.cities.map((city) => (
                              <li key={city}>
                                <Link
                                  href={`/tour-list?city=${encodeURIComponent(
                                    city,
                                  )}`}
                                  className="hover:text-blue-800 text-gray-700 transition"
                                >
                                  {city}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {isOpen && !hasData && (
                    <div className="mt-3 text-center text-gray-500 text-sm py-4">
                      No destinations available for this region
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
