"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import MegaMenuIndia from "./indiamenu";
import WorldMenu from "./worldmenu";
import SpecialityTours from "./specialitytours";
import CustomizedHolidays from "./customizedholidays";
import Inbound from "./inbound";
import Forex from "./forex";

export default function MainNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");

  const menu = [
    { name: "India", mega: true, position: "left-0" },
    { name: "World", mega: true, position: "left-0" },
    { name: "Speciality Tours", mega: true, position: "left-0" },
    { name: "Customized Holidays", mega: true, position: "left-0" },
    { name: "Corporate Travel", url: "/corporate-travel" },
    { name: "Inbound", mega: true, position: "right-0" },
    // { name: "Forex", mega: true, position: "right-0" },
    // { name: "Gift Cards", url: "/gift-cards" },
    { name: "Contact Us", url: "/contact-us" },
  ];

  const renderMegaMenu = (name) => {
    switch (name) {
      case "India":
        return <MegaMenuIndia />;
      case "World":
        return <WorldMenu />;
      case "Speciality Tours":
        return <SpecialityTours />;
      case "Customized Holidays":
        return <CustomizedHolidays />;
      case "Inbound":
        return <Inbound />;
      case "Forex":
        return <Forex />;
      default:
        return null;
    }
  };

  return (
    <header className="w-full relative">
      <nav className="bg-[#10263e] text-white font-bold text-sm">
        <div className="max-w-300 mx-auto flex items-center justify-between px-4 py-2">
          {/* Desktop Menu */}
          <ul className="hidden lg:flex w-full justify-between items-center">
            {menu.map((item) => (
              <li key={item.name} className="relative text-center group">
                {item.mega ? (
                  <>
                    <button className="h-10 flex items-center justify-center gap-1 px-3 py-2 transition-colors hover:bg-white hover:text-black">
                      {item.name} <span>▾</span>
                    </button>

                    {/* Dropdown positioned differently per menu */}
                    <div
                      className={`absolute top-full ${item.position} bg-white text-black shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all z-50 min-w-62.5`}
                    >
                      {renderMegaMenu(item.name)}
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.url || "#"}
                    className="w-full h-10 flex items-center justify-center px-3 py-2 transition-colors hover:bg-white hover:text-black"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden text-2xl"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <ul className="lg:hidden flex flex-col px-4 py-2 space-y-1 bg-[#10263e]">
            {menu.map((item) => (
              <li key={item.name} className="border-b border-gray-700">
                {item.mega ? (
                  <>
                    <button
                      className="w-full text-left px-2 py-2 flex justify-between items-center hover:bg-white hover:text-black transition"
                      onClick={() =>
                        setActiveMenu(activeMenu === item.name ? "" : item.name)
                      }
                    >
                      {item.name}
                      <span>{activeMenu === item.name ? "▴" : "▾"}</span>
                    </button>
                    {activeMenu === item.name && (
                      <div className="pl-4 mt-2">
                        {renderMegaMenu(item.name)}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.url || "#"}
                    className="block px-2 py-2 hover:bg-white hover:text-black transition"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
}
