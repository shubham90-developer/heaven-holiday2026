"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react"; // or any icon lib
import React from "react";

const Breadcrumb = ({ items }) => {
  return (
    <section className="bg-white py-4 text-xs">
      <div className="max-w-6xl mx-auto px-6 lg:px-0">
        <nav aria-label="breadcrumb" className="text-sm ">
          <ol className="flex items-center text-gray-600">
            {items.map((item, index) => (
              <li key={index} className="flex items-center">
                {item.href ? (
                  <Link
                    href={item.href}
                    className="hover:text-blue-600 transition-colors text-xs"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-gray-800 text-xs">
                    {item.label}
                  </span>
                )}

                {index < items.length - 1 && (
                  <ChevronRight className="mx-2 w-4 h-4 text-gray-400" />
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
};

export default Breadcrumb;
