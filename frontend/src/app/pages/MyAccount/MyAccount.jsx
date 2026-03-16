"use client";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import MyProfile from "./MyProfile";

const MyAccount = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Blue Header */}
      <div className="bg-blue-900 h-40 md:h-60"></div>

      {/* Main Layout */}
      <div className="max-w-6xl mx-auto -mt-16 md:-mt-20 flex flex-col md:flex-row gap-6 px-4">
        {/* Sidebar (hidden on mobile, visible on md+) */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full">
          <MyProfile />
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
