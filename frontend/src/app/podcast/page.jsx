import React from "react";
import Podcast from "@/app/pages/Podcast/Podcast";
import TourReview from "@/app/components/TourReview";
import PackagesCard from "@/app/pages/Hero/PackagesCard";

export const metadata = {
  title: "Podcast - Explore Best Travel Plans | My Travel Site",
  description:
    "Discover and book the best tour packages. Choose from top destinations and customize your travel plan easily.",
};

const PodcastPage = () => {
  return (
    <>
      <Podcast />
      <TourReview />
      <PackagesCard />
    </>
  );
};

export default PodcastPage;
