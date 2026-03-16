"use client";
import React, { useState, useEffect } from "react";
import { List, LayoutGrid, ArrowUpDown, Check } from "lucide-react";

const TopBar = ({ total = 0, packages = [], onSort }) => {
  const [sort, setSort] = useState("deals");
  const [open, setOpen] = useState(false);

  const sortOptions = [
    "deals",
    "price low to high",
    "price high to low",
    "duration",
    "popularity",
  ];

  // Sort logic
  const handleSort = (option) => {
    setSort(option);
    setOpen(false);

    if (!packages.length || !onSort) return;

    let sorted = [...packages];

    switch (option) {
      case "price low to high":
        sorted.sort(
          (a, b) =>
            (a.baseFullPackagePrice || a.baseJoiningPrice || 0) -
            (b.baseFullPackagePrice || b.baseJoiningPrice || 0),
        );
        break;

      case "price high to low":
        sorted.sort(
          (a, b) =>
            (b.baseFullPackagePrice || b.baseJoiningPrice || 0) -
            (a.baseFullPackagePrice || a.baseJoiningPrice || 0),
        );
        break;

      case "duration":
        sorted.sort((a, b) => (a.days || 0) - (b.days || 0));
        break;

      case "popularity":
        sorted.sort((a, b) => {
          const seatsA =
            a.departures?.reduce((sum, d) => sum + (d.totalSeats || 0), 0) || 0;
          const seatsB =
            b.departures?.reduce((sum, d) => sum + (d.totalSeats || 0), 0) || 0;
          return seatsB - seatsA;
        });
        break;

      case "deals":
      default:
        // Reset to original order (as they come from filter)
        sorted = [...packages]; // ← This keeps the filtered order
    }

    onSort(sorted);
  };

  // Apply initial sort when packages change
  useEffect(() => {
    if (packages.length > 0 && onSort) {
      handleSort(sort);
    }
  }, [packages]);

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gray-100 mb-5 gap-3 p-3 rounded-md relative">
      {/* Left text */}
      <p className="text-sm text-gray-700 text-center md:text-left">
        Showing {total} package{total !== 1 ? "s" : ""}
      </p>

      {/* Right controls */}
      <div className="flex flex-row items-center justify-between gap-3 w-full md:w-auto relative">
        {/* Sort dropdown */}
        <div className="relative flex-1">
          <div
            className="flex items-center border rounded-md px-3 py-2 bg-white cursor-pointer min-w-[150px] justify-between"
            onClick={() => setOpen(!open)}
          >
            <div className="flex items-center">
              <ArrowUpDown className="h-4 w-4 mr-2 text-gray-600" />
              <span className="text-sm">
                Sort:{" "}
                <strong className="font-semibold capitalize">{sort}</strong>
              </span>
            </div>
            <span className="ml-2">{open ? "▴" : "▾"}</span>
          </div>

          {open && (
            <div className="absolute right-0 mt-1 w-full sm:w-56 bg-white border rounded-md shadow-lg z-50">
              {sortOptions.map((option) => (
                <div
                  key={option}
                  onClick={() => handleSort(option)}
                  className={`flex items-center px-4 py-2 text-sm capitalize cursor-pointer hover:bg-gray-100 ${
                    sort === option
                      ? "font-semibold text-blue-600"
                      : "text-gray-700"
                  }`}
                >
                  {option}
                  {sort === option && <Check className="ml-auto h-4 w-4" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
