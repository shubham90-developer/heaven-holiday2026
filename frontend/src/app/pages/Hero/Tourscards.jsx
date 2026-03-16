"use client";

import CustomBtn from "@/app/components/CustomBtn";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useGetCategoriesQuery } from "store/toursManagement/toursPackagesApi";

const Tourscards = () => {
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetCategoriesQuery();

  const categoriesCard = categories?.data || [];
  const activeCategories = categoriesCard.filter(
    (item) => item.status === "Active",
  );

  return (
    <section className="py-5 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        {/* ✅ Skeleton Loader */}
        {categoriesLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
            {[...Array(7)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
              >
                {/* Image Skeleton */}
                <div className="w-full h-30 bg-gray-300"></div>

                {/* Text Skeleton */}
                <div className="p-2 space-y-2">
                  <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : categoriesError ? (
          <p className="text-center text-red-600">Something went wrong</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
              {activeCategories.slice(0, 7).map((tour) => (
                <Link
                  href={`tour-list/${tour._id}`}
                  target="_blank"
                  key={tour._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <div>
                    <div className="relative">
                      <Image
                        src={tour.image}
                        alt={tour.title}
                        width={600}
                        height={600}
                        className="w-full h-30 object-cover"
                      />

                      <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black opacity-70"></div>

                      <span className="absolute bottom-7 left-3 bg-white text-black text-[10px] font-bold px-2 py-1 rounded">
                        {tour.badge.slice(0, 10)}...
                      </span>

                      <span className="absolute bottom-1 left-1 font-bold text-white text-[10px] px-2 py-1  rounded">
                        {tour.categoryType.slice(0, 8)} |{" "}
                        {tour.guests.slice(0, 1)} Travelled
                      </span>
                    </div>

                    <div className="p-2">
                      <h3 className="text-gray-800 text-xs font-semibold">
                        {tour.title.slice(0, 15)}...
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Button */}
            <div className="flex justify-center mt-6">
              <CustomBtn href="/tour-list">More Tours</CustomBtn>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Tourscards;
