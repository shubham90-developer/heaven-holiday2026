"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import Image from "next/image";
import { useGetOfferBannerQuery } from "../../../../store/offer-banner/offer-bannerApi";

const OfferBanner = () => {
  const { data, isLoading, error } = useGetOfferBannerQuery();

  const response = data?.data;
  const banners = response?.[0]?.banners || [];
  const slides = banners.filter((item) => item.status === "active");

  return (
    <section className="w-full relative py-10 bg-gray-100 z-0">
      <div className="max-w-6xl mx-auto relative">
        {/* ✅ Skeleton Loader */}
        {isLoading ? (
          <div className="w-full h-55 md:h-70 rounded-lg overflow-hidden relative bg-gray-200">
            <div className="absolute inset-0 animate-pulse bg-linear-to-r from-gray-200 via-gray-300 to-gray-200"></div>
          </div>
        ) : error ? (
          <div className="w-full h-55 md:h-70 flex items-center justify-center text-red-600">
            Failed to load offers
          </div>
        ) : slides.length === 0 ? (
          <div className="w-full h-55 md:h-70 flex items-center justify-center text-gray-500">
            No offers available
          </div>
        ) : (
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
            className="rounded-lg overflow-hidden h-55 md:h-70"
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide._id}>
                <Link href={slide.link || "#"}>
                  <div className="relative w-full h-full cursor-pointer">
                    <Image
                      src={slide.image}
                      alt={`Offer ${slide._id}`}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {/* ✅ Hide arrows while loading */}
        {!isLoading && slides.length > 0 && (
          <>
            <button className="custom-prev absolute top-1/2 left-3 z-10 -translate-y-1/2 bg-white/70 text-black rounded-full p-2 shadow hover:bg-white transition cursor-pointer">
              ❮
            </button>
            <button className="custom-next absolute top-1/2 right-3 z-10 -translate-y-1/2 bg-white/70 text-black rounded-full p-2 shadow hover:bg-white transition cursor-pointer">
              ❯
            </button>
          </>
        )}

        <style jsx>{`
          :global(.swiper-pagination-bullet) {
            background-color: #ccc;
            opacity: 1;
          }
          :global(.swiper-pagination-bullet-active) {
            background-color: #f59e0b;
          }
        `}</style>
      </div>
    </section>
  );
};

export default OfferBanner;
