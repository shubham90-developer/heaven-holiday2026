"use client";
import React, { useState, useMemo, useEffect } from "react";
import { FaCcVisa, FaStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Bus,
  Camera,
  Cookie,
  Heart,
  PlaneTakeoff,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  useGetCategoriesQuery,
  useGetTourPackageQuery,
} from "store/toursManagement/toursPackagesApi";
import { useGetProfileQuery } from "store/authApi/authApi";
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "store/authApi/authApi";
import { useGetTourReviewQuery } from "store/reviewsApi/reviewsApi";
import { auth } from "@/app/config/firebase";

const DekhoApnaDesh = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("");

  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery();
  const { data: tourPackageData, isLoading: packageLoading } =
    useGetTourPackageQuery();
  const [addToWishlist] = useAddToWishlistMutation();
  const {
    data: wishlist,
    isLoading: wishlistLoading,
    error: wishlistError,
  } = useGetProfileQuery();
  const [wishlistItems, setWishlistItems] = React.useState(new Set());
  const {
    data: reviews,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useGetTourReviewQuery();
  const Activereviews =
    reviews?.data?.reviews.filter((item) => {
      return item.status === "active";
    }) || [];

  // Load wishlist from user data
  React.useEffect(() => {
    if (wishlist?.data?.user?.wishlist) {
      const ids = new Set(
        wishlist.data.user.wishlist.map((id) => id.toString()),
      );
      setWishlistItems(ids);
    }
  }, [wishlist]);

  // Extract active "india" categories
  const indiaCategories = useMemo(() => {
    if (!categoriesData?.data) return [];
    return categoriesData.data.filter(
      (category) =>
        category.status === "Active" && category.categoryType === "india",
    );
  }, [categoriesData]);

  // Extract active tour packages
  const activeTourPackages = useMemo(() => {
    if (!tourPackageData?.data) return [];
    return tourPackageData.data.filter((pkg) => pkg.status === "Active");
  }, [tourPackageData]);

  // Group packages by category
  const packagesByCategory = useMemo(() => {
    const grouped = {};

    activeTourPackages.forEach((pkg) => {
      const categoryId = pkg.category?._id;
      if (categoryId) {
        if (!grouped[categoryId]) {
          grouped[categoryId] = [];
        }
        grouped[categoryId].push(pkg);
      }
    });

    return grouped;
  }, [activeTourPackages]);

  // Set initial active tab when categories load
  React.useEffect(() => {
    if (indiaCategories.length > 0 && !activeTab) {
      setActiveTab(indiaCategories[0]._id);
    }
  }, [indiaCategories, activeTab]);

  // Get packages for active category
  const activePackages = useMemo(() => {
    return packagesByCategory[activeTab] || [];
  }, [packagesByCategory, activeTab]);

  // Format price
  const formatPrice = (price) => {
    return `₹${price.toLocaleString()}`;
  };

  // Get states text
  const getStatesText = (states) => {
    if (!states || states.length === 0) return "";
    const stateCount = states.length;
    const cityCount = states.reduce(
      (acc, state) => acc + (state.cities?.length || 0),
      0,
    );
    return `${stateCount} State${stateCount > 1 ? "s" : ""} ${cityCount} Cities`;
  };

  // Handle toggle wishlist
  const handleToggleWishlist = async (packageId, e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("authToken");

    if (!token && !auth.currentUser) {
      alert("Please login first");
      router.push("/login");
      return;
    }

    const isInWishlist = wishlistItems.has(packageId);

    // Optimistic update
    if (isInWishlist) {
      setWishlistItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(packageId);
        return newSet;
      });
    } else {
      setWishlistItems((prev) => new Set(prev).add(packageId));
    }

    try {
      if (isInWishlist) {
        await removeFromWishlist({ packageId }).unwrap();
      } else {
        await addToWishlist({ packageId }).unwrap();
      }
    } catch (error) {
      // rollback
      if (isInWishlist) {
        setWishlistItems((prev) => new Set(prev).add(packageId));
      } else {
        setWishlistItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(packageId);
          return newSet;
        });
      }

      alert(error?.data?.message || "Failed to update wishlist");
    }
  };

  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlist");

    if (storedWishlist) {
      setWishlistItems(new Set(JSON.parse(storedWishlist)));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(Array.from(wishlistItems)));
  }, [wishlistItems]);

  if (categoriesLoading || packageLoading) {
    return (
      <section className="py-12 bg-white z-0">
        <div className="max-w-6xl mx-auto px-6 animate-pulse">
          {/* Heading Skeleton */}
          <div className="text-center mb-8 space-y-3">
            <div className="h-6 w-64 bg-gray-300 rounded mx-auto"></div>
            <div className="h-3 w-40 bg-gray-200 rounded mx-auto"></div>
          </div>

          {/* Tabs Skeleton */}
          <div className="flex justify-center gap-3 mb-10 flex-wrap">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 w-24 bg-gray-200 rounded-md"></div>
            ))}
          </div>

          {/* Card Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg p-4 space-y-4"
              >
                {/* Image */}
                <div className="h-40 bg-gray-200 rounded-md"></div>

                {/* Title */}
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>

                {/* Rating */}
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>

                {/* Info Row */}
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-14"></div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <div className="flex-1 h-8 bg-gray-200 rounded"></div>
                  <div className="flex-1 h-8 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (indiaCategories.length === 0) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-gray-500">No Categories Available.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white relative z-0">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <h2 className="text-2xl md:text-2xl text-center font-bold mb-3">
          Dekho Apana , <span className="text-gray-800">Desh</span>
        </h2>

        {/* Underline Image */}
        <div className="flex justify-center mb-8">
          <img
            src="/assets/img/header-bottom.svg"
            alt="underline"
            className="w-40 md:w-50"
          />
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          {indiaCategories.map((category) => (
            <button
              key={category._id}
              onClick={() => setActiveTab(category._id)}
              className={`px-4 py-1 text-sm rounded-md border cursor-pointer ${
                activeTab === category._id
                  ? "bg-blue-900 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Slider Wrapper */}
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
              375: { slidesPerView: 1 },
              640: { slidesPerView: 1 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-10"
          >
            {activePackages.length > 0 ? (
              activePackages.map((tour) => {
                const isInWishlist = wishlistItems.has(tour._id);

                return (
                  <SwiperSlide key={tour._id}>
                    <div className="border border-gray-300 rounded-lg shadow-sm bg-white overflow-hidden">
                      <div className="flex">
                        {/* Left Image with Wishlist */}
                        <div className="relative w-1/2">
                          <Image
                            src={
                              tour.galleryImages?.[0] ||
                              "/assets/img/tour-card/1.avif"
                            }
                            alt={tour.title}
                            width={1000}
                            height={600}
                            className="w-full h-full object-cover rounded-2xl p-2"
                          />
                          {/* Wishlist Heart Icon */}
                          <div className="absolute top-3 right-3 group">
                            <button
                              className={`p-2 rounded-full shadow ${
                                isInWishlist
                                  ? "bg-red-500 hover:bg-red-600"
                                  : "bg-gray-400 hover:bg-gray-500"
                              } relative cursor-pointer`}
                              onClick={(e) => handleToggleWishlist(tour._id, e)}
                            >
                              <Heart
                                className={`w-3 h-3 text-white ${
                                  isInWishlist ? "fill-white" : ""
                                }`}
                              />
                            </button>

                            {/* Tooltip */}
                            <div className="absolute top-full right-1/2 translate-x-1/2 mt-1 hidden group-hover:flex items-center justify-center bg-black text-white text-xs rounded px-2 py-1 shadow z-10 whitespace-nowrap">
                              {isInWishlist
                                ? "Remove from Wishlist"
                                : "Add to Wishlist"}
                            </div>
                          </div>

                          {/* Badge/Tag */}
                          {tour.badge && (
                            <span className="absolute bottom-2 left-2 bg-orange-500 text-white text-[10px] px-2 py-1 rounded">
                              {tour.badge.length > 16
                                ? `${tour.badge.slice(0, 16)}...`
                                : tour.badge}
                            </span>
                          )}
                        </div>

                        {/* Right Content */}
                        <div className="w-2/2 p-2">
                          {tour.category?.badge && (
                            <p className="bg-orange-500 text-white border border-red-500 inline-block py-0.6 px-2 text-[10px] rounded-2xl">
                              {tour.tourType}
                            </p>
                          )}
                          <h3 className="font-bold text-lg">
                            {tour.title.length > 20
                              ? `${tour.title.slice(0, 20)}...`
                              : tour.title}
                          </h3>
                          <div className="flex items-center text-yellow-500 text-sm my-2">
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <span className="ml-2 text-gray-600">
                              {Activereviews.length || 0} Reviews
                            </span>
                          </div>

                          {/* All Inclusive + Tooltip */}
                          {tour.tourIncludes &&
                            tour.tourIncludes.length > 0 && (
                              <div className="relative group inline-block mb-2">
                                <p className="text-blue-600 text-sm cursor-pointer">
                                  ∞ All Inclusive
                                </p>

                                {/* Tooltip */}
                                <div className="absolute -left-10 mt-2 hidden group-hover:block w-64 bg-white text-gray-800 text-sm rounded-lg p-4 shadow-lg border border-gray-200 z-50">
                                  <h4 className="font-semibold mb-3">
                                    Tour Includes
                                  </h4>

                                  <div className="grid grid-cols-2 gap-3 text-xs">
                                    {tour.tourIncludes
                                      .filter(
                                        (include) =>
                                          include.status === "active",
                                      )
                                      .map((include) => (
                                        <div
                                          key={include._id}
                                          className="flex items-center gap-2"
                                        >
                                          <img
                                            src={include.image}
                                            alt={include.title}
                                            className="w-5 h-5 object-cover rounded"
                                          />
                                          <span className="capitalize">
                                            {include.title}
                                          </span>
                                        </div>
                                      ))}
                                    {tour.tourManagerIncluded && (
                                      <div className="flex items-center gap-2 col-span-2">
                                        <User className="w-5 h-5" />
                                        <span>Tour Manager</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Extra Note */}
                                  <p className="text-red-600 text-xs mt-3">
                                    *Economy class air travel is included for
                                    all departure cities, except for
                                    joining/leaving points; Taxes Extra.
                                  </p>
                                </div>
                              </div>
                            )}
                        </div>
                      </div>

                      <div className="p-4 pt-0">
                        {/* Info */}
                        <div className="text-sm text-gray-600 space-y-1 mb-4 flex justify-between">
                          <div className="text-xs">
                            <p className="font-semibold">Days:</p>
                            <p className="text-black font-bold">{tour.days}</p>
                          </div>
                          <div className="text-xs">
                            <p className="font-semibold">Destinations:</p>
                            <p className="text-blue-900 font-bold">
                              {getStatesText(tour.states)}
                            </p>
                          </div>
                          <div className="text-xs">
                            <p className="font-semibold">Departures:</p>
                            <p className="text-blue-900 font-bold">
                              {tour.metadata?.displayText ||
                                `${tour.metadata?.totalDepartures || 0} Dates`}
                            </p>
                          </div>
                        </div>

                        <div className="bg-gray-100 p-4 rounded-2xl border border-gray-200">
                          {/* Buttons */}
                          <div className="flex justify-between gap-2">
                            <Link
                              href={`/tour-details/${tour._id}`}
                              className="flex-1 border border-blue-600 text-center font-bold text-blue-600 px-2 py-2 rounded-md text-sm"
                            >
                              View Tour Details
                            </Link>
                            <Link
                              href={`/tour-details/${tour._id}`}
                              className="flex-1 bg-red-700 text-center text-white font-bold px-2 py-2 rounded-md text-sm"
                            >
                              Book Online
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })
            ) : (
              <p className="text-center text-gray-500">No Tours Available.</p>
            )}
          </Swiper>

          {/* Custom Nav Buttons */}
          {activePackages.length > 0 && (
            <>
              <button className="custom-prev absolute top-1/2 -left-3 z-10 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow hover:bg-gray-300 cursor-pointer">
                ❮
              </button>
              <button className="custom-next absolute top-1/2 -right-3 z-10 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow hover:bg-gray-300 cursor-pointer">
                ❯
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default DekhoApnaDesh;
