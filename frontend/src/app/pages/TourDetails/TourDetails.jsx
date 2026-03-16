"use client";

import React from "react";
import { FaStar } from "react-icons/fa";
import Testimonials from "./Testimonials";
import Breadcrumb from "@/app/components/Breadcum";
import Image from "next/image";
import {
  Building2,
  Bus,
  CalendarDays,
  Camera,
  Download,
  Heart,
  Hotel,
  Mail,
  Map,
  Phone,
  PlaneTakeoff,
  Share2,
  User,
  User2,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import TourActions from "./TourActions";
import TourGallery from "./TourGallery";
import DepartureBooking from "./DepartureBooking";
import StickyNavbar from "./StickyNavbar";
import Itinerary from "./Itinerary";
import TourDetailsTabs from "./TourDetailsTabs";
import NeedToKnow from "./NeedToKnow";
import TourInformation from "./TourInformation";
import CancellationPolicy from "./CancellationPolicy";
import Upgrades from "./Upgrades";
import RightMap from "./RightMap";
import TourReview from "@/app/components/TourReview";
import { useParams } from "next/navigation";
import { useGetTourPackageQuery } from "store/toursManagement/toursPackagesApi";
import BookingStepperModal from "@/app/components/bookingModals";
import { useState } from "react";
import { useGetTourReviewQuery } from "store/reviewsApi/reviewsApi";
import { useCreateEnquiryMutation } from "store/enquiryApi/enquiryApi";
import toast from "react-hot-toast";
const TourDetails = () => {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Tours", href: "/tours" },
    { label: "Search Holiday Package", href: null },
  ];
  const [formData, setFormData] = useState({
    name: "",
    mono: "",
  });
  const [createEnquiry, { isLoading: isSubmitting }] =
    useCreateEnquiryMutation();
  const { id: packageId } = useParams();
  const {
    data: tourPackage,
    isLoading: tourPackageLoading,
    error: tourPackageError,
  } = useGetTourPackageQuery();

  const {
    data: reviews,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useGetTourReviewQuery();

  const Activereviews =
    reviews?.data?.reviews.filter((item) => {
      return item.status === "active";
    }) || [];

  const packages = tourPackage?.data?.filter((item) => {
    return item._id === packageId;
  });

  const tourData = packages?.[0];

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [preSelectedDeparture, setPreSelectedDeparture] = useState(null);

  const handleScroll = () => {
    const section = document.getElementById("departure-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Loading state
  if (tourPackageLoading || reviewsLoading) {
    return (
      <>
        <Breadcrumb items={breadcrumbItems} />

        <section className="py-10 bg-gray-100 animate-pulse">
          <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-3 gap-8">
            {/* LEFT SECTION */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Image Skeleton */}
              <div className="w-full h-72 md:h-96 bg-gray-300 rounded-lg"></div>

              {/* Title + Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 w-24 rounded"></div>
                  <div className="h-6 bg-gray-300 w-3/4 rounded"></div>
                  <div className="h-4 bg-gray-300 w-1/2 rounded"></div>
                  <div className="h-4 bg-gray-300 w-2/3 rounded"></div>
                  <div className="h-4 bg-gray-300 w-1/3 rounded"></div>
                </div>

                {/* Form Skeleton */}
                <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                  <div className="h-4 bg-gray-300 w-1/2 rounded"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              </div>

              {/* Why Travel Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="h-32 bg-gray-300 rounded"></div>
                <div className="h-32 bg-gray-300 rounded"></div>
              </div>
            </div>

            {/* RIGHT BOOKING CARD */}
            <div className="bg-white p-5 rounded-lg space-y-4 h-fit">
              <div className="h-40 bg-gray-300 rounded"></div>

              <div className="h-20 bg-gray-300 rounded"></div>

              <div className="h-20 bg-gray-300 rounded"></div>

              <div className="h-12 bg-gray-300 rounded"></div>

              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="h-10 bg-gray-300 rounded"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  // Error state
  if (tourPackageError || !tourData || reviewsError) {
    return (
      <div className="text-center py-20 text-red-500">
        Tour not found or error loading details.
      </div>
    );
  }

  // Calculate total states and cities
  const totalStates = tourData.states?.length || 0;
  const totalCities =
    tourData.metadata?.uniqueCities || tourData.cityDetails?.length || 0;

  // Format route display
  const routeDisplay =
    tourData.states
      ?.map((state) => {
        const cities = state.cities?.join(", ") || "";
        return `${state.name}: ${cities}`;
      })
      .join(" → ") ||
    tourData.route ||
    "Route information not available";

  // Format city nights display
  const cityNightsDisplay =
    tourData.cityDetails
      ?.map((city) => `${city.name} (${city.nights}N)`)
      .join(" → ") || "";

  // Calculate EMI
  const basePrice =
    tourData.baseJoiningPrice || tourData.baseFullPackagePrice || 0;
  const emiAmount = Math.ceil(basePrice / 12);
  const handleDepartureSelect = (departure) => {
    // Store the selected departure
    setPreSelectedDeparture(departure);

    // Open booking modal
    setIsBookingModalOpen(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.mono) {
      alert("Please fill all fields!");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.mono)) {
      alert("Mobile number must be exactly 10 digits!");
      return;
    }

    try {
      await createEnquiry({
        name: formData.name,
        mono: formData.mono,
        destinations: "-",
        status: "active",
      }).unwrap();

      toast.success(
        "Request submitted successfully! We will call you back soon.",
      );
      setFormData({ name: "", mono: "" });
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to submit request. Please try again.",
      );
    }
  };
  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <section className="py-10 bg-gray-100 z-0">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-3 gap-8">
          {/* Left Section */}
          <div className="lg:col-span-2">
            {/* Main Tour Image */}
            <div className="relative group">
              <Image
                width={600}
                height={600}
                src={
                  tourData.galleryImages?.[0] || "/assets/img/tour-list/1.webp"
                }
                alt={tourData.title}
                className="w-full h-56 sm:h-72 md:h-80 lg:h-96 object-cover rounded-lg shadow cursor-pointer"
              />
              {/* Review Card */}
              <div className="opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                <Testimonials />
              </div>
            </div>

            {/* Info + Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Tour Info */}
              <div>
                <span className="text-orange-500 border border-orange-500 text-[10px] px-2 py-1 rounded">
                  {tourData.tourType?.toUpperCase() || "GROUP TOUR"}
                </span>
                <h1 className="text-xl sm:text-2xl font-bold mt-3 leading-snug">
                  {tourData.title}
                </h1>

                {/* Ratings */}
                <div className="flex items-center mt-2 text-yellow-500 flex-wrap">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <FaStar key={i} className="text-sm" />
                    ))}

                  <span className="ml-2 text-xs sm:text-sm text-gray-600">
                    {Activereviews.length || ""} Reviews
                  </span>
                </div>

                {/* Duration, Location */}
                <p className="mt-3 text-gray-900 flex flex-wrap items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-4 h-4 text-black" />
                    <strong>{tourData.days} </strong>Days
                  </span>
                  <span className="flex items-center gap-1">
                    <Map className="w-4 h-4 text-black" />
                    <strong>{totalStates}</strong>{" "}
                    {totalStates === 1 ? "State" : "States"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4 text-black" />
                    <strong>{totalCities}</strong>{" "}
                    {totalCities === 1 ? "City" : "Cities"}
                  </span>
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 flex flex-wrap items-center gap-2">
                  <Map className="w-4 h-4 text-black" />
                  {cityNightsDisplay || routeDisplay}
                </p>

                <Link
                  href="#itinerary"
                  id="view-daywise-tour-itinerary"
                  className="text-blue-600 font-bold underline text-xs sm:text-sm mt-2 inline-block"
                >
                  View daywise tour itinerary
                </Link>
              </div>

              {/* Enquiry Form */}
              <div className="border border-gray-200 rounded-lg p-4 shadow-sm bg-blue-50">
                <h3 className="text-sm font-semibold mb-3">
                  Want us to call you?
                </h3>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full border rounded-xl p-2 py-3 text-xs mb-2 border-gray-300"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={formData.mono}
                    onChange={(e) =>
                      setFormData({ ...formData, mono: e.target.value })
                    }
                    pattern="[0-9]{10}"
                    maxLength={10}
                    className="w-full border rounded-xl p-2 py-3 text-xs mb-2 border-gray-300"
                    required
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full cursor-pointer bg-red-700 hover:bg-red-500 text-white py-2 rounded font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Phone size={16} className="text-white" />
                    <span>
                      {isSubmitting ? "Submitting..." : "Request Call Back"}
                    </span>
                  </button>
                </form>
              </div>
            </div>

            {/* Why Travel Section */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              {tourData.tourManagerIncluded && (
                <div className="flex items-start gap-3">
                  <User className="w-8 h-8 text-yellow-500 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-2">
                      Heaven Holiday Tour Manager
                    </h3>
                    <div
                      className="text-gray-600 text-xs sm:text-sm"
                      dangerouslySetInnerHTML={{
                        __html:
                          tourData.tourManagerNote ||
                          "This tour includes the services of Heaven Holiday's Tour Manager...",
                      }}
                    />
                  </div>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-2">
                  Why travel with Heaven Holiday
                </h3>
                <ul className="list-disc ml-5 text-gray-600 text-xs sm:text-sm space-y-1">
                  {tourData.whyTravel && tourData.whyTravel.length > 0 ? (
                    tourData.whyTravel.map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))
                  ) : (
                    <>
                      <li>Expert tour manager all throughout the tour.</li>
                      <li>All meals included in tour price.</li>
                      <li>Music, fun and games every day.</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Section - Booking Card */}
          <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-5 w-full h-fit">
            <TourGallery galleryImages={tourData.galleryImages} />
            <div className="border border-gray-200 rounded-lg p-4 shadow-sm bg-blue-50 mt-4">
              {/* Pricing Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-black text-xs">
                    {tourData.departures?.[0]?.city || "Mumbai"} to{" "}
                    {tourData.departures?.[0]?.city || "Mumbai"}
                    <br />
                    Starts from
                  </p>
                  <p className="text-lg font-bold">
                    ₹{tourData.baseFullPackagePrice?.toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <p className="text-black text-xs">
                    All-inclusive tour from
                    <br />
                    {tourData.departures?.[0]?.city || "Mumbai"} to{" "}
                    {tourData.departures?.[0]?.city || "Mumbai"}
                  </p>
                </div>
              </div>
              {/* Joining/Leaving */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-black text-xs">
                    Joining/Leaving
                    <br />
                    Starts from
                  </p>
                  <p className="text-lg font-semibold">
                    ₹{tourData.baseJoiningPrice?.toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <p className="text-black text-xs">
                    Book your own flights & join at destination.
                  </p>
                </div>
              </div>

              {/* Twin-sharing note */}
              <div className="bg-gray-900 py-2 px-3 rounded mb-2 text-center">
                <p className="text-[10px] text-white">
                  Mentioned prices are on a twin-sharing basis.
                </p>
                <button
                  onClick={handleScroll}
                  className="bg-red-700 w-full py-2 rounded-full text-sm font-semibold hover:bg-red-500 text-white cursor-pointer"
                >
                  Dates & Prices
                </button>
              </div>

              {/* EMI */}
              {/* <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-3 py-2 rounded-md bg-gray-600 text-xs mt-2">
                <span className="text-white text-center sm:text-left">
                  EMI start at{" "}
                  <span className="font-semibold underline">
                    ₹{emiAmount.toLocaleString("en-IN")}/mo
                  </span>
                </span>
              </div> */}

              {/* Tour Includes */}
              <div className="mt-4">
                <h4 className="text-xs font-semibold mb-2">Tour Includes</h4>
                <div className="grid grid-cols-3 gap-4 text-xs text-gray-700">
                  {tourData.tourIncludes && tourData.tourIncludes.length > 0 ? (
                    tourData.tourIncludes.map((include, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <Image
                          src={include.image}
                          alt={include.title}
                          width={20}
                          height={20}
                          className="w-5 h-5 mb-1 object-cover"
                        />
                        {include.title}
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex flex-col items-center">
                        Tour Includes
                      </div>
                    </>
                  )}
                  {tourData.tourManagerIncluded && (
                    <div className="flex flex-col items-center">
                      <User2 className="w-5 h-5 mb-1 text-yellow-600" />
                      Tour Manager
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <TourActions packageId={tourData._id} tourTitle={tourData.title} />
          </div>
        </div>
      </section>

      <DepartureBooking
        tourData={tourData}
        onDepartureSelect={handleDepartureSelect}
      />
      <StickyNavbar />

      <section className="py-10 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 relative">
              <Itinerary itinerary={tourData.itinerary} />
              <TourDetailsTabs tourData={tourData} />
              <TourInformation tourData={tourData} />
              <NeedToKnow tourData={tourData} />
              <CancellationPolicy tourData={tourData} />
              <Upgrades />
            </div>
            {/* <div className="lg:col-span-1">
              <RightMap />
            </div> */}
          </div>
        </div>
      </section>

      <TourReview />
      <BookingStepperModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setPreSelectedDeparture(null);
        }}
        tourData={tourData}
        preSelectedDeparture={preSelectedDeparture}
      />
    </>
  );
};

export default TourDetails;
