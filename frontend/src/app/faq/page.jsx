import React from "react";
import Faq from "@/app/pages/Faq/Faq";
import FAQDataPage from "../pages/Faq/FAQDataPage";

export const metadata = {
  title: "FAQ - Explore Best Travel Plans | My Travel Site",
  description:
    "Discover and book the best tour packages. Choose from top destinations and customize your travel plan easily.",
};

const FaqPage = () => {
  return (
    <>
      <Faq />
      <FAQDataPage />
    </>
  );
};

export default FaqPage;
