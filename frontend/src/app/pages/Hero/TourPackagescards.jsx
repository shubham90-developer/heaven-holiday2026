"use client";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";
import { useGetTourPackageQuery } from "../../../../store/toursManagement/toursPackagesApi";
import { useGetContactDetailsQuery } from "store/aboutUsApi/contactApi";
const TourPackagesCards = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading, error } = useGetTourPackageQuery();
  const {
    data: contact,
    isLoading: contactLoading,
    error: contactError,
  } = useGetContactDetailsQuery();

  if (isLoading || contactLoading) {
    return (
      <section className="w-full relative py-10 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          {/* Heading Skeleton */}
          <div className="space-y-2 mb-6">
            <div className="h-5 w-80 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-3 w-96 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 w-60 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Slider Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow border border-gray-300 overflow-hidden animate-pulse"
              >
                {/* Image Skeleton */}
                <div className="w-full h-20 bg-gray-300 p-2 rounded-2xl"></div>

                {/* Content Skeleton */}
                <div className="p-4 pt-0 space-y-2">
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                  <div className="h-4 w-28 bg-gray-300 rounded"></div>
                  <div className="h-3 w-32 bg-gray-200 rounded"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || contactError) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-red-600">
            Failed to load tour packages. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  const packages = data?.data || [];
  const activePackages = packages.filter((pkg) => pkg.status === "Active");

  return (
    <section className="w-full relative py-10 bg-gray-50 z-0">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <h5 className="text-md md:text-2xl font-semibold">
          Heaven Holiday offers All Inclusive tour packages
        </h5>
        <p className="text-gray-600 text-sm font-bold">
          No matter where you are in India or around the World, choose from a
          wide range of tours, conveniently departing from your city.
        </p>
        <p className="text-gray-600 mb-2 mt-4 italic text-xs">
          Explore tour packages from
        </p>

        {/* Slider Wrapper with relative for positioning */}
        <div className="relative">
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              375: { slidesPerView: 2 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 6 },
            }}
            className="pb-10"
          >
            {activePackages.map((pkg) => {
              // Calculate random departure BEFORE return
              const departures = pkg.departures || [];
              const randomIndex =
                departures.length > 0
                  ? Math.floor(Math.random() * departures.length)
                  : 0;
              const randomDeparture = departures[randomIndex];

              return (
                <SwiperSlide key={pkg._id}>
                  <div className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden border border-gray-300">
                    <Link href={`/tour-details/${pkg._id}`}>
                      <div className="relative">
                        <Image
                          src={
                            pkg.galleryImages?.[0] ||
                            pkg.category?.image ||
                            "/assets/img/tour-card/1.avif"
                          }
                          alt={pkg.title}
                          width={500}
                          height={500}
                          className="w-full h-20 object-cover p-2 rounded-2xl"
                        />
                        {pkg.badge && (
                          <span className="absolute bottom-2 left-2 bg-orange-500 text-white text-[10px] px-2 py-1 rounded">
                            {pkg.badge}
                          </span>
                        )}
                      </div>
                      <div className="p-4 pt-0">
                        <p className="text-xs text-gray-600">
                          Tour Packages From
                        </p>
                        <h3 className="font-bold text-blue-900 text-sm">
                          {randomDeparture?.city.slice(0, 15) ||
                            pkg.states?.[0]?.name ||
                            "Destination"}
                        </h3>
                        <p className="text-xs mt-1 text-gray-700">
                          <strong className="text-black">
                            {pkg.days} Days
                          </strong>{" "}
                          |{" "}
                          <strong>
                            {pkg.metadata?.totalDepartures ||
                              pkg.departures?.length ||
                              0}
                          </strong>{" "}
                          departures
                        </p>
                        <p className="text-xs mt-1 font-bold text-gray-500">
                          Starts from{" "}
                          <span className="text-black">
                            ₹
                            {parseInt(
                              pkg.baseFullPackagePrice || 0,
                            ).toLocaleString("en-IN")}
                          </span>
                        </p>
                      </div>
                    </Link>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Custom Nav Buttons */}
          <button className="custom-prev absolute top-1/2 -left-3 z-10 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow hover:bg-gray-300 cursor-pointer">
            ❮
          </button>
          <button className="custom-next absolute top-1/2 -right-3 z-10 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow hover:bg-gray-300 cursor-pointer">
            ❯
          </button>
        </div>

        {/* Footer Section with Modal Trigger */}
        <div className="mt-5">
          <p className="text-sm font-semibold text-black">
            Can't find tours from your city?
          </p>
          <p className="text-xs font-semibold text-gray-600">
            Check our Joining & Leaving option. Book your own flights and join
            directly at the first destination of the tour.{" "}
            <button
              onClick={() => setIsOpen(true)}
              className="text-blue-600 underline hover:text-blue-800 cursor-pointer"
            >
              Know More
            </button>
          </p>
        </div>

        {/* Modal */}
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2  hover:text-black bg-gray-300 p-2 rounded-full cursor-pointer "
              >
                ✕
              </button>

              {/* Modal Content */}
              <h2 className="text-xl font-semibold text-red-600">
                Joining/Leaving (J/L)
              </h2>
              <p className="mt-2 text-sm text-gray-700">
                Join the group directly at first destination of the tour. <br />
                Leave the group directly at the last destination of the tour.
              </p>

              <h3 className="mt-4 font-semibold text-gray-800">
                Joining/Leaving tour Inclusions are
              </h3>
              <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
                <li>Tour Manager Services throughout the tour</li>
                <li>Travel by comfortable A/C coach</li>
                <li>Entrance fees of sightseeing places</li>
                <li>Accommodation in convenient hotels</li>
                <li>All Meals – Breakfast, Lunch, Dinner</li>
                <li>All Tips – Guide, Driver & Restaurants</li>
                <li>Cost of internal airfare (if any)</li>
              </ul>

              <p className="mt-4 text-sm">
                Email at{" "}
                <a
                  href={`mailto:${contact?.data?.writeToUs?.emails[0]}` || ""}
                  className="text-blue-600"
                >
                  {contact?.data?.writeToUs?.emails[0] || ""}
                </a>{" "}
                or Call us{" "}
                <a
                  href={`tel:${contact?.data?.callUs?.phoneNumbers[0]}`}
                  className="text-blue-600"
                >
                  {contact?.data?.callUs?.phoneNumbers[0] || ""}
                </a>{" "}
                |{" "}
                <a
                  href={`tel:${contact?.data?.callUs?.phoneNumbers[1]}`}
                  className="text-blue-600"
                >
                  {contact?.data?.callUs?.phoneNumbers[1] || ""}
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TourPackagesCards;
