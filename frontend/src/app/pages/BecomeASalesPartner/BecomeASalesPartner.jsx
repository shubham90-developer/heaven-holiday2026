import Breadcrumb from "@/app/components/Breadcum";
import React from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const BecomeASalesPartner = () => {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Become A Sales Partner", href: null },
  ];
  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <section className="bg-[#294992] text-white">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Content */}
          <div className="flex-1">
            {/* Heading */}
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              Become a Heaven Holiday sales partner
            </h1>

            {/* Stats */}
            <p className="text-lg md:text-xl mb-6">
              Come be a part of the ever-growing Heaven Holiday family!
            </p>

            {/* Search Box */}
            <Link
              href="#faq"
              className="border border-white rounded-xl py-2 px-3 text-xs"
            >
              Sales Partner benefits
            </Link>
          </div>

          {/* Right Image */}
          <div className="flex-1 flex justify-center md:justify-end">
            <div className="w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden">
              <Image
                src="/assets/img/become-partner/1.svg" // replace with your image
                alt="Happy Family"
                width={400}
                height={400}
                className="w-full h-[250px] object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BecomeASalesPartner;
