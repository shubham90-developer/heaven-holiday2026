"use client";
import { useState } from "react";
import { CheckCircle } from "lucide-react";

const TourInformation = ({ tourData }) => {
  const [activeTab, setActiveTab] = useState("inclusions");

  // Helper function to parse HTML content and extract list items
  const parseHTMLToList = (htmlString) => {
    if (!htmlString) return [];

    // Create a temporary div to parse HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;

    // Extract text from li elements
    const listItems = tempDiv.querySelectorAll("li");
    const items = Array.from(listItems).map((li) => li.textContent.trim());

    return items.length > 0 ? items : [];
  };

  // Get data from tourData or use defaults
  const inclusions = tourData?.tourInclusions
    ? parseHTMLToList(tourData.tourInclusions)
    : [];

  const exclusions = tourData?.tourExclusions
    ? parseHTMLToList(tourData.tourExclusions)
    : [];

  const preparation = tourData?.tourPrepartion
    ? parseHTMLToList(tourData.tourPrepartion)
    : [];

  const renderList = (items) => (
    <ul className="space-y-3">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start text-gray-700">
          <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <section className="py-10 lg:px-0 px-4" id="info">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800">Tour Information</h2>
        <p className="text-gray-500 italic mb-6">
          Read this to prepare for your tour in the best way!
        </p>

        {/* Tabs Header */}
        <div className="flex bg-blue-50 rounded-t-lg overflow-hidden">
          <button
            onClick={() => setActiveTab("inclusions")}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "inclusions"
                ? "bg-blue-800 text-white"
                : "text-gray-700 hover:bg-blue-100"
            }`}
          >
            Tour Inclusions
          </button>
          <button
            onClick={() => setActiveTab("exclusions")}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "exclusions"
                ? "bg-blue-800 text-white"
                : "text-gray-700 hover:bg-blue-100"
            }`}
          >
            Tour Exclusions
          </button>
          <button
            onClick={() => setActiveTab("preparation")}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "preparation"
                ? "bg-blue-800 text-white"
                : "text-gray-700 hover:bg-blue-100"
            }`}
          >
            Advance Preparation
          </button>
        </div>

        {/* Tabs Content */}
        <div className="border border-t-0 rounded-b-lg p-6 bg-white">
          {activeTab === "inclusions" && renderList(inclusions)}
          {activeTab === "exclusions" && renderList(exclusions)}
          {activeTab === "preparation" && renderList(preparation)}
        </div>
      </div>
    </section>
  );
};

export default TourInformation;
