"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import Image from "next/image";
import { useGetTourPackageQuery } from "store/toursManagement/toursPackagesApi";

const BookingBanner = () => {
  const { data, isLoading, error } = useGetTourPackageQuery();

  if (isLoading) {
    return (
      <section className="w-full relative py-10 bg-gray-100">
        <div className="max-w-6xl mx-auto relative px-2">
          <div className="relative w-full h-75 sm:h-125 md:h-95 lg:h-112.5 rounded-lg overflow-hidden bg-gray-300 animate-pulse">
            {/* Left Content Skeleton */}
            <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 md:px-12 max-w-lg space-y-3">
              <div className="h-3 w-32 bg-gray-200 rounded"></div>
              <div className="h-6 w-48 bg-gray-200 rounded"></div>
              <div className="h-3 w-40 bg-gray-200 rounded"></div>

              <div className="h-4 w-52 bg-gray-200 rounded"></div>
              <div className="h-4 w-60 bg-gray-200 rounded"></div>

              <div className="h-3 w-full bg-gray-200 rounded"></div>

              <div className="h-8 w-32 bg-gray-200 rounded mt-2"></div>

              <div className="h-3 w-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return <p>error</p>;
  }

  // Map API data to slides format
  const slides =
    data?.data
      ?.filter((pkg) => pkg.status === "Active")
      ?.map((pkg) => {
        // Get first departure date
        const firstDeparture = pkg.departures?.[0];
        const startDate = firstDeparture?.date
          ? new Date(firstDeparture.date)
          : null;
        const formattedDate = startDate
          ? startDate.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            })
          : "";

        // Format cities/states string
        const statesString =
          pkg.states?.map((state) => state.name).join(" • ") || "";

        return {
          id: pkg._id,
          image:
            pkg.galleryImages?.[0] ||
            pkg.category?.image ||
            "/assets/img/tour-card/1.avif",
          link: `/tour-details/${pkg._id}`,
          title: pkg.category?.name || "Tour Package",
          subtitle: pkg.title || "Special Tour",
          details: statesString || pkg.route || "",
          days: `${pkg.days} Day${pkg.days > 1 ? "s" : ""}${formattedDate ? ` | ${formattedDate}` : ""}`,
          price: `₹${parseInt(pkg.baseFullPackagePrice || 0).toLocaleString("en-IN")}`,
          joinPrice: `₹${parseInt(pkg.baseJoiningPrice || 0).toLocaleString("en-IN")}`,
          badge: pkg.badge,
        };
      }) || [];

  // Fallback to static slides if no data
  if (!slides || slides.length === 0) {
    return (
      <section className="py-5">
        <div className="max-w-6xl mx-auto relative px-2">
          <p className="text-center">
            No tour packages available at the moment.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full relative py-10 bg-gray-100 z-0">
      <div className="max-w-6xl mx-auto relative px-2">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={slides.length > 1}
          slidesPerView={1}
          className="rounded-lg overflow-hidden"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative w-full h-75 sm:h-125 md:h-95 lg:h-112.5 cursor-pointer">
                {/* Background Image */}
                <Image
                  src={slide.image}
                  alt={`Offer ${slide.id}`}
                  fill
                  className="object-cover"
                  priority
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent"></div>

                {/* Left Side Content */}
                <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 md:px-12 text-white max-w-lg">
                  <p className="text-xs sm:text-sm md:text-base">
                    {slide.title}
                  </p>
                  <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-yellow-400">
                    {slide.subtitle}
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm md:text-base">
                    {slide.details}
                  </p>
                  <p className="mt-3 text-sm sm:text-base font-semibold">
                    {slide.days} | from{" "}
                    <span className="text-yellow-400">{slide.price}</span>
                  </p>
                  <p className="text-sm sm:text-base font-semibold">
                    Joining Leaving price from{" "}
                    <span className="text-yellow-400 font-bold">
                      {slide.joinPrice}
                    </span>
                  </p>
                  <p className="mt-2 text-[10px] sm:text-xs md:text-sm leading-snug">
                    Book your own flight tickets and join the tour directly at
                    the first destination and leave from the last destination.
                  </p>

                  {/* CTA Button */}
                  <Link
                    href={slide.link}
                    className="mt-4 w-full sm:w-40 text-center bg-red-700 text-white font-medium px-5 py-2 rounded shadow hover:bg-yellow-500 transition block"
                  >
                    Book now
                  </Link>

                  <span className="text-[10px] sm:text-xs mt-1 opacity-70">
                    *T&C Apply
                  </span>
                </div>
              </div>
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

export default BookingBanner;
