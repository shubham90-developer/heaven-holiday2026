"use client";

import Breadcrumb from "@/app/components/Breadcum";
import React, { useState } from "react";
import { useGetAboutUsQuery } from "../../../../store/aboutUsApi/aboutUsApi";

const AboutUs = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "About Us", href: null },
  ];
  function stripHtmlTags(input) {
    const div = document.createElement("div");
    div.innerHTML = input;
    return div.textContent || div.innerText || "";
  }
  const { data, error, isLoading } = useGetAboutUsQuery();
  if (isLoading) {
    return <p>loading</p>;
  }
  if (error) {
    return <p>error while fetching data</p>;
  }
  const response = data?.data;
  const description = stripHtmlTags(response?.description);
  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <section className="py-10 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          {/* Left: Text */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {response?.title || ""}
            </h2>
            <p className="text-gray-700 mb-2">
              {description ||
                "Lakshya - Bharat ki Sabse Behtareen Travel Company!"}
            </p>
          </div>

          {/* Right: Video */}
          <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg">
            {!isPlaying ? (
              <>
                {/* Thumbnail */}
                <img
                  src={response?.thumbnail || ""}
                  alt="Heaven Holiday Corporate AV"
                  className="w-full h-full object-cover"
                />
                {/* Play Button Overlay */}
                <button
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition cursor-pointer"
                >
                  <span className="flex items-center justify-center w-20 h-20 rounded-full border-2 border-white bg-black/40 hover:bg-black/60 transition">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </button>
              </>
            ) : (
              <iframe
                className="w-full h-full"
                src={response?.video}
                title="Heaven Holiday Corporate AV"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                autoPlay
              ></iframe>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
