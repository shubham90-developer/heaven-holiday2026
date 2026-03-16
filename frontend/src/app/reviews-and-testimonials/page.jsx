import React from "react";
import ReviewsAndTestimonialClient from "./ReviewsAndTestimonialClient";
import ReviewsFeedback from "@/app/pages/ReviewsAndTestimonial/ReviewsFeedback";
import TrandingDestination from "@/app/pages/ReviewsAndTestimonial/TrandingDestination";
import DiscoverWorld from "@/app/pages/Hero/DiscoverWorld";
import DekhoApnaDesh from "@/app/pages/Hero/DekhoApnaDesh";

export const metadata = {
  title: "Reviews - Explore Best Travel Plans | My Travel Site",
  description:
    "Discover and book the best tour packages. Choose from top destinations and customize your travel plan easily.",
};

const ReviewsAndTestimonialspage = () => {
  return (
    <>
      <ReviewsAndTestimonialClient />
      <ReviewsFeedback />
      <TrandingDestination />
      <DiscoverWorld />
      <DekhoApnaDesh />
    </>
  );
};

export default ReviewsAndTestimonialspage;
