import React from "react";
import CsrPolicy from "@/app/pages/CsrPolicy/CsrPolicy";
import Preamble from "@/app/pages/CsrPolicy/Preamble";
import Management from "@/app/pages/CsrPolicy/Management";
import PurposePolicy from "@/app/pages/CsrPolicy/Purpose";
import Collpse from "@/app/pages/CsrPolicy/Collapse";

export const metadata = {
  title: "CSR Policy - Explore Best Travel Plans | My Travel Site",
  description:
    "Discover and book the best tour packages. Choose from top destinations and customize your travel plan easily.",
};

const CsrPolicyPage = () => {
  return (
    <>
      <CsrPolicy />
      <Preamble />
      <Management />
      <PurposePolicy />
      <Collpse />
    </>
  );
};

export default CsrPolicyPage;
