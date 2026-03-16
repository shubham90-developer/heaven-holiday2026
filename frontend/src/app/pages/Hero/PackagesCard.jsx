import React from "react";
import Link from "next/link";

const packages = [
  {
    id: 1,
    title: "India packages",
    img: "/assets/img/packages/1.webp",
    link: "/tour-list",
  },
  {
    id: 2,
    title: "World packages",
    img: "/assets/img/packages/2.avif",
    link: "/tour-list",
  },
  {
    id: 3,
    title: "All packages",
    img: "/assets/img/packages/3.avif",
    link: "/tour-list",
  },
];

const PackagesCard = () => {
  return (
    <section className="py-12 bg-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <Link
              key={pkg.id}
              href={pkg.link}
              className="relative rounded-lg overflow-hidden group shadow-lg"
            >
              {/* Background Image */}
              <img
                src={pkg.img}
                alt={pkg.title}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Title Overlay */}
              <div className="absolute bottom-4 left-1/4 -translate-x-1/2">
                <span className="bg-white px-4 py-2 text-gray-800 text-sm font-medium rounded shadow">
                  {pkg.title}
                </span>
              </div>

              {/* Optional Overlay on Hover */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition"></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PackagesCard;
