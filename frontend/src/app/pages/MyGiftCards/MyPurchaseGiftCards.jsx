"use client";
import React, { useState } from "react";
import { Check } from "lucide-react";

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

const MyPurchaseGiftCards = () => {
  const [selected, setSelected] = useState(null);
  const [filteredCards] = useState(giftCards);

  return (
    <div className="bg-white border border-gray-300 p-4 rounded-lg mb-4">
      {/* Gift Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4">
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
            <p className="text-xs text-center py-2 font-medium text-gray-800">
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
  );
};

export default MyPurchaseGiftCards;
