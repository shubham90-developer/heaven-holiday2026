"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import Image from "next/image";
import { useGetCelebrateQuery } from "../../../../store/travelDealApi/offer-bannerApi";

const Celebrate = () => {
  const { data, isLoading, error } = useGetCelebrateQuery();

  if (isLoading) {
    return (
      <section className="w-full relative py-10 bg-gray-100">
        <div className="max-w-6xl mx-auto relative px-4 animate-pulse">
          {/* Heading skeleton */}
          <div className="h-8 bg-gray-300 rounded w-64 mb-2" />
          {/* Slider skeleton */}
          <div className="w-full h-55 md:h-87.5 bg-gray-300 rounded-lg" />
          {/* Dots skeleton */}
          <div className="flex justify-center gap-2 mt-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-gray-300 rounded-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full relative py-10 bg-gray-100">
        <div className="max-w-6xl mx-auto relative px-4 text-center">
          <p className="text-gray-500 text-sm">
            Content unavailable at the moment.
          </p>
        </div>
      </section>
    );
  }

  const celebrateData = data?.data;
  const slides = celebrateData?.slides || [];
  const activeSlides = slides.filter((slide) => slide.status === "active");

  return (
    <section className="w-full relative py-10 bg-gray-100">
      <div className="max-w-6xl mx-auto relative px-4">
        <div
          className="text-gray-500 text-3xl font-medium mb-2"
          dangerouslySetInnerHTML={{ __html: celebrateData?.heading || "" }}
        />
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop
          slidesPerView={1}
          className="rounded-lg overflow-hidden"
        >
          {activeSlides.map((slide) => (
            <SwiperSlide key={slide._id}>
              <Link href={slide.link || "#"}>
                <div className="relative w-full h-55 md:h-87.5 cursor-pointer">
                  <Image
                    src={slide.image}
                    alt={`Offer ${slide._id}`}
                    fill
                    className="object-fill"
                    priority
                  />
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Arrows */}
        <button className="custom-prev absolute top-1/2 left-3 z-10 -translate-y-1/2 bg-white/70 text-black rounded-full p-2 shadow hover:bg-white transition cursor-pointer">
          ❮
        </button>
        <button className="custom-next absolute top-1/2 right-3 z-10 -translate-y-1/2 bg-white/70 text-black rounded-full p-2 shadow hover:bg-white transition cursor-pointer">
          ❯
        </button>

        {/* Custom styles for dots */}
        <style jsx>{`
          :global(.swiper-pagination-bullet) {
            background-color: #ccc;
            opacity: 1;
          }
          :global(.swiper-pagination-bullet-active) {
            background-color: #f59e0b; /* yellow-500 */
          }
        `}</style>
      </div>
    </section>
  );
};

export default Celebrate;
