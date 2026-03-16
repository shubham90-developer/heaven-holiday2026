import React from "react";
import TravelDeal from "@/app/pages/TravelDeal/TravelDeal";
import HolidaySection from "@/app/pages/TravelDeal/HolidaySection";
import Celebrate from "@/app/pages/TravelDeal/Celebrate";
import ToursGrid from "@/app/pages/TravelDeal/TourCard";
import BookForm from "@/app/pages/TravelDeal/BookForm";

export const metadata = {
  title: "Travel Deals - Explore Best Travel Plans | My Travel Site",
  description:
    "Discover and book the best tour packages. Choose from top destinations and customize your travel plan easily.",
};

const TravelDealpage = () => {
  return (
    <>
      <TravelDeal />
      <HolidaySection />
      <Celebrate />
      <ToursGrid />
      <BookForm />
    </>
  );
};

export default TravelDealpage;
