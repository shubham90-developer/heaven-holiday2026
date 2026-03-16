import React from "react";
import TravelPlanners from "@/app/pages/TravelPlanners/TravelPlanners";

export const metadata = {
  title: "Travel Planners - Explore Best Travel Plans | My Travel Site",
  description:
    "Discover and book the best tour packages. Choose from top destinations and customize your travel plan easily.",
};

const TravelPlannersPage = () => {
  return (
    <>
      <TravelPlanners />
    </>
  );
};

export default TravelPlannersPage;
