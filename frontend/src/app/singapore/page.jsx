import React from "react";
import SignapurVisa from "@/app/pages/SignapurVisa/SignapurVisa";
import Info from "@/app/pages/SignapurVisa/Info";
import VisaInfo from "@/app/pages/SignapurVisa/VisaInfo";
import SingapurTourPackages from "@/app/pages/SignapurVisa/SingaporeTourPackages";

export const metadata = {
  title: "Singapore - Explore Best Travel Plans | My Travel Site",
  description:
    "Discover and book the best tour packages. Choose from top destinations and customize your travel plan easily.",
};

const SignapurVisaPage = () => {
  return (
    <>
      <SignapurVisa />
      <Info />
      <VisaInfo />
      <SingapurTourPackages />
    </>
  );
};

export default SignapurVisaPage;
