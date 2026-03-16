"use client";
import React from "react";
import { useGetTourPackageQuery } from "store/toursManagement/toursPackagesApi";
import Link from "next/link";

const TourCard = ({ tour }) => {
  return (
    <Link href={tour.link || "#"}>
      <div className="border border-gray-100 rounded-md overflow-hidden shadow hover:shadow-lg transition bg-white cursor-pointer">
        {/* Image */}
        <div className="relative">
          <img
            src={tour.image || ""}
            alt={tour.title || ""}
            className="w-full h-48 object-cover"
          />
          {/* Badge */}
          {tour.badge && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded uppercase">
              {tour.badge || " "}
            </div>
          )}
          <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-black/70 to-transparent p-3">
            <p className="text-xs text-white uppercase">
              {tour.category || ""} Tour
            </p>
            <h3 className="text-lg font-semibold text-white">
              {tour.title || ""}
            </h3>
          </div>
        </div>

        {/* Details */}
        <div className="p-4">
          <div className="flex gap-6 text-sm text-gray-600 mt-2">
            <p>
              <span className="font-medium">{tour.tours || ""}</span> Tours
            </p>
            <p>
              <span className="font-medium">{tour.departures || ""}</span>{" "}
              Departures
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            <span className="font-medium">{tour.guests || ""}</span> Happy
            Guests
          </p>
          <button className="mt-3 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
            👁 Quick View
          </button>
        </div>
      </div>
    </Link>
  );
};

const ToursGrid = () => {
  const { data, isLoading, error } = useGetTourPackageQuery();
  console.log("tabcards", data);
  if (isLoading) {
    return (
      <section className="py-10 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-12 text-center">
          <p className="text-gray-600">Loading tours...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-10 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-12 text-center">
          <p className="text-red-600">
            Failed to load tours. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  // Extract cards from API data
  const cards = data?.data?.cards || [];
  const activeCards = cards.filter((card) => card.isActive === true);

  return (
    <section className="py-10 bg-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold mb-8">
          Select Your Favourite Tour
        </h2>
        {activeCards.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeCards.map((tour) => (
              <TourCard key={tour._id} tour={tour} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No tours available at the moment.
          </p>
        )}
      </div>
    </section>
  );
};

export default ToursGrid;
