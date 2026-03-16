"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Phone,
  ChevronDown,
  ChevronUp,
  Clock,
  Mail,
  PhoneCall,
  PhoneIncoming,
  ChevronRightSquareIcon,
  MoveRight,
  ArrowRightCircle,
} from "lucide-react";
import Link from "next/link";
import { useGetSettingsQuery } from "store/settings/settingsApi";

const PhoneDropdown = () => {
  const { data, isLoading, error } = useGetSettingsQuery(undefined);
  const settings = data?.data;

  const numbers = [
    settings?.tollFree1,
    settings?.tollFree2,
    settings?.callUs1,
    settings?.callUs2,
    settings?.nriWithinIndia,
    settings?.nriOutsideIndia,
  ].filter(Boolean);

  const [index, setIndex] = useState(0);
  const [showPhoneInfo, setShowPhoneInfo] = useState(false);
  const timeoutRef = useRef(null);

  // Auto cycle numbers
  useEffect(() => {
    if (numbers.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % numbers.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [numbers.length]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowPhoneInfo(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setShowPhoneInfo(false), 400);
  };

  const formatTime = (time) => {
    if (!time) return "";
    const [hourStr] = time.split(":");
    const hour = parseInt(hourStr, 10);
    return hour >= 12
      ? `${hour === 12 ? 12 : hour - 12}PM`
      : `${hour === 0 ? 12 : hour}AM`;
  };

  if (isLoading) return <p>isLoading</p>;
  if (error) return <p>error</p>;

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Button */}
      <button className="flex items-center gap-3 bg-gray-600 hover:bg-gray-600 rounded-full pl-2 pr-3 py-1.5 text-xs font-semibold cursor-pointer overflow-hidden transition-colors duration-300">
        <div className="flex items-center justify-center w-5 h-5 bg-blue-700 rounded-full">
          <Phone className="w-2 h-3 text-white" />
        </div>

        {/* Animated Numbers */}
        <div className="relative w-25 h-5 overflow-hidden">
          <div
            key={index}
            className="absolute inset-0 flex items-center text-white animate-slide-fade"
          >
            {numbers[index]}
          </div>
        </div>

        {showPhoneInfo ? (
          <ChevronUp className="w-4 h-4 text-white" />
        ) : (
          <ChevronDown className="w-4 h-4 text-white" />
        )}
      </button>

      {/* Dropdown Panel */}
      <div
        className={`absolute z-30 right-0 mt-3 w-80 bg-white text-gray-900 rounded-xl shadow-2xl border border-gray-100 transition-all duration-500 ease-in-out ${
          showPhoneInfo
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-3 pointer-events-none"
        }`}
      >
        <div className="p-5 space-y-4 text-sm leading-relaxed">
          <div>
            <p className="font-semibold flex items-center gap-2 text-gray-700">
              <Phone className="w-4 h-4" /> Toll Free Numbers
            </p>
            <div className="flex flex-col gap-1">
              <Link
                href={`tel:${settings?.tollFree1?.replace(/\s/g, "")}`}
                className="font-bold text-black hover:text-blue-900"
              >
                {settings?.tollFree1}
              </Link>
              <Link
                href={`tel:${settings?.tollFree2?.replace(/\s/g, "")}`}
                className="font-bold text-black hover:text-blue-900"
              >
                {settings?.tollFree2}
              </Link>
            </div>
          </div>

          <div>
            <p className="font-semibold flex items-center gap-2 text-gray-700">
              <PhoneCall className="w-4 h-4" /> Call us on
            </p>
            <div className="flex flex-col gap-1">
              <Link
                href={`tel:${settings?.callUs1?.replace(/\s/g, "")}`}
                className="font-bold text-black hover:text-blue-900"
              >
                {settings?.callUs1}
              </Link>
              <Link
                href={`tel:${settings?.callUs2?.replace(/\s/g, "")}`}
                className="font-bold text-black hover:text-blue-900"
              >
                {settings?.callUs2}
              </Link>
            </div>
          </div>

          <div>
            <p className="font-semibold flex items-center gap-2 text-gray-700">
              <PhoneCall className="w-4 h-4" /> Call us on Foreign Nationals /
              NRIs
            </p>
            <p className="text-xs mx-3 text-black">
              Within India:{" "}
              <Link
                href={`tel:${settings?.nriWithinIndia?.replace(/\s/g, "")}`}
                className="font-bold text-sm text-black hover:text-blue-900"
              >
                {settings?.nriWithinIndia}
              </Link>
            </p>
            <p className="text-xs mx-3 text-black">
              Outside India:{" "}
              <Link
                href={`tel:${settings?.nriOutsideIndia?.replace(/\s/g, "")}`}
                className="font-bold text-sm text-black hover:text-blue-900"
              >
                {settings?.nriOutsideIndia}
              </Link>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <p>
              Business hours:{" "}
              <span className="font-bold text-gray-800">
                {formatTime(settings?.businessHoursFrom)} -{" "}
                {formatTime(settings?.businessHoursTo)}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-500" />
            <a
              href={`mailto:${settings?.supportEmail}`}
              className="text-blue-600 font-medium hover:underline hover:text-blue-900"
            >
              {settings?.supportEmail}
            </a>
          </div>

          <div className="border-t border-gray-200 pt-2">
            <Link
              href="/contact-us"
              className="flex items-center gap-2 text-blue-600 font-bold hover:underline"
            >
              Nearest {settings?.companyName} office{" "}
              <span>
                <ArrowRightCircle />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Slide + Fade animation */}
      <style jsx>{`
        @keyframes slideFade {
          0% {
            opacity: 0;
            transform: translateY(100%);
          }
          30% {
            opacity: 1;
            transform: translateY(0);
          }
          70% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-100%);
          }
        }
        .animate-slide-fade {
          animation: slideFade 4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default PhoneDropdown;
