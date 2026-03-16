import React from "react";
import TourManager from "@/app/pages/TourManager/TourManager";
import TourManagerDirectory from "@/app/pages/TourManager/TourManagerDirectory";
import EnquiryForm from "@/app/pages/TourManager/EnquiryForm";
import TourReview from "@/app/components/TourReview";
import TourPackagesCards from "@/app/pages/Hero/TourPackagescards";
import OfferBanner from "@/app/pages/Hero/OfferBanner";
import TrandingDestination from "@/app/pages/ReviewsAndTestimonial/TrandingDestination";
import TravalStories from "@/app/pages/Hero/TravalStories";
import Gallery from "@/app/pages/TourManager/Gallery";

export const metadata = {
  title: "Tour Manager - Explore Best Travel Plans | My Travel Site",
  description:
    "Discover and book the best tour packages. Choose from top destinations and customize your travel plan easily.",
};

const TourManagerpage = () => {
  return (
    <>
      <TourManager />
      <TourManagerDirectory />
      <EnquiryForm />
      <TourReview />
      <TourPackagesCards />
      <OfferBanner />
      <TrandingDestination />
      <TravalStories />
      <Gallery />
    </>
  );
};

export default TourManagerpage;
