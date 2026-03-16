"use client";
import React from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import Breadcrumb from "@/app/components/Breadcum";
import { useGetCounterQuery } from "store/counterApi/counterApi";
import { useGetTourReviewQuery } from "store/reviewsApi/reviewsApi";
import { useState, useMemo } from "react";
const ReviewsAndTestimonial = ({ searchQuery, setSearchQuery }) => {
  const { data, isLoading, error } = useGetCounterQuery();
  const responce = data?.data;
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Reviews And Testimonials", href: null },
  ];
  const { data: reviewsData } = useGetTourReviewQuery();

  const allReviews =
    reviewsData?.data?.reviews?.filter((r) => r.status === "active") || [];

  const filteredReviews = useMemo(() => {
    if (!searchQuery.trim()) return allReviews;
    const q = searchQuery.toLowerCase();
    return allReviews.filter(
      (review) =>
        review.title?.toLowerCase().includes(q) ||
        review.tag?.toLowerCase().includes(q) ||
        review.author?.toLowerCase().includes(q) ||
        review.text?.toLowerCase().includes(q),
    );
  }, [searchQuery, allReviews]);

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <section className="bg-[#294992] text-white relative">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Content */}
          <div className="flex-1">
            {/* Heading */}
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              Heaven Holiday Reviews & Testimonials
            </h1>
            {/* Stats */}
            <p className="text-lg md:text-xl mb-6">
              <span className="font-bold">{responce?.guests}</span>{" "}
              <span className="text-gray-200">happy travellers</span>{" "}
              <span className="font-bold">{responce?.toursCompleted}</span>{" "}
              <span className="text-gray-200">tours</span>
            </p>
            Search Box
            <div className="bg-white rounded-full flex items-center overflow-hidden shadow w-full max-w-lg">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reviews for a tour or destination"
                className="flex-1 px-4 py-3 text-gray-700 text-sm focus:outline-none"
              />
              <button className="bg-gray-100 px-4 py-3 text-gray-600 hover:text-blue-600">
                <Search size={18} />
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 flex justify-center md:justify-end">
            <div className="w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden">
              <Image
                src="/assets/img/testimonials/1.svg"
                alt="Happy Family"
                width={400}
                height={400}
                className="w-full h-62.5 object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ReviewsAndTestimonial;
