"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "@/app/components/Breadcum";
import Filter from "./Filter";
import TourCardList from "./TourCardList";
import TopBar from "./TopBar";
import { useParams } from "next/navigation";
import { useGetCategoriesQuery } from "store/toursManagement/toursPackagesApi";

const TourList = () => {
  const { id: categoryId } = useParams();
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [sortedPackages, setSortedPackages] = useState([]);

  const { data: categories, isLoading, error } = useGetCategoriesQuery();

  const category = categories?.data?.find((item) => item._id === categoryId);

  useEffect(() => {
    setSortedPackages(filteredPackages);
  }, [filteredPackages]);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Tours", href: "/tours" },
    { label: "Search Holiday Package", href: null },
  ];

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />

      <section className="py-6 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          {/* 🔹 SKELETON */}
          {isLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-pulse">
              {/* Left Filter Skeleton */}
              <div className="lg:col-span-1 space-y-4">
                <div className="h-10 bg-gray-300 rounded"></div>
                <div className="h-40 bg-gray-300 rounded"></div>
                <div className="h-40 bg-gray-300 rounded"></div>
              </div>

              {/* Right Cards Skeleton */}
              <div className="lg:col-span-3 space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex gap-4"
                  >
                    <div className="w-40 h-32 bg-gray-300 rounded"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                      <div className="h-8 bg-gray-300 rounded w-32"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 🔹 ERROR */}
          {error && (
            <p className="text-center text-red-500">Failed to load tours.</p>
          )}

          {/* 🔹 ACTUAL CONTENT */}
          {!isLoading && !error && (
            <>
              <TopBar
                total={sortedPackages.length}
                packages={filteredPackages}
                onSort={setSortedPackages}
              />

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                  <Filter
                    onFilterChange={setFilteredPackages}
                    categoryName={category?.name}
                  />
                </div>

                <div className="lg:col-span-3">
                  <TourCardList filteredPackages={sortedPackages} />
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default TourList;
