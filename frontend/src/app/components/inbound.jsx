"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useGetTourPackageQuery } from "store/toursManagement/toursPackagesApi";

export default function Inbound() {
  const { data, isLoading, error } = useGetTourPackageQuery();

  // Filter and split India packages into sections
  const { leftSection, middleSection, rightSection } = useMemo(() => {
    if (!data?.data)
      return { leftSection: [], middleSection: [], rightSection: [] };

    // Filter only India category tours
    const indiaTours = data.data.filter(
      (tour) => tour.category?.categoryType === "india",
    );

    // Shuffle India tours using Fisher-Yates algorithm
    const shuffled = [...indiaTours];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Take random 12 packages maximum, then distribute across sections
    const random12 = shuffled.slice(0, 12);

    return {
      leftSection: random12.slice(0, 4), // First 4 for left
      middleSection: random12.slice(4, 8), // Next 4 for middle
      rightSection: random12.slice(8, 12), // Next 4 for right
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className="w-full lg:w-[800] bg-white text-gray-800 px-8 py-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading India tours...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full lg:w-[800] bg-white text-gray-800 px-8 py-6">
        <div className="text-center py-12">
          <p className="text-red-600">Failed to load tours</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-[800] bg-white text-gray-800 px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left Section */}
      <div className="bg-blue-50 p-4">
        <h2 className="text-md font-semibold mb-4">
          India: A Timeless Experience
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {leftSection.length > 0 ? (
            leftSection.map((tour) => {
              const imageUrl =
                tour.galleryImages?.[0] || "/placeholder-tour.jpg";
              return (
                <Link
                  href={`/tour-details/${tour._id}`}
                  key={tour._id}
                  className="flex flex-col"
                >
                  <Image
                    src={imageUrl}
                    alt={tour.title}
                    width={200}
                    height={120}
                    className="rounded-md object-cover w-full h-28"
                  />
                  <h6 className="mt-2 text-sm font-semibold line-clamp-1">
                    {tour.title}
                  </h6>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {tour.subtitle || tour.route}
                  </p>
                </Link>
              );
            })
          ) : (
            <p className="col-span-2 text-center text-gray-500 text-sm py-8">
              No tours available
            </p>
          )}
        </div>
      </div>

      {/* MIDDLE SECTION */}
      <div>
        <h2 className="text-md font-semibold mb-4">
          Explore Niche Experiences
        </h2>
        <div className="flex flex-col space-y-4">
          {middleSection.length > 0 ? (
            middleSection.map((tour) => {
              const imageUrl =
                tour.galleryImages?.[0] || "/placeholder-tour.jpg";
              return (
                <Link
                  href={`/tour-details/${tour._id}`}
                  key={tour._id}
                  className="flex items-center space-x-4 p-2 rounded-md hover:bg-gray-50 transition"
                >
                  <Image
                    src={imageUrl}
                    alt={tour.title}
                    width={50}
                    height={50}
                    className="rounded-full object-cover w-12 h-12"
                  />
                  <div>
                    <h3 className="text-sm font-semibold line-clamp-1">
                      {tour.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {tour.subtitle || tour.route}
                    </p>
                  </div>
                </Link>
              );
            })
          ) : (
            <p className="text-center text-gray-500 text-sm py-8">
              No tours available
            </p>
          )}
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex flex-col space-y-4">
        {rightSection.length > 0 ? (
          rightSection.map((tour) => {
            const imageUrl = tour.galleryImages?.[0] || "/placeholder-tour.jpg";
            return (
              <Link
                href={`/tour-details/${tour._id}`}
                key={tour._id}
                className="flex items-center space-x-4 p-2 rounded-md hover:bg-gray-50 transition"
              >
                <Image
                  src={imageUrl}
                  alt={tour.title}
                  width={50}
                  height={50}
                  className="rounded-full object-cover w-12 h-12"
                />
                <div>
                  <h3 className="text-sm font-semibold line-clamp-1">
                    {tour.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {tour.subtitle || tour.route}
                  </p>
                </div>
              </Link>
            );
          })
        ) : (
          <p className="text-center text-gray-500 text-sm py-8">
            No tours available
          </p>
        )}
      </div>
    </div>
  );
}
