import TourList from "@/app/pages/tour-list/TourList";
import React from "react";

export const metadata = {
  title: "Tour Packages - Explore Best Travel Plans | My Travel Site",
  description:
    "Discover and book the best tour packages. Choose from top destinations and customize your travel plan easily.",
};

const TourListpage = () => {
  return (
    <>
      <TourList />
    </>
  );
};

export default TourListpage;
