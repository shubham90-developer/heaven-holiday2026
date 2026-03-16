"use client";
import React from "react";
import { Star } from "lucide-react";
import CustomBtn from "@/app/components/CustomBtn";
import TourReviewModal from "./TourReviewModal";
import { useGetTourReviewQuery } from "../../../store/reviewsApi/reviewsApi";

const TourReview = () => {
  const { data, isLoading, error } = useGetTourReviewQuery();

  if (isLoading) {
    return (
      <section className="py-14 bg-[#0d1b29]">
        {/* Heading Skeleton */}
        <div className="max-w-6xl mx-auto text-center mb-10 space-y-3">
          <div className="h-8 w-64 mx-auto bg-gray-600 rounded animate-pulse"></div>
          <div className="h-4 w-80 mx-auto bg-gray-700 rounded animate-pulse"></div>
        </div>

        {/* Cards Skeleton */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 px-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-5 animate-pulse space-y-3"
            >
              {/* Rating */}
              <div className="h-4 w-16 bg-gray-300 rounded"></div>

              {/* Title */}
              <div className="h-5 w-40 bg-gray-300 rounded"></div>

              {/* Text Lines */}
              <div className="h-3 w-full bg-gray-200 rounded"></div>
              <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
              <div className="h-3 w-4/6 bg-gray-200 rounded"></div>

              {/* Author */}
              <div className="h-4 w-28 bg-gray-300 rounded mt-3"></div>
              <div className="h-3 w-32 bg-gray-200 rounded"></div>

              {/* Guides */}
              <div className="h-3 w-36 bg-gray-200 rounded mt-2"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-red-600">
            Failed to load team members. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  const responce = data?.data;
  const reviews = responce?.reviews || [];
  const filteredReviews = reviews.filter((item) => {
    return item.status == "active";
  });

  return (
    <section className="py-14 bg-[#0d1b29]">
      <div className="max-w-6xl mx-auto text-center text-white mb-10">
        <h2 className="text-3xl font-bold">{responce?.mainTitle || ""}</h2>
        <p className="text-lg mt-2">{responce?.mainSubtitle || ""}</p>
      </div>

      {/* Review Cards */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 px-4">
        {filteredReviews.slice(0, 6).map((review) => (
          <div
            key={review._id}
            className="bg-white rounded-lg shadow-md p-5 relative"
          >
            {/* Rating + Tag */}
            <div className="flex items-center gap-2 mb-2">
              {review.rating && (
                <div className="flex items-center text-yellow-500">
                  <Star className="w-4 h-4 fill-yellow-500" />
                  <span className="ml-1 font-bold">{review.rating || ""}</span>
                </div>
              )}
              <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded">
                {review.tag || ""}
              </span>
            </div>
            {/* Title */}
            <h3 className="text-lg font-semibold">{review.title || ""}</h3>
            {/* Description */}
            <p
              className="text-gray-600 text-sm mt-2"
              dangerouslySetInnerHTML={{ __html: review.text || "" }}
            />
            {/* Author */}
            <div className="mt-4">
              <p className="font-semibold">{review.author || ""}</p>
              <p className="text-xs text-gray-500">
                Travelled in {review.updatedAt || ""}
              </p>
            </div>
            {/* Guides */}
            <div className="mt-3 text-blue-600 text-sm">
              {review.guides.join(", ")}
            </div>
            Optional image
            {/* {review.img && (
              <img
                src={review.img}
                alt={review.title}
                className="absolute top-5 right-5 w-20 h-20 object-cover rounded-md"
              />
            )} */}
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="text-center mt-10">
        <TourReviewModal />
      </div>
    </section>
  );
};

export default TourReview;
