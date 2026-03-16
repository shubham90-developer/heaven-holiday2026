"use client";
import { useState } from "react";
import Image from "next/image";
import { CalendarDays, Plane, Hotel, MapPin } from "lucide-react";

const TourDetailsTabs = ({ tourData }) => {
  const [activeTab, setActiveTab] = useState("flights");

  // ✈️ Flight data from tourData
  const flights = tourData?.flights || [];

  // 🏨 Hotel Data from tourData
  const hotels = tourData?.accommodations || [];

  // 📍 Reporting / Dropping from tourData
  const reportingData = tourData?.reportingDropping || [];

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  };

  return (
    <section className="py-10 lg:px-0 px-4" id="details">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800">Tour details</h2>
        <p className="text-gray-500 italic mb-4">
          Best facilities with no added cost.
        </p>

        {/* Tabs */}
        <div className="flex rounded-t-lg overflow-hidden mb-6">
          {["flights", "accommodation", "reporting"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 bg-blue-50 mx-2 cursor-pointer rounded-2xl py-3 text-sm font-medium capitalize ${
                activeTab === tab
                  ? "bg-blue-800 text-white"
                  : "text-gray-700 hover:bg-blue-100"
              }`}
            >
              {tab === "flights" && "Flight Details"}
              {tab === "accommodation" && "Accommodation Details"}
              {tab === "reporting" && "Reporting & Dropping"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="border rounded-lg bg-white overflow-hidden">
          {activeTab === "flights" && (
            <div>
              {flights.length > 0 ? (
                flights.map((flight, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between gap-6 p-6 ${
                      i % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    {/* From */}
                    <div>
                      <p className="font-medium">{flight.fromCity}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(flight.departureDate)} |{" "}
                        {flight.departureTime}
                      </p>
                    </div>

                    {/* Airline + Duration */}
                    <div className="flex flex-col items-center">
                      <Plane className="w-5 h-5 text-blue-800 mb-1" />
                      {flight.airline && (
                        <div className="text-sm font-medium mb-1">
                          {flight.airline}
                        </div>
                      )}
                      {flight.duration && (
                        <span className="bg-gray-100 px-3 py-1 mt-2 rounded-full text-xs text-gray-700">
                          {flight.duration}
                        </span>
                      )}
                    </div>

                    {/* To */}
                    <div className="text-right">
                      <p className="font-medium">{flight.toCity}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(flight.arrivalDate)} | {flight.arrivalTime}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No flight information available for this tour.
                </div>
              )}
            </div>
          )}

          {activeTab === "accommodation" && (
            <div>
              {hotels.length > 0 ? (
                hotels.map((hotel, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between gap-6 p-6 ${
                      i % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <div>
                      <p className="font-medium">
                        {hotel.city}
                        {hotel.country && ` - ${hotel.country}`}
                      </p>
                      <p className="text-xs text-gray-500">{hotel.hotelName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-gray-600" />
                      <p className="text-sm">
                        {formatDate(hotel.checkInDate)} →{" "}
                        {formatDate(hotel.checkOutDate)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No accommodation information available for this tour.
                </div>
              )}
            </div>
          )}

          {activeTab === "reporting" && (
            <div>
              {reportingData.length > 0 ? (
                reportingData.map((r, i) => (
                  <div
                    key={i}
                    className={`flex flex-col md:flex-row justify-between gap-6 p-6 ${
                      i % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-800" />
                      <div>
                        <p className="font-semibold text-sm">Guest Type</p>
                        <p className="text-sm text-gray-700">{r.guestType}</p>
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold text-sm">Reporting Point</p>
                      <p className="text-sm text-gray-700">
                        {r.reportingPoint}
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-sm">Dropping Point</p>
                      <p className="text-sm text-gray-700">{r.droppingPoint}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No reporting and dropping information available for this tour.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="mt-4 text-xs text-gray-500">
          <p className="font-semibold mb-2 text-black">Note :</p>
          <p>• Flight details are tentative only. They may change.</p>
          <p>• Hotel details are tentative only. They may change.</p>
        </div>
      </div>
    </section>
  );
};

export default TourDetailsTabs;
