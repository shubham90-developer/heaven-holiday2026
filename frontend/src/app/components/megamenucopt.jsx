"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiPhone, FiUser, FiSearch } from "react-icons/fi";
import MegaMenuIndia from "./indiamenu";
import WorldMenu from "./worldmenu";
import SpecialityTours from "./specialitytours";
import CustomizedHolidays from "./customizedholidays";
import Inbound from "./inbound";
import Forex from "./forex";
export default function MainNavbar() {
  const [open, setOpen] = useState(false);
  const [indiaOpen, setIndiaOpen] = useState(false);
  const [worldOpen, setWorldOpen] = useState(false);
  const [specialityOpen, setSpecialityOpen] = useState(false);
  const [customizedOpen, setCustomizedOpen] = useState(false);
  const [inboundOpen, setInboundOpen] = useState(false);
  const [forexOpen, setForexOpen] = useState(false);
  const menu = [
    { name: "India", mega: true },
    { name: "World", mega: true },
    { name: "Speciality Tours", mega: true },
    { name: "Customized Holidays", mega: true },
    { name: "Corporate Travel" },
    { name: "Inbound", mega: true },
    { name: "Forex", mega: true },
    { name: "Gift Cards" },
    { name: "Contact Us" },
  ];

  return (
    <header className="w-full relative">
      {/* Bottom Row */}
      <nav
        className={`bg-[#10263e] text-white font-bold text-sm md;text-sm lg:text-sm transition-all py-0
          ${open ? "block" : "hidden"} md:block`}
        onMouseLeave={() => setIndiaOpen(false)}
      >
        <ul className="hidden lg:flex flex-col lg:flex-row lg:justify-center  lg-space-x-5 xl:space-x-4 px-4 lg:px-4 py-2 lg:py-1">
          {menu.map((m) => (
            <li key={m.name} className="relative">
              {m.name === "India" ? (
                // --- INDIA MENU ---
                <>
                  <div
                    onMouseEnter={() => setIndiaOpen(true)}
                    onMouseLeave={() => setIndiaOpen(false)}
                  >
                    <button
                      className={`flex items-center gap-1 px-2 transition-colors cursor-pointer h-10
           ${indiaOpen ? "bg-white text-black" : "hover:text-yellow-400"} `}
                      aria-expanded={indiaOpen}
                    >
                      {m.name}
                      <span className="text-base">▾</span>
                    </button>

                    {indiaOpen && (
                      <div className="absolute left-0 top-full w-full bg-white shadow-lg z-50">
                        <MegaMenuIndia />
                      </div>
                    )}
                  </div>
                </>
              ) : m.name === "World" ? (
                // --- WORLD MENU ---
                <>
                  <div
                    onMouseEnter={() => setWorldOpen(true)}
                    onMouseLeave={() => setWorldOpen(false)}
                  >
                    <button
                      className={`flex items-center gap-1 px-2 transition-colors cursor-pointer h-10 
            ${worldOpen ? "bg-white text-black" : "hover:text-yellow-400"}`}
                      aria-expanded={worldOpen}
                    >
                      {m.name} <span className="text-base">▾</span>
                    </button>

                    {worldOpen && (
                      <div className="absolute left-0 top-full w-full bg-white shadow-lg z-50">
                        <WorldMenu />
                      </div>
                    )}
                  </div>
                </>
              ) : m.name === "Speciality Tours" ? (
                // --- SPECIALITY TOURS MENU ---
                <>
                  <div
                    onMouseEnter={() => setSpecialityOpen(true)}
                    onMouseLeave={() => setSpecialityOpen(false)}
                  >
                    <button
                      className={`flex items-center gap-1 px-2  transition-colors  cursor-pointer h-10
            ${
              specialityOpen ? "bg-white text-black" : "hover:text-yellow-400"
            }`}
                      aria-expanded={specialityOpen}
                    >
                      {m.name} <span className="text-base">▾</span>
                    </button>

                    {specialityOpen && (
                      <div className="absolute left-0 top-full w-full bg-white shadow-lg z-50 ">
                        <SpecialityTours />
                      </div>
                    )}
                  </div>
                </>
              ) : m.name === "Customized Holidays" ? (
                // --- CUSTOMIZED MENU ---
                <>
                  <div
                    onMouseEnter={() => setCustomizedOpen(true)}
                    onMouseLeave={() => setCustomizedOpen(false)}
                  >
                    <button
                      className={`flex items-center gap-1 px-2  transition-colors  cursor-pointer h-10
            ${
              customizedOpen ? "bg-white text-black" : "hover:text-yellow-400"
            }`}
                      aria-expanded={customizedOpen}
                    >
                      {m.name} <span className="text-base">▾</span>
                    </button>

                    {customizedOpen && (
                      <div className="absolute left-0 top-full w-full bg-white shadow-lg z-50 ">
                        <CustomizedHolidays />
                      </div>
                    )}
                  </div>
                </>
              ) : m.name === "Inbound" ? (
                // --- INBOUND MENU ---
                <>
                  <div
                    onMouseEnter={() => setInboundOpen(true)}
                    onMouseLeave={() => setInboundOpen(false)}
                  >
                    <button
                      className={`flex items-center gap-1 px-2 transition-colors  cursor-pointer h-10
            ${inboundOpen ? "bg-white text-black" : "hover:text-yellow-400"}`}
                      aria-expanded={inboundOpen}
                    >
                      {m.name} <span className="text-base">▾</span>
                    </button>

                    {inboundOpen && (
                      <div className="absolute right-96 top-full w-full bg-white shadow-lg z-50 ">
                        <Inbound />
                      </div>
                    )}
                  </div>
                </>
              ) : m.name === "Forex" ? (
                <>
                  <div
                    onMouseEnter={() => setForexOpen(true)}
                    onMouseLeave={() => setForexOpen(false)}
                  >
                    <button
                      className={`flex items-center gap-1 px-2 transition-colors  cursor-pointer h-10
            ${forexOpen ? "bg-white text-black" : "hover:text-yellow-400"}`}
                      aria-expanded={forexOpen}
                    >
                      {m.name} <span className="text-base">▾</span>
                    </button>

                    {forexOpen && (
                      <div className="absolute right-100 top-full w-full bg-white shadow-lg z-50 ">
                        <Forex />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                // --- NORMAL LINK ---
                <Link
                  href="#"
                  className="hover:text-yellow-400 px-2 cursor-pointer h-10 "
                >
                  {m.name}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div
          className={`${
            open ? "block" : "hidden"
          } lg:hidden border-t border-gray-800`}
        >
          <ul className="flex flex-col px-4 py-3 space-y-2">
            {menu.map((m) => (
              <li key={m.name}>
                {m.name === "India" ? (
                  <>
                    <button
                      className="w-full text-left px-2 py-2 rounded flex justify-between items-center hover:text-yellow-400"
                      onClick={() => {
                        setIndiaOpen(!indiaOpen);
                        setWorldOpen(false);
                        setSpecialityOpen(false);
                      }}
                      aria-expanded={indiaOpen}
                    >
                      {m.name}{" "}
                      <span className="text-2xl">{indiaOpen ? "▴" : "▾"}</span>
                    </button>

                    {indiaOpen && (
                      <div className="pl-4 mt-2 border-l border-gray-300">
                        <MegaMenuIndia />
                      </div>
                    )}
                  </>
                ) : m.name === "World" ? (
                  <>
                    <button
                      className="w-full text-left px-2 py-2 rounded flex justify-between items-center hover:text-yellow-400"
                      onClick={() => {
                        setWorldOpen(!worldOpen);
                        setIndiaOpen(false);
                        setSpecialityOpen(false);
                      }}
                      aria-expanded={worldOpen}
                    >
                      {m.name}{" "}
                      <span className="text-2xl">{worldOpen ? "▴" : "▾"}</span>
                    </button>

                    {worldOpen && (
                      <div className="pl-4 mt-2 border-l border-gray-300">
                        <WorldMenu />
                      </div>
                    )}
                  </>
                ) : m.name === "Speciality Tours" ? (
                  <>
                    <button
                      className="w-full text-left px-2 py-2 rounded flex justify-between items-center hover:text-yellow-400"
                      onClick={() => {
                        setSpecialityOpen(!specialityOpen);
                        setIndiaOpen(false);
                        setWorldOpen(false);
                      }}
                      aria-expanded={specialityOpen}
                    >
                      {m.name}{" "}
                      <span className="text-2xl">
                        {specialityOpen ? "▴" : "▾"}
                      </span>
                    </button>

                    {specialityOpen && (
                      <div className="pl-4 mt-2 border-l border-gray-300">
                        <SpecialityTours />
                      </div>
                    )}
                  </>
                ) : m.name === "Customized Holidays" ? (
                  <>
                    <button
                      className="w-full text-left px-2 py-2 rounded flex justify-between items-center hover:text-yellow-400"
                      onClick={() => {
                        setCustomizedOpen(!customizedOpen);
                        setIndiaOpen(false);
                        setWorldOpen(false);
                        setSpecialityOpen(false);
                      }}
                      aria-expanded={customizedOpen}
                    >
                      {m.name}{" "}
                      <span className="text-2xl">
                        {customizedOpen ? "▴" : "▾"}
                      </span>
                    </button>

                    {customizedOpen && (
                      <div className="pl-4 mt-2 border-l border-gray-300">
                        <CustomizedHolidays />
                      </div>
                    )}
                  </>
                ) : m.name === "Inbound" ? (
                  <>
                    <button
                      className="w-full text-left px-2 py-2 rounded flex justify-between items-center hover:text-yellow-400"
                      onClick={() => {
                        setInboundOpen(!inboundOpen);
                        setIndiaOpen(false);
                        setWorldOpen(false);
                        setSpecialityOpen(false);
                        setCustomizedOpen(false);
                      }}
                      aria-expanded={inboundOpen}
                    >
                      {m.name}{" "}
                      <span className="text-2xl">
                        {inboundOpen ? "▴" : "▾"}
                      </span>
                    </button>

                    {inboundOpen && (
                      <div className="pl-4 mt-2 border-l border-gray-300">
                        <Inbound />
                      </div>
                    )}
                  </>
                ) : m.name === "Forex" ? (
                  <>
                    <button
                      className="w-full text-left px-2 py-2 rounded flex justify-between items-center hover:text-yellow-400"
                      onClick={() => {
                        setForexOpen(!forexOpen);
                        setIndiaOpen(false);
                        setWorldOpen(false);
                        setSpecialityOpen(false);
                        setCustomizedOpen(false);
                        setInboundOpen(false);
                      }}
                      aria-expanded={forexOpen}
                    >
                      {m.name}{" "}
                      <span className="text-2xl">{forexOpen ? "▴" : "▾"}</span>
                    </button>

                    {forexOpen && (
                      <div className="pl-4 mt-2 border-l border-gray-300">
                        <Forex />
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href="#"
                    className="block px-2 py-2 rounded hover:text-yellow-400"
                  >
                    {m.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
