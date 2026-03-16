import React from "react";
import HowToBook from "@/app/pages/HowToBook/HowToBook";
import BookingPage from "@/app/pages/HowToBook/BookingPage";

export const metadata = {
  title: "How To Book - Explore Best Travel Plans | My Travel Site",
  description:
    "Discover and book the best tour packages. Choose from top destinations and customize your travel plan easily.",
};

const HowToBookPage = () => {
  return (
    <>
      <HowToBook />
      <BookingPage />
    </>
  );
};

export default HowToBookPage;
