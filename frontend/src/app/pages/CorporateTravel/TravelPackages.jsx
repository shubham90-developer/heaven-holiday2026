"use client";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";
import { useGetCounterQuery } from "store/counterApi/counterApi";
import { useGetTourPackageQuery } from "store/toursManagement/toursPackagesApi";
const TravelPackages = () => {
  const { data, isLoading, error } = useGetCounterQuery();
  const {
    data: packages,
    isLoading: packageLoading,
    error: packageError,
  } = useGetTourPackageQuery();

  if (isLoading || packageLoading) {
    return <p>loading</p>;
  }
  if (error || packageError) {
    return <p>error</p>;
  }

  const indiaPackages = packages?.data?.filter((item) => {
    return item.category.categoryType == "india";
  });

  const internationalPackages = packages?.data?.filter((item) => {
    return item.category.categoryType == "world";
  });

  const renderCards = (packages) =>
    packages.map((pkg, i) => (
      <SwiperSlide key={i}>
        <div className="relative rounded-xl overflow-hidden group shadow-md cursor-pointer">
          <Image
            src={
              pkg.galleryImages?.length > 0
                ? pkg.galleryImages[0]
                : "/assets/img/tours/1.avif"
            }
            alt={pkg.title}
            width={300}
            height={200}
            className="object-cover w-full h-52 transition-transform duration-300 group-hover:scale-110"
          />

          {/* Gradient overlay at bottom */}
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

          {/* Normal bottom text */}
          <div className="absolute bottom-2 left-2 text-white transition-opacity duration-300 group-hover:opacity-0 z-10">
            <h4 className="font-semibold text-lg">{pkg.title}</h4>
            <p className="text-sm">{pkg.nights}</p>
            <p className="text-xs">
              Starts from{" "}
              <span className="font-bold">{pkg.baseJoiningPrice}</span>
            </p>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-80 opacity-0 group-hover:opacity-100 flex flex-col justify-center p-4 text-white transition-all duration-300 z-10">
            <h4 className="font-semibold text-lg mb-2">{pkg.name}</h4>
            <p className="text-sm mb-3">
              We at Veena World, handcraft our travel packages with most
              remarkable locations that lie in every corner of the world. All
              you...
            </p>
            <Link
              href={"/enquiry-now"}
              className="text-yellow-400 font-semibold flex items-center gap-1 hover:underline"
            >
              Enquire Now <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </SwiperSlide>
    ));

  return (
    <section className="bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-lg font-semibold text-gray-800">
            Incentive Corporate Tours for you and your team!
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-sm mt-2">
            After celebrating life with more than {data?.data?.guests || ""}{" "}
            happy tourists, the travel experts at Heaven Holiday have readymade
            Incentive Tour packages designed for you and your team.
          </p>
        </div>

        {/* Incredible India */}
        <div className="relative mb-10">
          <h3 className="font-bold text-lg mb-4">Incredible India</h3>
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: ".india-next",
              prevEl: ".india-prev",
            }}
            spaceBetween={20}
            slidesPerView={4}
            loop
            breakpoints={{
              320: { slidesPerView: 1.3 },
              640: { slidesPerView: 2.3 },
              1024: { slidesPerView: 4 },
            }}
          >
            {renderCards(indiaPackages)}
          </Swiper>
          <div className="absolute top-0 right-0 flex gap-2 -mt-8">
            <button className="india-prev p-2 bg-gray-200 rounded-full hover:bg-gray-300">
              <ChevronLeft size={18} />
            </button>
            <button className="india-next p-2 bg-gray-200 rounded-full hover:bg-gray-300">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Popular International Holiday Packages */}
        <div className="relative mb-10">
          <h3 className="font-bold text-lg mb-4">
            Popular International Holiday Packages
          </h3>
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: ".intl-next",
              prevEl: ".intl-prev",
            }}
            spaceBetween={20}
            slidesPerView={4}
            loop
            breakpoints={{
              320: { slidesPerView: 1.3 },
              640: { slidesPerView: 2.3 },
              1024: { slidesPerView: 4 },
            }}
          >
            {renderCards(internationalPackages)}
          </Swiper>
          <div className="absolute top-0 right-0 flex gap-2 -mt-8">
            <button className="intl-prev p-2 bg-gray-200 rounded-full hover:bg-gray-300">
              <ChevronLeft size={18} />
            </button>
            <button className="intl-next p-2 bg-gray-200 rounded-full hover:bg-gray-300">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <h3 className="font-semibold text-gray-800">
            Celebrate Life in Incredible India and around the world!
          </h3>
          <p className="text-gray-600 text-sm mt-2 mb-5">
            Drop your contact, and our team will quickly call you with holidays
            ideas!
          </p>
          <Link
            href={"/enquiry-now"}
            className="mt-4 bg-red-600 text-white  font-semibold px-6 py-2 rounded hover:bg-yellow-red"
          >
            Enquire Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TravelPackages;
