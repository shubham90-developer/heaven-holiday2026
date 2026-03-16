"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { FaStar } from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import { useGetTourReviewQuery } from "store/reviewsApi/reviewsApi";
const Testimonials = () => {
  // Refs for custom navigation
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const { data, isLoading, error } = useGetTourReviewQuery();
  if (isLoading) {
    return <p>loading</p>;
  }
  if (error) {
    return <p>error</p>;
  }
  const Activereviews =
    data?.data?.reviews.filter((item) => {
      return item.status === "active";
    }) || [];

  return (
    <div className="absolute top-4 right-4 bg-white shadow-lg rounded-lg max-w-xs">
      <div className="flex justify-between border-b border-gray-300 px-2">
        <div className="flex items-center text-xs text-black mb-2 gap-x-2">
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-600" />
            <span className="font-bold">5</span>
          </div>
          <p>{Activereviews.length || ""} Guests already travelled</p>
        </div>

        {/* Custom Arrows */}
        <div className="flex justify-end gap-2 p-2">
          <button
            ref={prevRef}
            className="w-5 h-5 cursor-pointer flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 shadow"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button
            ref={nextRef}
            className="w-5 h-5 cursor-pointer flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 shadow"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={10}
        slidesPerView={1}
        autoplay={{ delay: 3000 }}
        loop={true}
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
        }}
      >
        {Activereviews.map((review, index) => (
          <SwiperSlide key={index}>
            <div className="p-4">
              <p
                className="text-sm text-gray-600"
                dangerouslySetInnerHTML={{ __html: review.text }}
              />

              <p className="mt-2 text-xs text-black">
                — {review.author},{" "}
                {new Date(review.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Testimonials;
