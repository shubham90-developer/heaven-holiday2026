import React from "react";
import AboutUs from "@/app/pages/AboutUs/AboutUs";
import Counter from "@/app/components/Counter";
import Team from "@/app/pages/AboutUs/Team";
import Principles from "@/app/pages/AboutUs/Principles";
import WhyVeenaWorld from "@/app/pages/AboutUs/WhyVeenaWorld";
import LifeAtVeenaWorld from "@/app/pages/AboutUs/LifeAtVeenaWorld";
import JoinFamilySection from "@/app/pages/AboutUs/JoinFamilySection";
import TourReview from "@/app/components/TourReview";

export const metadata = {
  title: "About Us - Explore Best Travel Plans | My Travel Site",
  description:
    "Discover and book the best tour packages. Choose from top destinations and customize your travel plan easily.",
};

const AboutUspage = () => {
  return (
    <>
      <AboutUs />
      <Counter />
      <Team />
      <Principles />
      <WhyVeenaWorld />
      <LifeAtVeenaWorld />
      <JoinFamilySection />
      <TourReview />
    </>
  );
};

export default AboutUspage;
