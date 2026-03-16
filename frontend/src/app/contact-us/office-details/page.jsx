import OfficeDetails from "@/app/pages/OfficeDetails/OfficeDetails";
import { Suspense } from "react";

export const metadata = {
  title: "Office Details - Explore Best Travel Plans | My Travel Site",
  description:
    "Discover and book the best tour packages. Choose from top destinations and customize your travel plan easily.",
};

const OfficeDetailspage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OfficeDetails />
    </Suspense>
  );
};

export default OfficeDetailspage;
