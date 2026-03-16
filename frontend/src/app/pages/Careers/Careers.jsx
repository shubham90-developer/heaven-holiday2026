"use client";

import Breadcrumb from "@/app/components/Breadcum";
import Link from "next/link";
import React, { useState } from "react";
import { useGetCareersQuery } from "../../../../store/careers/careersHeaderApi";
const Careers = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Careers", href: null },
  ];
  const { data, loading, error } = useGetCareersQuery();
  if (loading) {
    return <p>loading</p>;
  }
  if (error) {
    return <p>error</p>;
  }
  const responce = data?.data;

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <section className="py-10 bg-blue-900">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          {/* Left: Text */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              {responce?.title || ""}
            </h2>
            <p
              className="text-white mb-4"
              dangerouslySetInnerHTML={{
                __html: responce?.description || "",
              }}
            ></p>
            <Link
              href={responce?.buttonLink || "#"}
              className="text-black hover:underline bg-yellow-300 px-3 py-2 text-xs rounded-xl font-bold"
            >
              {responce?.buttonText}
            </Link>
          </div>

          {/* Right: Video */}
          <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg">
            {!isPlaying ? (
              <>
                {/* Thumbnail */}
                <img
                  src={responce?.videoThumbnail}
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
                src={responce?.videoUrl}
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

export default Careers;
