import React from "react";

import TourReview from "@/app/components/TourReview";
import PackagesCard from "@/app/pages/Hero/PackagesCard";
import PodcastDetails from "@/app/pages/PodcastDetails/PodcastDetails";

export const metadata = {
  title: "Podcast - Explore Best Travel Plans | My Travel Site",
  description:
    "Discover and book the best tour packages. Choose from top destinations and customize your travel plan easily.",
};

const PodcastDetailsPage = () => {
  return (
    <>
      <PodcastDetails />
      <TourReview />
      <PackagesCard />
    </>
  );
};

export default PodcastDetailsPage;
