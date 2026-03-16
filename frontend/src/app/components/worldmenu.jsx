"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useGetTourPackageQuery } from "store/toursManagement/toursPackagesApi";

const TABS = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "Oceania",
  "South America",
];

export default function WorldMenu() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [openAccordion, setOpenAccordion] = useState(null);

  const { data, isLoading, error } = useGetTourPackageQuery();

  // Process backend data to create dynamic structure
  const WORLD_DATA = useMemo(() => {
    if (!data?.data) return {};

    const continentData = {
      Africa: [],
      Asia: [],
      Europe: [],
      "North America": [],
      Oceania: [],
      "South America": [],
    };

    // Filter only World category tours
    const worldTours = data.data.filter(
      (tour) => tour.category?.categoryType === "world",
    );

    // Group states by continent
    const statesByContinent = {};
    const citiesByState = {};

    worldTours.forEach((tour) => {
      tour.states?.forEach((state) => {
        const continent = state.continent;
        const stateName = state.name;

        if (continent && TABS.includes(continent)) {
          // Initialize continent if not exists
          if (!statesByContinent[continent]) {
            statesByContinent[continent] = new Set();
          }
          statesByContinent[continent].add(stateName);

          // Initialize state cities if not exists
          const stateKey = `${continent}_${stateName}`;
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
    Object.keys(statesByContinent).forEach((continent) => {
      const states = Array.from(statesByContinent[continent]);

      states.forEach((stateName) => {
        const stateKey = `${continent}_${stateName}`;
        const cities = Array.from(citiesByState[stateKey] || []);

        if (cities.length > 0) {
          continentData[continent].push({
            region: stateName,
            cities: cities.sort(), // Sort cities alphabetically
          });
        }
      });
    });

    return continentData;
  }, [data]);

  if (isLoading) {
    return (
      <div className="left-0 w-full lg:w-[850px] bg-white text-black shadow-lg border-t border-gray-200 z-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading destinations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="left-0 w-full lg:w-[850px] bg-white text-black shadow-lg border-t border-gray-200 z-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-red-600">
            Failed to load destinations. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="left-0 w-full lg:w-[850px] bg-white text-black shadow-lg border-t border-gray-200 z-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-0 py-0">
        {/* Desktop Menu */}
        <div className="hidden lg:grid grid-cols-5 text-xs md:text-sm leading-6">
          <nav className="col-span-1 border-r border-gray-200" role="tablist">
            <ul className="space-y-1">
              {TABS.map((tab) => {
                const active = tab === activeTab;
                return (
                  <li key={tab}>
                    <button
                      onMouseEnter={() => setActiveTab(tab)}
                      onClick={() => setActiveTab(tab)}
                      className={`w-full text-left px-4 py-2 flex items-center justify-between text-xs cursor-pointer transition-all ${
                        active
                          ? "bg-gray-200 text-blue-900 font-semibold"
                          : "text-gray-600 hover:text-blue-900 hover:bg-gray-100"
                      }`}
                    >
                      <span>{tab}</span>
                      <span className="text-gray-400">›</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="col-span-4 p-4 bg-gray-100 max-h-[420px] overflow-y-auto">
            {WORLD_DATA[activeTab] && WORLD_DATA[activeTab].length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {WORLD_DATA[activeTab].map((group) => (
                  <div key={group.region}>
                    <h4 className="text-xs font-semibold text-gray-600 border-b border-gray-400 pb-2 mb-2">
                      {group.region}
                    </h4>
                    <ul className="flex flex-col gap-1 text-[11px] md:text-xs font-medium">
                      {group.cities.map((city) => (
                        <li key={city}>
                          <Link
                            href={`/tour-list?city=${encodeURIComponent(city)}`}
                            className="hover:text-red-600 hover:font-semibold transition"
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
                <p>No destinations available for this continent</p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Accordion */}
        <div className="block lg:hidden">
          <div className="divide-y divide-gray-200 overflow-hidden">
            {TABS.map((tab) => {
              const isOpen = openAccordion === tab;
              const hasData = WORLD_DATA[tab] && WORLD_DATA[tab].length > 0;

              return (
                <div key={tab} className="py-1">
                  <button
                    onClick={() => setOpenAccordion(isOpen ? null : tab)}
                    className="w-full flex justify-between items-center px-4 py-3 text-left text-sm font-medium text-gray-700 hover:text-blue-600 transition"
                    disabled={!hasData}
                  >
                    <span
                      className={`${isOpen ? "text-blue-700 font-semibold" : ""} ${!hasData ? "text-gray-400" : ""}`}
                    >
                      {tab}
                    </span>
                    {hasData && (
                      <span
                        className={`transform transition-transform duration-300 ${
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
                    <div className="mt-2 px-4 pb-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {WORLD_DATA[tab].map((group) => (
                        <div key={group.region}>
                          <h4 className="text-xs font-semibold text-gray-800">
                            {group.region}
                          </h4>
                          <div className="w-10 h-[1px] bg-gray-300 my-1" />
                          <ul className="flex flex-col gap-1 text-xs">
                            {group.cities.map((city) => (
                              <li key={city}>
                                <Link
                                  href={`/tour-list?city=${encodeURIComponent(
                                    city,
                                  )}`}
                                  className="hover:text-blue-900"
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
                    <div className="mt-2 px-4 pb-3 text-center text-gray-500 text-sm py-4">
                      No destinations available for this continent
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
