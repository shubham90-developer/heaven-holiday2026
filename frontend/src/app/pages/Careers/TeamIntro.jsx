"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const TeamIntro = () => {
  return (
    <section className="bg-[#183C8A] py-16">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left Content */}
        <div className="text-center md:text-left max-w-lg">
          <h2 className="text-white text-2xl md:text-3xl mb-10 font-bold leading-snug">
            Get to know the team <br /> you are joining!
          </h2>
          <Link
            href="/our-people"
            className="mt-6 bg-red-700 hover:bg-red-500 text-white font-medium px-6 py-2 rounded-md transition"
          >
            Our People
          </Link>
        </div>

        {/* Right Image */}
        <div className="flex justify-center md:justify-end">
          <Image
            src="/assets/img/careers/our-people.svg" // replace with your actual image path
            alt="Team illustration"
            width={400}
            height={250}
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default TeamIntro;
