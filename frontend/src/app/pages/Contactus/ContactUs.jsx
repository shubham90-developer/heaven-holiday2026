"use client";
import React from "react";
import OfficeCard from "./OfficeCard";
import RightSidebar from "./RightSidebar";

const Contactuspage = () => {
  return (
    <section className="bg-gray-100">
      {/* 🔹 Blue Header Bar */}
      <div className="bg-blue-900 h-50 flex items-center justify-center">
        <h2 className="text-white font-bold text-xl">
          Find the nearest Heaven Holiday
        </h2>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* 🔹 Main Content */}
        <div className="py-8 px-4 -mt-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT SIDE */}
            <OfficeCard />

            {/* RIGHT SIDE */}
            <RightSidebar />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contactuspage;
