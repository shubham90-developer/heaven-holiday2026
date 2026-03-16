"use client";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import {
  useGetCategoriesQuery,
  useGetTourPackageQuery,
} from "store/toursManagement/toursPackagesApi";
import { useGetAllBookingsQuery } from "store/bookingApi/bookingApi";

const HolidayDestinations = () => {
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetCategoriesQuery();

  const {
    data: tourPackages,
    isLoading: tourPackagesLoading,
    error: tourPackagesError,
  } = useGetTourPackageQuery();

  const {
    data: bookings,
    isLoading: bookingsLoading,
    error: bookingsError,
  } = useGetAllBookingsQuery();

  // Get active categories
  const activeCategories = useMemo(() => {
    if (!categories?.data) return [];
    return categories.data.filter((cat) => cat.status === "Active");
  }, [categories]);

  // Get active tour packages
  const activeTourPackages = useMemo(() => {
    if (!tourPackages?.data) return [];
    return tourPackages.data.filter((pkg) => pkg.status === "Active");
  }, [tourPackages]);

  // Count packages per category
  const packageCountByCategory = useMemo(() => {
    const counts = {};
    activeTourPackages.forEach((pkg) => {
      const categoryId = pkg.category?._id;
      if (categoryId) {
        counts[categoryId] = (counts[categoryId] || 0) + 1;
      }
    });
    return counts;
  }, [activeTourPackages]);

  // Count departures per category
  const departureCountByCategory = useMemo(() => {
    const counts = {};
    activeTourPackages.forEach((pkg) => {
      const categoryId = pkg.category?._id;
      if (categoryId) {
        const departures = pkg.metadata?.totalDepartures || 0;
        counts[categoryId] = (counts[categoryId] || 0) + departures;
      }
    });
    return counts;
  }, [activeTourPackages]);

  // Count bookings per category
  const bookingCountByCategory = useMemo(() => {
    if (!bookings?.data?.bookings) return {};
    const counts = {};
    bookings.data.bookings.forEach((booking) => {
      const categoryId = booking.tourPackage?.category?._id;
      if (categoryId) {
        counts[categoryId] = (counts[categoryId] || 0) + 1;
      }
    });
    return counts;
  }, [bookings]);

  if (categoriesLoading || tourPackagesLoading || bookingsLoading) {
    return (
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-5 overflow-x-auto no-scrollbar animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="relative min-w-[240px] h-[320px] rounded-xl overflow-hidden shadow-lg bg-gray-200 flex-shrink-0"
              >
                {/* Title skeleton */}
                <div className="absolute top-4 left-4 h-5 bg-gray-300 rounded w-28" />

                {/* Stats box skeleton */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 rounded-md shadow p-3 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categoriesError || tourPackagesError) {
    return (
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            Content unavailable at the moment.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Scrollable Cards */}
        <div className="flex gap-5 overflow-x-auto no-scrollbar">
          {activeCategories.length > 0 ? (
            activeCategories.map((category) => {
              const packageCount = packageCountByCategory[category._id] || 0;
              const departureCount =
                departureCountByCategory[category._id] || 0;
              const guestsCount = bookingCountByCategory[category._id] || 0;

              return (
                <Link
                  key={category._id}
                  href={`/tour-list/${category._id}`}
                  className="relative min-w-[240px] h-[320px] rounded-xl overflow-hidden shadow-lg group"
                >
                  {/* Background Image */}
                  <Image
                    src={category.image || "/assets/img/contact/h1.avif"}
                    alt={category.name}
                    width={300}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                  {/* Title */}
                  <h3 className="absolute top-4 left-4 text-white text-lg font-bold drop-shadow-md">
                    {category.name}
                  </h3>

                  {/* Stats Box */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 rounded-md shadow p-3 text-xs text-gray-800 font-medium">
                    <p>
                      <span className="font-bold">{packageCount}</span> tours |{" "}
                      <span className="font-bold">{departureCount}</span>{" "}
                      departures
                    </p>
                    <p>
                      <span className="font-bold">{guestsCount}</span> guests
                      travelled
                    </p>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="text-center text-gray-500 w-full">
              No categories available
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HolidayDestinations;
