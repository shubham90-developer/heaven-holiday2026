"use client";
import React, { useEffect, useState } from "react";

const sections = [
  { id: "itinerary", label: "Itinerary" },
  { id: "details", label: "Tour Details" },
  { id: "info", label: "Tour Information" },
  { id: "know", label: "Need to Know" },
  { id: "policy", label: "Policy & Terms" },
  { id: "upgrades", label: "Upgrades" },
];

const StickyNavbar = () => {
  const [active, setActive] = useState("itinerary");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // offset for sticky height
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActive(section.id);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="sticky top-0 bg-white shadow z-20 border-b">
      <nav className="max-w-6xl mx-auto flex space-x-6 px-4 py-3 text-sm font-medium overflow-x-auto">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => handleClick(section.id)}
            className={`whitespace-nowrap ${
              active === section.id
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            {section.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default StickyNavbar;
