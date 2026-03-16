"use client";
import React, { useState } from "react";
import { Check } from "lucide-react";
import TermsConditions from "./TermsConditions";
import Faq from "@/app/components/Faq";
import Info from "./Info";

const categories = [
  { label: "All Gift Cards (25)", value: "all" },
  { label: "Festivals (11)", value: "Festivals" },
  { label: "Special Occasion (8)", value: "Special Occasion" },
  { label: "Corporate & Business (5)", value: "Corporate & Business" },
];

const giftCards = [
  {
    id: 1,
    title: "All Gift Cards",
    category: "All Occasion",
    img: "/assets/img/gift-cards/1.webp",
  },
  {
    id: 2,
    title: "Wedding Wishes",
    category: "Special Occasion",
    img: "/assets/img/gift-cards/2.avif",
  },
  {
    id: 3,
    title: "Birthday",
    category: "Special Occasion",
    img: "/assets/img/gift-cards/3.avif",
  },
  {
    id: 4,
    title: "Diwali",
    category: "Festivals",
    img: "/assets/img/gift-cards/4.avif",
  },
  {
    id: 5,
    title: "Corporate Gifting",
    category: "Corporate & Business",
    img: "/assets/img/gift-cards/5.avif",
  },
  {
    id: 6,
    title: "Wedding Wishes",
    category: "Special Occasion",
    img: "/assets/img/gift-cards/6.webp",
  },
  {
    id: 7,
    title: "Wedding Wishes",
    category: "Special Occasion",
    img: "/assets/img/gift-cards/7.webp",
  },
  {
    id: 8,
    title: "Wedding Wishes",
    category: "Special Occasion",
    img: "/assets/img/gift-cards/8.avif",
  },
];

const GiftCardGrid = () => {
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  // filter logic
  const filteredCards =
    activeTab === "all"
      ? giftCards
      : giftCards.filter((c) => c.category === activeTab);

  // find selected card object
  const selectedCard = giftCards.find((c) => c.id === selected);

  return (
    <div className="md:w-3/4 w-full">
      {/* banner */}
      <div className="bg-[#8719be] text-white p-4 rounded-lg mb-4">
        <p className="text-xl font-semibold">Heaven Holiday Gift Cards</p>
        <p className="text-md mt-2">
          Perfect for every occasion – birthdays, weddings, retirements... Share
          the joy of travel and create lasting memories.
        </p>
      </div>

      <div className="bg-white border border-gray-300 p-4 rounded-lg mb-4">
        <div className="mb-5">
          <p className="text-black font-bold">Choose an Occasion</p>
          <p className="text-sm text-black">
            Tip: You can choose an occasion or just continue with the
            All-Occasion Gift card selected below
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-4 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveTab(cat.value)}
              className={`px-3 py-1 rounded-full text-sm transition ${
                activeTab === cat.value
                  ? "bg-blue-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gift Card Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              onClick={() => setSelected(card.id)}
              className={`relative cursor-pointer border rounded-lg overflow-hidden hover:shadow-md transition ${
                selected === card.id ? "ring-2 ring-green-600" : ""
              }`}
            >
              <img
                src={card.img}
                alt={card.title}
                className="w-full h-32 object-cover"
              />
              <p className="text-xs text-center py-2 font-medium">
                {card.title}
              </p>

              {selected === card.id && (
                <div className="absolute top-2 right-2 bg-green-600 text-white p-1 rounded-full">
                  <Check size={16} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <TermsConditions />
      <Faq />
      <Info />

      {/* Bottom Button */}
      <div className="mt-6 sticky bottom-0 bg-gray-900 p-4 border-t border-gray-200">
        <button
          disabled={!selectedCard}
          className="w-full bg-red-700 hover:bg-red-500 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition"
        >
          {selectedCard
            ? `Buy ${selectedCard.title} Gift Card`
            : "Select a Gift Card"}
        </button>
      </div>
    </div>
  );
};

export default GiftCardGrid;
