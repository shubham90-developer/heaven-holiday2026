"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useGetTourPackageQuery } from "store/toursManagement/toursPackagesApi";

const Filter = ({ onFilterChange, categoryName }) => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [activeRegion, setActiveRegion] = useState("");
  const [selectedSpecial, setSelectedSpecial] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: tourData, isLoading } = useGetTourPackageQuery();
  const packages = tourData?.data || [];

  const filterOptions = useMemo(() => {
    if (!packages.length) return {};

    // Extract unique departure cities
    const departureCities = [
      ...new Set(
        packages.flatMap((pkg) =>
          pkg.departures?.map((d) => d.city).filter(Boolean),
        ),
      ),
    ].sort();

    // Extract unique joining locations (from states cities)
    const joiningLocations = [
      ...new Set(
        packages.flatMap((pkg) =>
          pkg.states?.flatMap((s) => s.cities).filter(Boolean),
        ),
      ),
    ].sort();

    // Extract unique specialty tours (from badge or tourType)
    const specialtyTours = [
      ...new Set(
        packages.map((pkg) => pkg.badge || pkg.tourType).filter(Boolean),
      ),
    ].sort();

    // Generate price ranges based on actual prices
    const priceRanges = [
      "< ₹10,000 – ₹25,000",
      "₹25,000 – ₹50,000",
      "₹50,000 – ₹1,00,000",
      "₹1,00,000 & above",
    ];

    // Generate tour durations based on actual days
    const maxDays = Math.max(...packages.map((pkg) => pkg.days || 0));
    const durationRanges = [];
    if (maxDays > 0) {
      if (maxDays >= 4) durationRanges.push("0–4 Days");
      if (maxDays >= 8) durationRanges.push("5–8 Days");
      if (maxDays >= 12) durationRanges.push("9–12 Days");
      if (maxDays >= 17) durationRanges.push("13–17 Days");
      if (maxDays > 17) durationRanges.push("18+ Days");
    }

    // Extract regions from category
    const regions = [
      ...new Set(
        packages
          .map((pkg) =>
            pkg.category?.categoryType === "india" ? "India" : "World",
          )
          .filter(Boolean),
      ),
    ].sort();

    return {
      departureCities,
      joiningLocations,
      specialtyTours,
      priceRanges,
      durationRanges,
      regions,
    };
  }, [packages]);

  // FILTERING LOGIC
  const filteredPackages = useMemo(() => {
    // FIRST: Filter by category
    let filtered = categoryName
      ? packages.filter((pkg) => pkg.category?.name === categoryName)
      : packages;

    // SECOND: Apply user filters
    if (
      selectedFilters.length === 0 &&
      !activeRegion &&
      !selectedSpecial &&
      !startDate &&
      !endDate
    ) {
      return filtered;
    }

    return filtered.filter((pkg) => {
      // 1. Region filter
      if (activeRegion) {
        const pkgRegion =
          pkg.category?.categoryType === "india" ? "India" : "World";
        if (pkgRegion !== activeRegion) return false;
      }

      // 2. Price Range filter
      const priceFilters = selectedFilters.filter((f) => f.includes("₹"));
      if (priceFilters.length > 0) {
        const price = pkg.baseFullPackagePrice || 0;
        const matchesPrice = priceFilters.some((range) => {
          if (range.includes("< ₹10,000")) return price < 10000;
          if (range.includes("₹10,000 – ₹25,000"))
            return price >= 10000 && price <= 25000;
          if (range.includes("₹25,000 – ₹50,000"))
            return price >= 25000 && price <= 50000;
          if (range.includes("₹50,000 – ₹1,00,000"))
            return price >= 50000 && price <= 100000;
          if (range.includes("₹1,00,000 & above")) return price >= 100000;
          return false;
        });
        if (!matchesPrice) return false;
      }

      // 3. Duration filter
      const durationFilters = selectedFilters.filter((f) => f.includes("Days"));
      if (durationFilters.length > 0) {
        const days = pkg.days || 0;
        const matchesDuration = durationFilters.some((range) => {
          if (range === "0–4 Days") return days >= 0 && days <= 4;
          if (range === "5–8 Days") return days >= 5 && days <= 8;
          if (range === "9–12 Days") return days >= 9 && days <= 12;
          if (range === "13–17 Days") return days >= 13 && days <= 17;
          if (range === "18+ Days") return days >= 18;
          return false;
        });
        if (!matchesDuration) return false;
      }

      // 4. Departure City filter
      const cityFilters = selectedFilters.filter((f) =>
        filterOptions.departureCities?.includes(f),
      );
      if (cityFilters.length > 0) {
        const pkgCities = pkg.departures?.map((d) => d.city) || [];
        const matchesCity = cityFilters.some((city) =>
          pkgCities.includes(city),
        );
        if (!matchesCity) return false;
      }

      // 5. Cities filter
      const locationFilters = selectedFilters.filter((f) =>
        filterOptions.joiningLocations?.includes(f),
      );
      if (locationFilters.length > 0) {
        const pkgLocations = pkg.states?.flatMap((s) => s.cities) || [];
        const matchesLocation = locationFilters.some((loc) =>
          pkgLocations.includes(loc),
        );
        if (!matchesLocation) return false;
      }

      // 6. Specialty Tour filter
      if (selectedSpecial) {
        const pkgSpecialty = pkg.badge || pkg.tourType;
        if (pkgSpecialty !== selectedSpecial) return false;
      }

      // 7. Date Range filter
      if (startDate || endDate) {
        const hasDeparture = pkg.departures?.some((dep) => {
          const depDate = new Date(dep.date);
          const start = startDate ? new Date(startDate) : null;
          const end = endDate ? new Date(endDate) : null;

          if (start && end) {
            return depDate >= start && depDate <= end;
          } else if (start) {
            return depDate >= start;
          } else if (end) {
            return depDate <= end;
          }
          return true;
        });
        if (!hasDeparture) return false;
      }

      return true;
    });
  }, [
    packages,
    categoryName,
    selectedFilters,
    activeRegion,
    selectedSpecial,
    startDate,
    endDate,
    filterOptions,
  ]);

  // Notify parent component when filtered packages change
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(filteredPackages);
    }
  }, [filteredPackages, onFilterChange]);

  // Helpers
  const addFilter = (filter) => {
    if (!selectedFilters.includes(filter)) {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const removeFilter = (filter) => {
    setSelectedFilters(selectedFilters.filter((f) => f !== filter));
  };

  const clearAll = () => {
    setSelectedFilters([]);
    setActiveRegion("");
    setSelectedSpecial("");
    setStartDate("");
    setEndDate("");
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <p>Loading filters...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed bottom-4 left-4 z-50 bg-blue-900 text-white px-4 py-2 rounded-md shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        ☰ Filters
      </button>

      {/* Drawer for mobile & sidebar for desktop */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 bg-white shadow-lg border-r border-gray-200 z-40 
          transform transition-transform duration-300 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:h-auto md:shadow-none md:border md:rounded-md
        `}
      >
        {/* Close button for mobile */}
        <div className="md:hidden flex justify-between items-center bg-blue-900 text-white px-4 py-3">
          <h2 className="font-semibold">Filter Your Tour</h2>
          <button onClick={() => setIsOpen(false)} className="text-xl">
            ✖
          </button>
        </div>

        {/* Top selected filters bar */}
        <div className="bg-blue-900 text-white p-3 rounded-t-md hidden md:block">
          <p className="text-sm font-medium mb-2 flex justify-between">
            Filter Your Tour{" "}
            <button onClick={clearAll} className="text-xs underline">
              Clear All
            </button>
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedFilters.length > 0 ? (
              selectedFilters.map((filter) => (
                <span
                  key={filter}
                  className="flex items-center bg-blue-800 text-xs px-2 py-1 rounded-full cursor-pointer"
                  onClick={() => removeFilter(filter)}
                >
                  {filter} <span className="ml-1">✕</span>
                </span>
              ))
            ) : (
              <p className="text-xs italic text-gray-200">No filters applied</p>
            )}
          </div>
        </div>

        {/* Filters body */}
        <div className="p-4 space-y-5 text-sm overflow-y-auto h-full md:h-auto">
          {/* Region */}
          {filterOptions.regions?.length > 0 && (
            <div className="border-b border-gray-400 pb-5">
              <p className="font-semibold mb-2">Region</p>
              <div className="flex gap-3 flex-wrap">
                {filterOptions.regions.map((region) => (
                  <button
                    key={region}
                    className={`px-3 py-1 border rounded-md cursor-pointer ${
                      activeRegion === region
                        ? "bg-blue-900 text-white"
                        : "bg-white text-gray-800"
                    }`}
                    onClick={() => {
                      // Remove old region from filters
                      setSelectedFilters((prev) =>
                        prev.filter((f) => !filterOptions.regions?.includes(f)),
                      );
                      // Set new region
                      setActiveRegion(region);
                      addFilter(region);
                    }}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price Range */}
          {filterOptions.priceRanges?.length > 0 && (
            <div className="border-b border-gray-400 pb-5">
              <p className="font-semibold mb-2">Price Range</p>
              <div className="space-y-2">
                {filterOptions.priceRanges.map((range) => (
                  <label key={range} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        e.target.checked
                          ? addFilter(range)
                          : removeFilter(range)
                      }
                      checked={selectedFilters.includes(range)}
                    />{" "}
                    {range}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Tour Duration */}
          {filterOptions.durationRanges?.length > 0 && (
            <div className="border-b border-gray-400 pb-5">
              <p className="font-semibold mb-2">Tour Duration</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {filterOptions.durationRanges.map((duration) => (
                  <button
                    key={duration}
                    className={`px-2 py-1 border rounded-md ${
                      selectedFilters.includes(duration)
                        ? "bg-blue-800 text-white"
                        : "bg-white text-gray-700"
                    }`}
                    onClick={() =>
                      selectedFilters.includes(duration)
                        ? removeFilter(duration)
                        : addFilter(duration)
                    }
                  >
                    {duration}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Depart Between */}
          <div className="border-b border-gray-400 pb-5">
            <p className="font-semibold mb-2">Depart Between</p>
            <div className="flex gap-2">
              <input
                type="date"
                value={startDate}
                className="w-1/2 border rounded-md px-2 py-1"
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                value={endDate}
                className="w-1/2 border rounded-md px-2 py-1"
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Departure City */}
          {filterOptions.departureCities?.length > 0 && (
            <div className="border-b border-gray-400 pb-5">
              <p className="font-semibold mb-2">Departure City</p>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {filterOptions.departureCities.map((city) => (
                  <label key={city} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedFilters.includes(city)}
                      onChange={(e) =>
                        e.target.checked ? addFilter(city) : removeFilter(city)
                      }
                    />{" "}
                    {city}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Joining Location */}
          {filterOptions.joiningLocations?.length > 0 && (
            <div className="border-b border-gray-400 pb-5">
              <p className="font-semibold mb-2">Cities</p>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {filterOptions.joiningLocations.map((loc) => (
                  <label key={loc} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedFilters.includes(loc)}
                      onChange={(e) =>
                        e.target.checked ? addFilter(loc) : removeFilter(loc)
                      }
                    />{" "}
                    {loc}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Specialty Tour */}
          {filterOptions.specialtyTours?.length > 0 && (
            <div>
              <p className="font-semibold mb-2">Specialty Tour</p>
              <div className="space-y-1">
                {filterOptions.specialtyTours.map((type) => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="special"
                      checked={selectedSpecial === type}
                      onChange={() => {
                        setSelectedSpecial(type);
                        addFilter(type);
                      }}
                    />{" "}
                    {type}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default Filter;
