import React from "react";
import Careers from "@/app/pages/Careers/Careers";
import JobCardPage from "@/app/pages/Careers/JobCardPage";
import Excitedtowork from "@/app/pages/Careers/Excitedtowork";
import HowWeHire from "@/app/pages/Careers/HowWeHire";
import TeamIntro from "@/app/pages/Careers/TeamIntro";
import Empowering from "@/app/pages/Careers/Empowering";

export const metadata = {
  title: "Careers - Explore Best Travel Plans | My Travel Site",
  description:
    "Discover and book the best tour packages. Choose from top destinations and customize your travel plan easily.",
};

const CareersPage = () => {
  return (
    <>
      <Careers />
      <JobCardPage />
      <Excitedtowork />
      <HowWeHire />
      <TeamIntro />
      <Empowering />
    </>
  );
};

export default CareersPage;
