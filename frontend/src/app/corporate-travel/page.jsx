import React from "react";
import CorporateTravel from "@/app/pages/CorporateTravel/CorporateTravel";
import BrandsSection from "@/app/pages/CorporateTravel/BrandsSection";
import TravelPackages from "@/app/pages/CorporateTravel/TravelPackages";
import TourReview from "../components/TourReview";

export const metadata = {
  title: "Corporate Travel - Explore Best Travel Plans | My Travel Site",
  description:
    "Discover and book the best tour packages. Choose from top destinations and customize your travel plan easily.",
};

const CorporateTravelPage = () => {
  return (
    <>
      <CorporateTravel />
      <BrandsSection />
      <TravelPackages />
      <TourReview />
    </>
  );
};

export default CorporateTravelPage;
