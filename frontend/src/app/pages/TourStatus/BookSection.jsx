"use client";
import Image from "next/image";
import Link from "next/link";

const BookSection = () => {
  return (
    <section
      className="relative w-full bg-white py-16"
      style={{
        backgroundImage: "url(/assets/img/tour-status/2.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-10 px-6 md:px-12">
        {/* Left Illustration */}
        <div className="relative w-full md:w-1/2 flex justify-center md:justify-start"></div>

        {/* Right Content */}
        <div className="text-center md:text-left md:w-1/2">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Book before it's sold out!
          </h2>
          <p className="text-gray-600 mb-6">
            As seats fill, prices increase! India is travelling, so why aren’t
            you? Book your dream holiday today.
          </p>
          <Link
            href="/tour-list"
            className="bg-red-700 text-xs cursor-pointer hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-md transition"
          >
            Book Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BookSection;
