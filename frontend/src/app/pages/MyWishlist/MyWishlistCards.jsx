"use client";
import React, { useMemo } from "react";
import { FaCcVisa, FaStar } from "react-icons/fa";
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
  useGetProfileQuery,
  useRemoveFromWishlistMutation,
} from "store/authApi/authApi";
import { useGetTourPackageQuery } from "store/toursManagement/toursPackagesApi";
import { auth } from "@/app/config/firebase";

const MyWishlistCards = () => {
  const router = useRouter();

  // Fetch user profile to get wishlist
  const { data: profileData, isLoading: profileLoading } = useGetProfileQuery();

  // Fetch all tour packages
  const { data: tourPackageData, isLoading: packagesLoading } =
    useGetTourPackageQuery();

  // Remove from wishlist mutation
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  // Get wishlist package IDs from profile
  const wishlistIds = useMemo(() => {
    if (!profileData?.data?.user?.wishlist) return [];
    // Remove duplicates using Set
    return [...new Set(profileData.data.user.wishlist)];
  }, [profileData]);

  // Filter tour packages to only show those in wishlist
  const wishlistPackages = useMemo(() => {
    if (!tourPackageData?.data || wishlistIds.length === 0) return [];

    return tourPackageData.data.filter(
      (pkg) => wishlistIds.includes(pkg._id) && pkg.status === "Active",
    );
  }, [tourPackageData, wishlistIds]);

  // Format price
  const formatPrice = (price) => {
    return `₹${price?.toLocaleString() || "0"}`;
  };

  // Get states text
  const getStatesText = (states) => {
    if (!states || states.length === 0) return "N/A";
    const stateCount = states.length;
    const cityCount = states.reduce(
      (acc, state) => acc + (state.cities?.length || 0),
      0,
    );
    return `${stateCount} State${stateCount > 1 ? "s" : ""} ${cityCount} Cities`;
  };

  // Handle remove from wishlist
  const handleRemoveFromWishlist = async (packageId, e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const result = await removeFromWishlist({ packageId }).unwrap();

      alert("Removed successfully!");
    } catch (error) {
      alert(error?.data?.message || "Failed to remove");
    }
  };

  if (profileLoading || packagesLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-gray-500">Loading your wishlist...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-2xl font-semibold text-gray-800">My Wishlist</p>
          {wishlistPackages.length > 0 && (
            <p className="text-sm text-gray-600">
              {wishlistPackages.length}{" "}
              {wishlistPackages.length === 1 ? "package" : "packages"}
            </p>
          )}
        </div>

        {wishlistPackages.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {wishlistPackages.map((tour) => (
              <div
                key={tour._id}
                className="border border-gray-300 rounded-lg shadow-sm bg-white overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Left Image */}
                  <div className="relative sm:w-1/2">
                    <Image
                      src={
                        tour.galleryImages[0] || "/assets/img/tour-card/1.avif"
                      }
                      alt={tour.title}
                      width={1000}
                      height={600}
                      className="w-full h-full object-cover rounded-lg p-2"
                    />

                    {/* Wishlist Heart Icon - Filled to show it's in wishlist */}
                    <div className="absolute top-3 right-3 group">
                      <button
                        className="p-2 bg-red-500 rounded-full shadow hover:bg-red-600 relative cursor-pointer"
                        onClick={(e) => handleRemoveFromWishlist(tour._id, e)}
                      >
                        <Heart className="w-4 h-4 text-white fill-white" />
                      </button>
                      <div className="absolute top-full right-1/2 translate-x-1/2 mt-1 hidden group-hover:flex items-center justify-center bg-black text-white text-xs rounded px-2 py-1 shadow z-10 whitespace-nowrap">
                        Remove from Wishlist
                      </div>
                    </div>

                    {/* Badge */}
                    {tour.badge && (
                      <span className="absolute bottom-2 left-2 bg-orange-500 text-white text-[10px] px-2 py-1 rounded">
                        {tour.badge.length > 16
                          ? `${tour.badge.slice(0, 16)}...`
                          : tour.badge}
                      </span>
                    )}
                  </div>

                  {/* Right Content */}
                  <div className="sm:w-1/2 p-3 flex flex-col justify-between">
                    <div>
                      {tour.tourType && (
                        <p className="bg-orange-500 text-white inline-block py-0.5 px-2 text-[10px] rounded-2xl">
                          {tour.tourType}
                        </p>
                      )}
                      <h3 className="font-bold text-lg mt-1 text-gray-800">
                        {tour.title.length > 25
                          ? `${tour.title.slice(0, 25)}...`
                          : tour.title}
                      </h3>
                      <div className="flex items-center text-yellow-500 text-sm my-2">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} />
                        ))}
                        <span className="ml-2 text-gray-600">0 Reviews</span>
                      </div>

                      {/* All Inclusive */}
                      {tour.tourIncludes && tour.tourIncludes.length > 0 && (
                        <div className="relative group inline-block mb-2">
                          <p className="text-blue-600 text-sm cursor-pointer">
                            ∞ All Inclusive
                          </p>

                          <div className="absolute -left-10 mt-2 hidden group-hover:block w-64 bg-white text-gray-800 text-sm rounded-lg p-4 shadow-lg border border-gray-200 z-50">
                            <h4 className="font-semibold mb-3">
                              Tour Includes
                            </h4>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              {tour.tourIncludes
                                .filter(
                                  (include) => include.status === "active",
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
                              *Economy class air travel is included for all
                              departure cities, except for joining/leaving
                              points; Taxes Extra.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="p-4 pt-0">
                  <div className="text-sm text-gray-600 flex justify-between mb-4">
                    <div>
                      <p className="font-semibold text-xs">Days:</p>
                      <p className="text-black font-bold">
                        {tour.days || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-xs">Destinations:</p>
                      <p className="text-blue-900 font-bold">
                        {getStatesText(tour.states)}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-xs">Departures:</p>
                      <p className="text-blue-900 font-bold">
                        {tour.metadata?.displayText ||
                          `${tour.metadata?.totalDepartures || 0} Dates`}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-2xl border border-gray-200">
                    <div className="text-xs text-gray-600 mb-3 flex justify-between">
                      <div>
                        <p>EMI from </p>
                        <span className="text-blue-600 font-bold">
                          ₹8,835/mo
                        </span>
                      </div>
                      <div>
                        <p>
                          Starts from{" "}
                          <span className="font-bold">
                            {formatPrice(tour.baseFullPackagePrice)}
                          </span>
                        </p>
                        <p>per person on twin sharing</p>
                      </div>
                    </div>

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
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">Your wishlist is empty</p>
            <p className="text-gray-400 text-sm mb-6">
              Start adding tour packages to your wishlist to see them here
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition"
            >
              Explore Tours
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default MyWishlistCards;
