import React from "react";
import BecomeASalesPartner from "@/app/pages/BecomeASalesPartner/BecomeASalesPartner";
import PartnerSelection from "@/app/pages/BecomeASalesPartner/PartnerSelection";
import ExperienceCounter from "@/app/pages/BecomeASalesPartner/ExperienceCounter";
import ApplicationProcess from "@/app/pages/BecomeASalesPartner/ApplicationProcess";
import SalesPartnerSection from "@/app/pages/BecomeASalesPartner/SalesPartnerSection";
import TourReview from "@/app/components/TourReview";
import Faq from "@/app/components/Faq";

export const metadata = {
  title:
    "Become Our Sales Partner - Explore Best Travel Plans | My Travel Site",
  description:
    "Discover and book the best tour packages. Choose from top destinations and customize your travel plan easily.",
};

const BecomeASalesPartnerPage = () => {
  return (
    <>
      <BecomeASalesPartner />
      <PartnerSelection />
      <ExperienceCounter />
      <ApplicationProcess />
      <SalesPartnerSection />
      <TourReview />
      <Faq />
    </>
  );
};

export default BecomeASalesPartnerPage;
