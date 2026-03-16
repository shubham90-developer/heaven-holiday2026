"use client";
import { useState } from "react";
import { MapPin, Minus, Plus } from "lucide-react";
import {
  FaBalanceScale,
  FaEnvelope,
  FaPrint,
  FaWhatsapp,
} from "react-icons/fa";
import TourActions from "./TourActions";
import TourDetailsTabs from "./TourDetailsTabs";

const Itinerary = ({ itinerary = [] }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const toggleDay = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });
  };

  // Use provided itinerary or fallback to default
  const itineraryData =
    itinerary && itinerary.length > 0
      ? itinerary.map((item) => ({
          day: `Day ${item.day} | ${formatDate(item.date)}`,
          title: item.title,
          content: item.activity,
        }))
      : [];

  // Strip HTML tags for display
  const stripHtml = (html) => {
    if (!html) return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <section id="itinerary" className="min-h-screen p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Itinerary <span className="text-gray-500 text-xs">(Day Wise)</span>
      </h2>
      <div>
        <div className="space-y-6">
          {itineraryData.map((item, index) => (
            <div key={index} className="relative pl-12">
              {/* Timeline Line (hide on last child) */}
              <div className="absolute left-5 top-2 bottom-0 w-px border-l-2 border-dashed border-gray-300 last:hidden"></div>

              {/* Pin icon */}
              <div className="absolute left-1 top-2 z-10">
                <div className="w-8 h-8 rounded-full border-2 border-blue-800 flex items-center justify-center bg-white">
                  <MapPin className="w-4 h-4 text-blue-800" />
                </div>
              </div>

              {/* Collapsible Card */}
              <div>
                <button
                  className="w-full flex justify-between items-center p-4 text-left cursor-pointer"
                  onClick={() => toggleDay(index)}
                >
                  <div>
                    <p className="text-sm text-gray-500">{item.day}</p>
                    <p className="text-base font-medium text-gray-800">
                      {item.title}
                    </p>
                  </div>
                  {openIndex === index ? (
                    <Minus className="text-gray-600" />
                  ) : (
                    <Plus className="text-gray-600" />
                  )}
                </button>

                {openIndex === index && (
                  <div className="p-4 border-t text-gray-600 text-sm">
                    {stripHtml(item.content)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* read more  */}
        <div className="bg-blue-50 p-6 rounded-xl mt-6">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">
              Know, before you book
            </h3>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-blue-600 text-sm font-medium hover:underline focus:outline-none"
            >
              {expanded ? "Read Less" : "Read More"}
            </button>
          </div>

          {/* Collapsible content */}
          {expanded && (
            <div className="mt-4 text-gray-700 text-sm leading-relaxed space-y-2">
              <p>
                <strong>Please note:</strong>
              </p>
              <p>
                Airline: On group tours, we generally fly with airlines that are
                group-friendly.
              </p>
              <p>
                Group tours are based on economy class, if you wish to travel by
                Premium Economy / Business Class / First Class, we can arrange
                the same at an additional cost subject to availability.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Itinerary;
