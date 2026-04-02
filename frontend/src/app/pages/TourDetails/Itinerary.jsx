"use client";
import { useState } from "react";
import {
  FaBalanceScale,
  FaEnvelope,
  FaPrint,
  FaWhatsapp,
} from "react-icons/fa";
import TourActions from "./TourActions";
import TourDetailsTabs from "./TourDetailsTabs";
import { MapPin, Minus, Plus, Download } from "lucide-react";
const Itinerary = ({
  itinerary = [],
  title,
  subtitle,
  route,
  days,
  nights,
}) => {
  const [openIndex, setOpenIndex] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [allExpanded, setAllExpanded] = useState(false);
  const toggleDay = (index) => {
    if (allExpanded) {
      setAllExpanded(false);
      setOpenIndex(index);
    } else {
      setOpenIndex(openIndex === index ? null : index);
    }
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
          day: item.day,
          date: formatDate(item.date),
          title: item.title,
          content: item.activity,
          cities: item.title
            .split(/\bto\b/i)
            .map((c) => c.trim())
            .filter(Boolean),
        }))
      : [];
  // Strip HTML tags for display
  const stripHtml = (html) => {
    if (!html) return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const downloadPDF = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();

    // Header
    doc.setFillColor(30, 58, 138);
    doc.rect(0, 0, 210, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(title || "Tour Itinerary", 14, 14);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(subtitle || "", 14, 22);

    // Info bar
    doc.setFillColor(219, 234, 254);
    doc.rect(0, 30, 210, 12, "F");
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`Route: ${route || ""}`, 14, 38);
    doc.text(`Days: ${days || ""} | Nights: ${nights || ""}`, 150, 38);

    let y = 50;

    itineraryData.forEach((item, index) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      // Circle badge
      doc.setFillColor(30, 58, 138);
      doc.circle(18, y + 4, 5, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text(`${index + 1}`, index + 1 < 10 ? 16 : 14, y + 6);

      // Day box
      doc.setFillColor(239, 246, 255);
      doc.rect(25, y, 175, 14, "F");
      doc.setTextColor(30, 58, 138);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(`${item.day}`, 28, y + 5);
      doc.setFontSize(9);
      doc.text(`${item.title}`, 28, y + 11);
      y += 18;

      // Activity
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(stripHtml(item.content), 170);
      doc.text(lines, 28, y);
      y += lines.length * 4.5 + 8;

      // Divider
      doc.setDrawColor(200, 200, 200);
      doc.line(14, y, 196, y);
      y += 6;
    });

    // Footer
    doc.setFillColor(30, 58, 138);
    doc.rect(0, 285, 210, 15, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text("A Heaven Holiday", 14, 294);

    doc.save(`${title || "itinerary"}.pdf`);
  };

  return (
    <section id="itinerary" className="min-h-screen p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Itinerary <span className="text-gray-500 text-xs">(Day Wise)</span>
        </h2>

        {/* Wrap both buttons together */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setAllExpanded(!allExpanded);
              setOpenIndex(null);
            }}
            className="text-blue-800 text-sm font-medium hover:underline"
          >
            {allExpanded ? "Hide All Days" : "View All Days"}
          </button>

          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 bg-blue-800 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-900"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { val: days, lbl: "Days" },
          { val: nights, lbl: "Nights" },
          { val: itinerary.length, lbl: "Stops" },
          { val: formatDate(itinerary[0]?.date), lbl: "Departure" },
        ].map((s) => (
          <div key={s.lbl} className="bg-gray-50 rounded-lg px-3 py-2">
            <div className="text-lg font-medium text-gray-800">{s.val}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">{s.lbl}</div>
          </div>
        ))}
      </div>
      <div>
        <div className="flex flex-col gap-3">
          {itineraryData.map((item, index) => {
            const isOpen = allExpanded || openIndex === index;

            return (
              <div
                key={index}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className={`flex border rounded-xl overflow-hidden cursor-pointer transition-all ${
                  isOpen
                    ? "border-blue-800 border-[1.5px]"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                {/* LEFT STUB */}
                <div className="w-16 flex-shrink-0 bg-blue-50 border-r-2 border-dashed border-blue-200 flex flex-col items-center justify-center py-4 gap-1">
                  <span className="text-2xl font-medium text-blue-900 leading-none">
                    {String(item.day).padStart(2, "0")}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-blue-400">
                    Day
                  </span>
                  <span className="text-[10px] text-blue-400 font-medium mt-1">
                    {item.date}
                  </span>
                </div>

                {/* RIGHT BODY */}
                <div className="flex-1 px-4 py-3 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-1 flex-wrap mt-1">
                        {item.cities.map((city, ci) => (
                          <span key={ci} className="flex items-center gap-1">
                            <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                              {city}
                            </span>
                            {ci < item.cities.length - 1 && (
                              <span className="text-gray-400 text-xs">›</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Chevron */}
                    <div
                      className={`w-4 h-4 border-r-2 border-b-2 border-gray-400 transition-transform flex-shrink-0 mt-1 ${
                        isOpen ? "rotate-[225deg]" : "-rotate-45"
                      }`}
                    />
                  </div>

                  {/* Expanded Activity */}
                  {isOpen && (
                    <div className="mt-3 pt-3 border-t border-dashed border-gray-200 text-sm text-gray-600 leading-relaxed">
                      {stripHtml(item.content)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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
