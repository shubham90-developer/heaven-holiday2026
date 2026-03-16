import React from "react";
import GiftSteps from "./GiftSteps";
import GiftCardGrid from "./GiftCardGrid";

const GiftCards = () => {
  return (
    <section className="py-10 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6 p-6">
          <GiftSteps />
          <GiftCardGrid />
        </div>
      </div>
    </section>
  );
};

export default GiftCards;
