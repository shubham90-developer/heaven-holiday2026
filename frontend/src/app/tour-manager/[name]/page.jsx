import TravalStories from "@/app/pages/Hero/TravalStories";
import TrandingDestination from "@/app/pages/ReviewsAndTestimonial/TrandingDestination";
import TourManagerDetails from "@/app/pages/TourManagerDetails/TourManagerDetails";
import React from "react";

export const metadata = {
  title: "Tour Manager Details- Explore Best Travel Plans | My Travel Site",
  description:
    "Discover and book the best tour packages. Choose from top destinations and customize your travel plan easily.",
};

const TourManagerDetailsPage = () => {
  return (
    <>
      <TourManagerDetails />
      <TrandingDestination />
      <TravalStories />
    </>
  );
};

export default TourManagerDetailsPage;
