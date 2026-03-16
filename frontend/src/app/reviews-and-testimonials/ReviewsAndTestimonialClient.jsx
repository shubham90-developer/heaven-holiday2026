"use client";
import { useState } from "react";
import ReviewsAndTestimonial from "@/app/pages/ReviewsAndTestimonial/ReviewsAndTestimonial";
import ReviewsAndTestimonialTab from "@/app/pages/ReviewsAndTestimonial/ReviewsAndTestimonialTab";

const ReviewsAndTestimonialClient = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <ReviewsAndTestimonial
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <ReviewsAndTestimonialTab searchQuery={searchQuery} />
    </>
  );
};

export default ReviewsAndTestimonialClient;
