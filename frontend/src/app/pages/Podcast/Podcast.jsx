"use client";
import Link from "next/link";
import React, { useState, useMemo } from "react";
import { FaSearch, FaStar } from "react-icons/fa";
import { Heart, User } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import PodcastLeftList from "./PodcastLeftList";
import { useCreateEnquiryMutation } from "../../../../store/enquiryApi/enquiryApi";
import { useGetTourPackageQuery } from "store/toursManagement/toursPackagesApi";
import { useGetProfileQuery } from "store/authApi/authApi";
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "store/authApi/authApi";
import { useGetTourReviewQuery } from "store/reviewsApi/reviewsApi";
import { auth } from "@/app/config/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ─── Skeleton Components ──────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="border border-gray-300 rounded-lg shadow-sm bg-white overflow-hidden animate-pulse">
    <div className="flex">
      <div className="relative w-1/2 bg-gray-200 h-36" />
      <div className="w-2/2 p-2 flex flex-col gap-2">
        <div className="h-3 bg-gray-200 rounded w-16" />
        <div className="h-4 bg-gray-200 rounded w-28" />
        <div className="flex gap-1 my-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-3 w-3 bg-gray-200 rounded-full" />
          ))}
        </div>
        <div className="h-3 bg-gray-200 rounded w-20" />
      </div>
    </div>
    <div className="p-4 pt-2 flex flex-col gap-2">
      <div className="flex justify-between">
        <div className="h-3 bg-gray-200 rounded w-10" />
        <div className="h-3 bg-gray-200 rounded w-16" />
        <div className="h-3 bg-gray-200 rounded w-14" />
      </div>
      <div className="bg-gray-100 p-4 rounded-2xl flex gap-2 mt-2">
        <div className="flex-1 h-8 bg-gray-200 rounded-md" />
        <div className="flex-1 h-8 bg-gray-200 rounded-md" />
      </div>
    </div>
  </div>
);

const PodcastSidebarSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-40 mb-3" />
    <div className="h-3 bg-gray-200 rounded w-32 mb-6" />
    <div className="space-y-6">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const PodcastList = () => {
  const router = useRouter();
  const [countryCode, setCountryCode] = useState("91");
  const [mobile, setMobile] = useState("");
  const [formData, setFormData] = useState({
    name: "",
  });

  const [createEnquiry, { isLoading: isSubmitting }] =
    useCreateEnquiryMutation();
  const {
    data: packages,
    isLoading: packageLoading,
    error: packageError,
  } = useGetTourPackageQuery();

  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [addToWishlist] = useAddToWishlistMutation();
  const { data: wishlist } = useGetProfileQuery();
  const [wishlistItems, setWishlistItems] = React.useState(new Set());
  const { data: reviews } = useGetTourReviewQuery();
  const [searchQuery, setSearchQuery] = useState("");
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

  // Get 3 random packages
  const randomPackages = useMemo(() => {
    if (!packages?.data) return [];
    const activePackages = packages.data.filter(
      (item) => item.status === "Active",
    );
    const shuffled = [...activePackages].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, [packages]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const submitData = {
        name: formData.name,
        mono: `+${countryCode} ${mobile}`,
        destinations: "-",
        email: "-",
        message: "-",
        modeOfCommunication: "call",
      };

      await createEnquiry(submitData).unwrap();

      setFormData({ name: "" });
      setMobile("");

      alert("Call back request submitted successfully!");
    } catch (error) {
      console.error("Failed to submit request:", error);
      alert(error?.data?.message || "Failed to submit. Please try again.");
    }
  };

  return (
    <>
      <style>{`
      .react-tel-input .country-list .country-name {
        color: #000000;
      }
      .react-tel-input .country-list .dial-code {
        color: #6b7280;
      }
    `}</style>
      <section className="bg-gray-50 min-h-screen relative">
        {/* Header Section */}
        <div className="relative bg-linear-to-r from-[#0a2a66] to-[#4a1f8d] text-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between py-14 relative z-10">
            {/* Left Content */}
            <div className="max-w-2xl">
              <p className="text-sm mb-3">
                <span className="opacity-75">Home &gt;</span>{" "}
                <span className="font-semibold">Podcast</span>
              </p>
              <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-snug">
                Explore the World through Our Travel Podcast!
              </h1>
              <p className="text-base opacity-90">
                Embark the wonders of India and the world through Heaven
                Holiday's podcasts.
              </p>

              {/* Search */}
              <div className="mt-8 flex items-center bg-white rounded-full shadow-md overflow-hidden">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a podcast episodes"
                  className="flex-1 px-5 py-3 text-gray-600 text-sm outline-none rounded-l-full"
                />
                <button className="px-5 py-3 bg-gray-100 text-gray-500 rounded-r-full hover:bg-gray-200 transition">
                  <FaSearch />
                </button>
              </div>
            </div>

            {/* Right Sidebar (Request Call Back) */}
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm mt-10 lg:mt-0">
              <h3 className="text-gray-900 font-semibold text-lg mb-4">
                Request Call Back
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name*"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  required
                  className="w-full border rounded-md px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />

                {/* Phone Input with Country Code Dropdown */}
                <PhoneInput
                  country={"in"}
                  value={countryCode + mobile}
                  onChange={(value, data) => {
                    setCountryCode(data.dialCode);
                    setMobile(value.slice(data.dialCode.length));
                  }}
                  disabled={isSubmitting}
                  inputStyle={{
                    width: "100%",
                    height: "40px",
                    fontSize: "14px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    color: "#374151",
                  }}
                  buttonStyle={{
                    border: "1px solid #d1d5db",
                    borderRadius: "6px 0 0 6px",
                    background: "#f9fafb",
                  }}
                  containerStyle={{ width: "100%" }}
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full cursor-pointer text-sm bg-red-700 text-white font-semibold py-2.5 rounded-md hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Send Request"}
                </button>
              </form>
            </div>
          </div>

          {/* Smooth Curve Bottom */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
            <svg
              viewBox="0 0 1440 120"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              className="w-full h-24"
            >
              <path
                d="M0,60 C360,140 1080,-20 1440,60 L1440,120 L0,120 Z"
                fill="#f9fafb"
              />
            </svg>
          </div>
        </div>

        {/* Body Section */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT PODCAST LIST */}
          <PodcastLeftList searchQuery={searchQuery} />

          {/* RIGHT SIDEBAR (Popular Travel Packages) */}
          <div>
            {/* Loading Skeleton */}
            {packageLoading && <PodcastSidebarSkeleton />}

            {/* Error State */}
            {packageError && !packageLoading && (
              <div className="border border-red-200 bg-red-50 rounded-lg p-6 text-center">
                <p className="text-red-600 font-semibold text-sm mb-1">
                  Failed to load packages
                </p>
                <p className="text-gray-500 text-xs">Please try again later.</p>
              </div>
            )}

            {/* Loaded State */}
            {!packageLoading && !packageError && (
              <>
                <h3 className="text-gray-900 font-semibold text-base mb-3">
                  Popular Tour Packages
                </h3>

                <p className="text-xs text-gray-600 mt-2 mb-4">
                  We have {packages?.data?.length || 0} packages{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    View All
                  </a>
                </p>

                <div className="space-y-6">
                  {randomPackages.map((tour) => {
                    const isInWishlist = wishlistItems.has(tour._id);

                    return (
                      <div
                        key={tour._id}
                        className="border border-gray-300 rounded-lg shadow-sm bg-white overflow-hidden"
                      >
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
                                onClick={(e) =>
                                  handleToggleWishlist(tour._id, e)
                                }
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
                          <div className="text-sm text-gray-600 space-y-1 mb-4 flex justify-between">
                            <div className="text-xs">
                              <p className="font-semibold">Days:</p>
                              <p className="text-black font-bold">
                                {tour.days}
                              </p>
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
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default PodcastList;
