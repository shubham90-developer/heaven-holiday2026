"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Car, Plane, Ship, Compass, Gift, Users } from "lucide-react";
import { useMemo } from "react";
import { useGetTourPackageQuery } from "store/toursManagement/toursPackagesApi";

export default function CustomizedHolidays() {
  const { data, isLoading, error } = useGetTourPackageQuery();

  // Randomly select 2 tour packages
  const randomTours = useMemo(() => {
    if (!data?.data || data.data.length === 0) return [];

    const allTours = [...data.data];

    // If less than 3 packages, show all available
    if (allTours.length < 3) {
      return allTours;
    }

    // If 3 or more, shuffle and show 2
    for (let i = allTours.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allTours[i], allTours[j]] = [allTours[j], allTours[i]];
    }

    return allTours.slice(0, 2);
  }, [data]);

  return (
    <div className="left-0 top-full w-full lg:w-162.5 bg-white shadow-lg border-t border-gray-200 z-50 overflow-hidden">
      <div className="flex flex-col md:flex-row p-4 md:p-6 gap-6 md:gap-8">
        {/* LEFT SIDE */}
        <div className="w-full md:w-1/2 space-y-5 text-sm">
          <Link
            href="#"
            className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left font-semibold text-blue-800 mb-2 sm:mb-3 transition"
          >
            <div className="flex gap-2 items-center justify-center sm:justify-start">
              <Image
                src="/customized-header-icon.webp"
                alt="Holiday Illustration"
                width={40}
                height={40}
                className="object-contain"
              />
              <p className="text-xs md:text-base leading-snug">
                THEMED EXPERIENCES – Find your reason!
              </p>
            </div>
          </Link>

          <ul className="space-y-10 sm:space-y-4 flex flex-col gap-3">
            <Link href="/tour-list">
              <li className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-600 shrink-0" />
                <span className="text-gray-700 text-sm">Family Fun</span>
              </li>
            </Link>
            <Link href="/tour-list">
              <li className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-gray-600 shrink-0" />
                <span className="text-gray-700 text-sm">Romantic Holidays</span>
              </li>
            </Link>
            <Link href="/tour-list">
              <li className="flex items-center gap-3">
                <Compass className="w-5 h-5 text-gray-600 shrink-0" />
                <span className="text-gray-700 text-sm">Getaways</span>
              </li>
            </Link>

            <Link href="/tour-list">
              <li className="flex items-center gap-3 flex-wrap">
                <Gift className="w-5 h-5 text-gray-600 shrink-0" />
                <span className="text-gray-700 text-sm flex items-center flex-wrap gap-1">
                  Hidden Gems
                  <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded">
                    Newly Launched
                  </span>
                </span>
              </li>
            </Link>
            <Link href="/tour-list">
              <li className="flex items-center gap-3">
                <Car className="w-5 h-5 text-gray-600 shrink-0" />
                <span className="text-gray-700 text-sm">
                  Self Drive Holidays
                </span>
              </li>
            </Link>
            <Link href="/tour-list">
              <li className="flex items-center gap-3">
                <Plane className="w-5 h-5 text-gray-600 shrink-0" />
                <span className="text-gray-700 text-sm">
                  Air Inclusive Holidays
                </span>
              </li>
            </Link>
            <Link href="/tour-list">
              <li className="flex items-center gap-3">
                <Ship className="w-5 h-5 text-gray-600 shrink-0" />
                <span className="text-gray-700 text-sm">Cruise Holidays</span>
              </li>
            </Link>
          </ul>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 grid grid-cols-1 gap-5">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600 text-xs">Loading tours...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 text-xs">Failed to load tours</p>
            </div>
          ) : randomTours.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-xs">No tours available</p>
            </div>
          ) : (
            randomTours.map((tour) => {
              const imageUrl =
                tour.galleryImages?.[0] || "/placeholder-tour.jpg";
              return (
                <Link
                  key={tour._id}
                  href={`/tour-details/${tour._id}`}
                  className="flex flex-col items-start hover:shadow-md rounded-lg p-2 sm:p-3 transition border border-gray-100 hover:border-gray-200"
                >
                  <Image
                    src={imageUrl}
                    alt={tour.title}
                    width={200}
                    height={120}
                    className="rounded-md object-cover w-full h-32 sm:h-36"
                  />
                  <div className="mt-3">
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base line-clamp-1">
                      {tour.title} →
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm mt-1 line-clamp-2">
                      {tour.subtitle ||
                        tour.metaDescription
                          ?.replace(/<[^>]*>/g, "")
                          .substring(0, 60) + "..."}
                    </p>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
