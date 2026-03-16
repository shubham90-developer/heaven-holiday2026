"use client";
import Breadcrumb from "@/app/components/Breadcum";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useGetAllBooksQuery } from "store/booksApi/booksApi";

const TravelPlanners = () => {
  const { data, isLoading, error } = useGetAllBooksQuery();

  // SKELETON LOADER
  if (isLoading) {
    return (
      <>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Travel Planners", href: "/travel-planners" },
          ]}
        />

        <section className="py-10 px-4 bg-gray-100">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center shadow-lg rounded-xl overflow-hidden bg-white animate-pulse"
              >
                <div className="w-full h-60 bg-gray-200"></div>
                <div className="p-4 w-full">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-600 py-10">Failed to load books</p>
    );
  }

  const books = data?.data || [];

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Travel Planners", href: "/travel-planners" },
        ]}
      />

      <section className="container mx-auto py-10 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <Link
                href={`/travel-planner-details/${book._id}`}
                key={book._id}
                className="group flex flex-col items-center text-center bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
              >
                {/* Image Container */}
                <div className="w-48 h-64 relative overflow-hidden">
                  <Image
                    src={book.coverImg}
                    alt={book.title}
                    fill
                    className="object-fill group-hover:scale-105 transition duration-300"
                    sizes="192px"
                  />
                </div>

                {/* Title */}
                <div className="p-4 w-full">
                  <h3 className="text-black font-semibold text-sm line-clamp-2">
                    {book.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default TravelPlanners;
