import React from "react";
import TourStatus from "@/app/pages/TourStatus/TourStatus";
import MapTabs from "@/app/pages/TourStatus/MapTabs";
import BookSection from "@/app/pages/TourStatus/BookSection";
import DiscoverWorld from "@/app/pages/Hero/DiscoverWorld";
import TrandingDestination from "@/app/pages/ReviewsAndTestimonial/TrandingDestination";

export const metadata = {
  title: "Tour Status - Explore Best Travel Plans | My Travel Site",
  description:
    "Discover and book the best tour packages. Choose from top destinations and customize your travel plan easily.",
};

const TourStatuspage = () => {
  return (
    <>
      <TourStatus />
      <MapTabs />
      <BookSection />
      <TrandingDestination />
      <DiscoverWorld />
    </>
  );
};

export default TourStatuspage;
