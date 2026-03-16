"use client";
import React, { useState, useMemo } from "react";
import SignInModal from "@/app/components/SignInModal";
// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="relative p-6 bg-white w-96 rounded-lg shadow-xl">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

const DepartureSelector = ({
  departures = [],
  onDateSelect,
  packageType = "Joining Package",
}) => {
  const [activeTab, setActiveTab] = useState("All departures");
  const [selectedDateDepartures, setSelectedDateDepartures] = useState(null); // Stores all departures for clicked date
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  // Get unique cities from departures
  const uniqueCities = useMemo(() => {
    if (!departures || departures.length === 0) return [];
    const cities = [...new Set(departures.map((d) => d.city))];
    return cities;
  }, [departures]);

  // Format date for display
  const formatDateInfo = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString();
    const weekday = date
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase();
    const month = date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    return { day, weekday, month };
  };

  // Check if date is in the past
  const isPastDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Get price based on package type
  const getPrice = (departure) => {
    return packageType === "Full Package"
      ? departure.fullPackagePrice
      : departure.joiningPrice;
  };

  // Get status with better seat availability logic
  const getStatusInfo = (departure) => {
    const availableSeats = departure.availableSeats;
    const price = getPrice(departure);

    // Check if sold out
    if (availableSeats === 0) {
      return {
        status: "gray",
        label: "Sold Out",
        disabled: true,
      };
    }

    // Check if past date
    if (isPastDate(departure.date)) {
      return {
        status: "gray",
        label: "Expired",
        disabled: true,
      };
    }

    // Filling fast (1-5 seats)
    if (availableSeats <= 5) {
      return {
        status: "red",
        label: `${availableSeats} seats left`,
        disabled: false,
      };
    }

    // Few seats (6-10 seats)
    if (availableSeats <= 10) {
      return {
        status: "orange",
        label: "Few seats left",
        disabled: false,
      };
    }

    // Check if lowest price (only for available dates)
    const allPrices = departures
      .filter((d) => !isPastDate(d.date) && d.availableSeats > 0)
      .map((d) => getPrice(d));

    if (price === Math.min(...allPrices)) {
      return {
        status: "green",
        label: "Lowest Price",
        disabled: false,
      };
    }

    // Default available
    return {
      status: "white",
      label: "",
      disabled: false,
    };
  };

  // Group departures by date first (to show each date only once)
  const departuresByDate = useMemo(() => {
    if (!departures || departures.length === 0) return {};

    const grouped = {};

    departures.forEach((departure) => {
      // Create a unique key for the date (YYYY-MM-DD format)
      const dateKey = new Date(departure.date).toISOString().split("T")[0];

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }

      grouped[dateKey].push(departure);
    });

    return grouped;
  }, [departures]);

  // Group departures by month for display (showing each date only once)
  const groupedDepartures = useMemo(() => {
    if (!departures || departures.length === 0) return [];

    const grouped = {};

    // Filter departures based on active tab
    const filteredDeps =
      activeTab === "All departures"
        ? departures
        : departures.filter((d) => d.city === activeTab);

    // Group by date first to show each date once
    const dateGroups = {};
    filteredDeps.forEach((departure) => {
      const dateKey = new Date(departure.date).toISOString().split("T")[0];
      if (!dateGroups[dateKey]) {
        dateGroups[dateKey] = [];
      }
      dateGroups[dateKey].push(departure);
    });

    // Now organize by month for display
    Object.entries(dateGroups).forEach(([dateKey, depsForDate]) => {
      // Use the first departure for this date to get display info
      const firstDep = depsForDate[0];
      const { month } = formatDateInfo(firstDep.date);

      if (!grouped[month]) {
        grouped[month] = [];
      }

      const { day, weekday } = formatDateInfo(firstDep.date);

      // Get the best price across all cities for this date
      const prices = depsForDate.map((d) => getPrice(d));
      const lowestPrice = Math.min(...prices);

      // Get combined status info (most urgent status wins)
      let combinedStatus = getStatusInfo(depsForDate[0]);
      depsForDate.forEach((dep) => {
        const status = getStatusInfo(dep);
        if (status.status === "red" && combinedStatus.status !== "gray") {
          combinedStatus = status;
        } else if (
          status.status === "orange" &&
          !["red", "gray"].includes(combinedStatus.status)
        ) {
          combinedStatus = status;
        }
      });

      // Get all cities for this date
      const citiesForDate = depsForDate.map((d) => d.city);

      grouped[month].push({
        day,
        weekday,
        price: `₹${lowestPrice?.toLocaleString("en-IN")}`,
        label: combinedStatus.label,
        status: combinedStatus.status,
        disabled: combinedStatus.disabled,
        cities: citiesForDate,
        originalDate: firstDep.date,
        allDepartures: depsForDate, // All departures for this date
      });
    });

    return Object.entries(grouped).map(([month, dates]) => ({
      name: month,
      dates,
    }));
  }, [departures, packageType, activeTab]);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    setSelectedCity("");
  };

  const handleDateClick = (dateInfo) => {
    // Prevent click on disabled dates
    if (dateInfo.disabled) {
      return;
    }
    const token = localStorage.getItem("authToken");
    if (!token) {
      setIsSignInOpen(true);
      return;
    }

    // If city tab is active (not "All departures"), select directly
    if (activeTab !== "All departures") {
      const departure = dateInfo.allDepartures.find(
        (d) => d.city === activeTab,
      );
      if (departure && onDateSelect) {
        onDateSelect(departure);
      }
      return;
    }

    // If only one city available for this date, select directly
    if (dateInfo.cities.length === 1) {
      if (onDateSelect && dateInfo.allDepartures[0]) {
        onDateSelect(dateInfo.allDepartures[0]);
      }
      return;
    }

    // Multiple cities - open modal
    setSelectedDateDepartures(dateInfo.allDepartures);
    setSelectedCity(""); // Reset selected city
    setIsModalOpen(true);
  };

  const handleProceed = () => {
    if (selectedCity && selectedDateDepartures) {
      const selectedDeparture = selectedDateDepartures.find(
        (d) => d.city === selectedCity,
      );

      if (onDateSelect && selectedDeparture) {
        onDateSelect(selectedDeparture);
      }

      setIsModalOpen(false);
      setSelectedCity("");
      setSelectedDateDepartures(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCity("");
    setSelectedDateDepartures(null);
  };

  // Get unique cities from selected date departures for modal
  const modalCities = useMemo(() => {
    if (!selectedDateDepartures) return [];
    return [...new Set(selectedDateDepartures.map((d) => d.city))];
  }, [selectedDateDepartures]);

  // If no departures data, show fallback
  if (!departures || departures.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md w-full md:col-span-2">
        <h2 className="font-semibold text-lg mb-2 border-b pb-2">
          1. SELECT DEPARTURE CITY & DATE
        </h2>
        <p className="text-gray-500 text-center py-8">
          No departure dates available at the moment.
        </p>
      </div>
    );
  }

  return (
    <>
      <div>
        <div
          id="departure-section"
          className="bg-white p-4 rounded-lg shadow-md w-full md:col-span-2 flex flex-col"
        >
          <h2 className="font-semibold text-lg mb-2 border-b pb-2">
            1. SELECT DEPARTURE CITY & DATE
          </h2>
          {/* Tabs */}
          <div className="flex gap-3 my-4">
            <button
              onClick={() => handleTabClick("All departures")}
              className={`px-4 py-2 rounded-full border cursor-pointer text-xs ${
                activeTab === "All departures"
                  ? "bg-blue-900 text-white cursor-pointer border-blue-600"
                  : "border-gray-300 bg-white text-gray-700"
              }`}
            >
              All departures
            </button>
            {uniqueCities.map((city) => (
              <button
                key={city}
                onClick={() => handleTabClick(city)}
                className={`px-4 py-2 rounded-full border cursor-pointer text-xs ${
                  activeTab === city
                    ? "bg-blue-900 text-white cursor-pointer border-blue-600"
                    : "border-gray-300 bg-white text-gray-700"
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Header */}
          <div className="flex justify-between items-center mb-4 text-sm">
            <div>
              <p className="font-semibold">{activeTab} dates</p>
              <p className="text-green-600">
                All inclusive tours, lock in at this great price today.
              </p>
            </div>
          </div>

          {/* Month + Date Cards */}
          <div className="flex flex-wrap gap-4">
            {groupedDepartures.map((month, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="bg-gray-700 text-white text-[10px] w-10 text-center px-2 py-6 rounded-md">
                  {month.name}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {month.dates.map((date, j) => (
                    <div
                      key={j}
                      onClick={() => handleDateClick(date)}
                      className={`w-24 text-center rounded-lg p-2 border transition ${
                        date.disabled
                          ? "cursor-not-allowed opacity-50 bg-gray-100"
                          : "cursor-pointer hover:border-blue-400"
                      } ${"border-gray-300"} ${
                        date.status === "green"
                          ? "bg-green-100"
                          : date.status === "red"
                            ? "bg-red-50"
                            : date.status === "orange"
                              ? "bg-orange-50"
                              : date.status === "purple"
                                ? "bg-purple-50"
                                : "bg-white"
                      }`}
                    >
                      <div className="text-[10px] text-gray-800 border-b py-1">
                        {date.weekday}
                      </div>
                      <div className="text-sm font-bold">{date.day}</div>
                      <div className="text-xs font-medium">{date.price}</div>
                      {date.label && (
                        <div
                          className={`text-[10px] mt-1 font-semibold ${
                            date.status === "red"
                              ? "text-red-500"
                              : date.status === "orange"
                                ? "text-orange-500"
                                : date.status === "green"
                                  ? "text-green-600"
                                  : date.status === "purple"
                                    ? "text-purple-600"
                                    : "text-gray-500"
                          }`}
                        >
                          {date.label}
                        </div>
                      )}
                      {/* Show cities count if multiple cities and "All departures" tab */}
                      {activeTab === "All departures" &&
                        date.cities.length > 1 && (
                          <div className="text-[9px] text-blue-600 mt-1 font-medium">
                            {date.cities.length} cities
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* footer text */}
          <div className="text-xs text-gray-500 mt-auto">
            <ul className="flex gap-4 list-none p-0">
              <li>Terms and Conditions apply.</li>
              <li>5% GST is applicable on given tour price.</li>
              <li>
                Mentioned tour prices are Per Person for Indian Nationals only.
              </li>
            </ul>
          </div>
        </div>

        {/* Modal - Only shows cities available for the clicked date */}
        <Modal isOpen={isModalOpen} onClose={handleModalClose}>
          <h3 className="text-lg font-semibold mb-4 text-center">
            Select your preferred departure city
          </h3>

          <div className="space-y-3 mb-4">
            {modalCities.map((city) => (
              <label
                key={city}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="city"
                  value={city}
                  checked={selectedCity === city}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="h-4 w-4"
                />
                <span>{city}</span>
              </label>
            ))}
          </div>

          <div className="bg-blue-50 text-gray-700 text-sm p-2 rounded mb-4">
            Except for joining/leaving, To & fro economy class air is included
            for all departure city.
          </div>

          <button
            onClick={handleProceed}
            disabled={!selectedCity}
            className={`w-full py-2 rounded-md font-medium ${
              selectedCity
                ? "bg-yellow-300 hover:bg-red-700 hover:text-white"
                : "bg-yellow-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Proceed
          </button>
        </Modal>
        <SignInModal
          isOpen={isSignInOpen}
          onClose={() => setIsSignInOpen(false)}
        />
      </div>
    </>
  );
};

export default DepartureSelector;
