"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaHeart, FaCcVisa, FaStar } from "react-icons/fa";
import {
  Building2,
  Bus,
  Camera,
  Cookie,
  Heart,
  PlaneTakeoff,
  User,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useGetCategoriesQuery } from "store/toursManagement/toursPackagesApi";
import { useGetTourPackageQuery } from "store/toursManagement/toursPackagesApi";
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetProfileQuery,
} from "store/authApi/authApi";
import { auth } from "@/app/config/firebase";

const TourCard = ({ tour, wishlistItems, handleToggleWishlist }) => {
  const isInWishlist = wishlistItems.has(tour._id);

  return (
    <div className="border border-gray-300 rounded-lg shadow-xs flex flex-col md:flex-row p-3 bg-white mb-4">
      {/* Left Image */}
      <div className="relative w-full md:w-1/5 flex-shrink-0">
        <Image
          src={tour.galleryImages?.[0] || "/assets/img/tour-card/1.avif"}
          alt={tour.title}
          width={600}
          height={600}
          className="w-full h-48 md:h-50 lg:h-50 xl:h-50 object-cover rounded-lg"
        />

        {/* Wishlist */}
        <div className="absolute top-2 right-2 group">
          <button
            className={`p-2 rounded-full shadow ${
              isInWishlist
                ? "bg-red-500 hover:bg-red-600"
                : "bg-white hover:bg-red-50"
            } transition cursor-pointer`}
            onClick={(e) => handleToggleWishlist(tour._id, e)}
          >
            <Heart
              className={`w-4 h-4 ${
                isInWishlist
                  ? "text-white fill-white"
                  : "text-gray-500 group-hover:text-red-500"
              }`}
            />
          </button>
          <span className="absolute right-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          </span>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 flex flex-col justify-between md:px-4 mt-4 md:mt-0">
        <div>
          {/* Labels */}
          <div className="flex gap-2 mb-1">
            <span className="border border-orange-500 text-orange-500 font-bold text-[10px] px-2 py-1 rounded">
              {tour.tourType?.toUpperCase() || "GROUP TOUR"}
            </span>
            <span className="bg-pink-100 text-pink-600 text-[10px] px-2 py-1 rounded">
              {tour.category?.name || "Family"}
            </span>
          </div>

          <h2 className="text-sm font-semibold">{tour.title}</h2>
          {/* <p className="text-yellow-500 text-sm">
            ★★★★★ <span className="text-gray-600">79 Reviews</span>
          </p> */}

          {/* Tooltip */}
          <div className="relative group inline-block mb-2">
            <p className="text-blue-600 text-sm cursor-pointer">
              ∞ All Inclusive
            </p>
            <div className="absolute -left-10 mt-2 hidden group-hover:block w-64 bg-white text-gray-800 text-sm rounded-lg p-4 shadow-lg border border-gray-200 z-50">
              <h4 className="font-semibold mb-3">Tour Includes</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {tour.tourIncludes && tour.tourIncludes.length > 0 ? (
                  tour.tourIncludes.map((include, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Image
                        src={include.image}
                        alt={include.title}
                        width={20}
                        height={20}
                        className="w-5 h-5 object-cover"
                      />
                      <span>{include.title}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      <span>Hotel</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Cookie className="w-5 h-5" />
                      <span>Meals</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PlaneTakeoff className="w-5 h-5" />
                      <span>Flight</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Camera className="w-5 h-5" />
                      <span>Sightseeing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bus className="w-5 h-5" />
                      <span>Transport</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCcVisa className="w-5 h-5" />
                      <span>Visa</span>
                    </div>
                  </>
                )}
                {tour.tourManagerIncluded && (
                  <div className="flex items-center gap-2 col-span-2">
                    <User className="w-5 h-5" />
                    <span>Tour Manager</span>
                  </div>
                )}
              </div>
              <p className="text-red-600 text-xs mt-3">
                *Economy class air travel included; taxes extra.
              </p>
            </div>
          </div>
        </div>

        {/* Middle Info */}
        <div className="flex gap-6 mt-2 text-xs border-b border-gray-300 py-2">
          <div>
            <p>Days</p>
            <span className="font-bold">{tour.days}</span>
          </div>
          <div>
            <p>Destinations</p>
            <span className="text-sky-600 font-bold">
              {tour.metadata?.uniqueCities}{" "}
              {tour.metadata?.uniqueCities === 1 ? "City" : "Cities"}
            </span>
          </div>
          <div>
            <p>Departure</p>
            <span className="text-sky-600 font-bold">
              {tour.metadata?.displayText}
            </span>
          </div>
        </div>

        {/* Dates */}
        <div className="mt-3 text-xs">
          <p className="text-red-500 font-semibold">Dates Filling Fast</p>
          <div className="flex gap-4 mt-1 flex-wrap">
            {tour.departures &&
              tour.departures.slice(0, 3).map((d, i) => (
                <span key={i} className="text-gray-700">
                  {new Date(d.date)
                    .toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "2-digit",
                    })
                    .replace(/ /g, " ")}{" "}
                  <span className="text-red-500">
                    ({d.availableSeats} seats)
                  </span>
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="md:w-1/4 w-full flex flex-col justify-center bg-blue-50 rounded-2xl items-center border border-gray-300 p-2 mt-4 md:mt-0">
        <p className="text-xs text-gray-600">Starts from</p>
        <h3 className="text-sm font-bold text-black">
          ₹{(tour.baseFullPackagePrice || "60000")?.toLocaleString("en-IN")}
        </h3>
        {/* <p className="text-xs text-gray-500">per person on twin sharing</p>
        <p className="text-xs text-gray-500">
          EMI from{" "}
          <span className="text-sky-600">
            ₹
            {Math.ceil(
              (tour.baseJoiningPrice || tour.baseFullPackagePrice) / 12,
            )?.toLocaleString("en-IN")}
            /mo
          </span>
        </p> */}
        <Link
          href={`/tour-details/${tour._id}`}
          className="bg-red-700 text-center text-xs text-white hover:bg-red-500 w-full py-2 mt-2 rounded font-semibold cursor-pointer"
        >
          Book Online
        </Link>
        <Link
          href={`/tour-details/${tour._id}`}
          className="border-blue-500 border text-center bg-white text-blue-500 text-xs w-full py-2 mt-2 rounded font-semibold"
        >
          View Tour Details
        </Link>
      </div>
    </div>
  );
};

// ✅ Main component: maps tours
const TourCardList = ({ filteredPackages = [] }) => {
  // ← ADD THIS PROP
  const router = useRouter();
  const { id: categoryId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const toursPerPage = 5;

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoryError,
  } = useGetCategoriesQuery();

  const {
    data: tourpackage,
    isLoading: tourpackageLoading,
    error: tourpackageError,
  } = useGetTourPackageQuery();

  // Wishlist hooks
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const {
    data: wishlist,
    isLoading: wishlistLoading,
    error: wishlistError,
  } = useGetProfileQuery();

  const [wishlistItems, setWishlistItems] = React.useState(new Set());

  // Load wishlist from user data
  React.useEffect(() => {
    if (wishlist?.data?.wishlist) {
      const ids = new Set(wishlist.data.wishlist.map((id) => id.toString()));
      setWishlistItems(ids);
    }
  }, [wishlist]);

  // Get category and filter tour packages
  const category = categories?.data?.find((item) => {
    return item._id === categoryId;
  });

  const categoryName = category?.name;

  // ← REPLACE THIS ENTIRE BLOCK
  const tourPackages =
    filteredPackages.length > 0
      ? filteredPackages
      : tourpackage?.data?.filter((item) => {
          return item.category.name === categoryName;
        }) || [];

  // Calculate index range
  const indexOfLast = currentPage * toursPerPage;
  const indexOfFirst = indexOfLast - toursPerPage;
  const currentTours = tourPackages.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(tourPackages.length / toursPerPage);

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

  // Loading state
  if (categoriesLoading || tourpackageLoading) {
    return <div className="text-center py-8">Loading tours...</div>;
  }

  // Error state
  if (categoryError || tourpackageError) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading tours. Please try again.
      </div>
    );
  }

  // No tours found
  if (tourPackages.length === 0) {
    return (
      <div className="text-center py-8">
        {filteredPackages.length === 0 && categoryName
          ? "No tours found for this category."
          : "No tours available with the applied filters. Try changing your filters."}
      </div>
    );
  }

  return (
    <div>
      {/* Render tours */}
      {currentTours.map((tour) => (
        <TourCard
          key={tour._id}
          tour={tour}
          wishlistItems={wishlistItems}
          handleToggleWishlist={handleToggleWishlist}
        />
      ))}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border text-xs cursor-pointer rounded disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded-full cursor-pointer ${
                currentPage === i + 1
                  ? "bg-blue-900 text-white"
                  : "bg-white text-black"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border text-xs rounded cursor-pointer disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TourCardList;
