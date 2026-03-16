"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Phone } from "lucide-react";
import Link from "next/link";
import { useCreateEnquiryMutation } from "store/enquiryApi/enquiryApi";
import { useGetContactDetailsQuery } from "store/aboutUsApi/contactApi";
import { useGetOfferBannerQuery } from "store/offer-banner/offer-bannerApi";

const DiscoverWorldSlide = () => {
  const {
    data: contactDetails,
    isLoading: contactDetailsLoading,
    error: contactDetailsError,
  } = useGetContactDetailsQuery();
  const {
    data: banner,
    isLoading: bannerLoading,
    error: bannerError,
  } = useGetOfferBannerQuery();

  const activeBanners = banner?.data[0].banners.filter((item) => {
    return item.status === "active";
  });
  if (contactDetailsLoading || bannerLoading) {
    return (
      <section className="py-12 sm:py-16 bg-gray-100 animate-pulse">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left Image Skeleton */}
          <div className="w-full">
            <div className="w-full h-60 sm:h-80 md:h-105 bg-gray-300 rounded-xl"></div>
          </div>

          {/* Right Content Skeleton */}
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-gray-300 rounded"></div>
            <div className="h-4 w-full bg-gray-300 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
            <div className="h-4 w-2/3 bg-gray-300 rounded"></div>

            <div className="flex gap-4 mt-6">
              <div className="h-10 w-32 bg-gray-300 rounded"></div>
              <div className="h-10 w-40 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (contactDetailsError || bannerError) {
    return <p>error</p>;
  }

  return (
    <section className="py-12 sm:py-16 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left Slider */}
        <div className="relative w-full">
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            speed={800}
            className="rounded-lg"
          >
            {activeBanners.map((slide) => (
              <SwiperSlide key={slide._id}>
                <div className="relative rounded-xl overflow-hidden px-4">
                  <img
                    src={slide.image}
                    alt={`Discover ${slide._id}`}
                    className="w-full h-60 sm:h-80 md:h-105 object-cover rounded-xl"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Nav Buttons */}
          <button className="custom-prev cursor-pointer absolute top-1/2 -left-3 sm:-left-6 -translate-y-1/2 bg-white border p-2 sm:p-3 rounded-full shadow hover:bg-gray-100 text-xs sm:text-base">
            ❮
          </button>
          <button className="custom-next cursor-pointer absolute top-1/2 -right-3 sm:-right-6 -translate-y-1/2 bg-white border p-2 sm:p-3 rounded-full shadow hover:bg-gray-100 text-xs sm:text-base">
            ❯
          </button>
        </div>

        {/* Right Content */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-snug">
            Discover the World,{" "}
            <span className="text-gray-800">specially curated for you!</span>
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
            Our exclusive customized holidays division can cater to every travel
            need: hotel, air tickets, VISA, sightseeing, transfer or the entire
            package, all designed keeping in mind your interests!
          </p>

          <p className="text-black font-semibold mb-4 text-sm sm:text-base">
            Tell us what you want and we will design it for you.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <Link
              href="/enquiry-now"
              className="bg-red-700 hover:bg-red-500 text-white font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded shadow text-sm sm:text-base"
            >
              Enquire Now
            </Link>
            <span className="text-gray-600 text-sm sm:text-base">or</span>
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm sm:text-base">
              <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
              <Link
                href={`tel:${contactDetails?.data?.callUs?.phoneNumbers[0] || ""}`}
              >
                {contactDetails?.data?.callUs?.phoneNumbers[0] || ""} /{" "}
                {contactDetails?.data?.callUs?.phoneNumbers[1] || ""}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscoverWorldSlide;
