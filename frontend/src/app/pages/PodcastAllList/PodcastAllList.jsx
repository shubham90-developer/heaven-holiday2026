"use client";
import Link from "next/link";
import React, { useState } from "react";

const PodcastAllList = () => {
  const podcast = {
    id: 1,
    title: "5 Minute Travel Tips with Neil Patil",
    language: "English",
    image: "/assets/img/podcast/1.jpg",
    description: `Welcome to 5-Minute Travel Tips with Neil Patil, your friendly and caring companion for all things travel! 
    Hosted by the seasoned traveller and Heaven Holiday's co-founder Neil Patil, this bite-sized podcast shares Neil's travel experiences and the best tips, hacks, and insights he's gathered over the years.`,
    episodes: [
      {
        number: 1,
        title: "5 Wonders That Keep Pulling Me to Japan",
        duration: "10:45 min",
        views: 52,
        date: "09 Jul, 2025",
        thumbnail: "/assets/img/podcast/1.jpg",
      },
      {
        number: 2,
        title: "The Tapas Effect: Tiny Bites, Giant Culture",
        duration: "11:38 min",
        views: 29,
        date: "01 Jul, 2025",
        thumbnail: "/assets/img/podcast/1.jpg",
      },
    ],
  };

  const [search, setSearch] = useState("");

  const filteredEpisodes = podcast.episodes.filter((ep) =>
    ep.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      {/* 🔵 Curved Background */}
      <div className="absolute top-0 left-0 w-full h-64 bg-blue-800 rounded-b-[80px]"></div>

      <div className="relative max-w-6xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-6 bg-white p-6 rounded-lg shadow relative z-10">
          {/* Podcast Image */}
          <div className="w-full md:w-1/4">
            <img
              src={podcast.image}
              alt={podcast.title}
              className="rounded-lg shadow-md w-full"
            />
          </div>

          {/* Podcast Info */}
          <div className="w-full md:w-3/4">
            <span className="mt-2 mb-4 inline-block px-3 py-1 bg-blue-200 text-xs font-medium rounded-full">
              {podcast.language}
            </span>
            <h1 className="text-2xl font-bold mb-3">{podcast.title}</h1>
            <p className="text-gray-700 text-sm leading-relaxed">
              {podcast.description}
            </p>
          </div>
        </div>

        {/* Episodes Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-8 mb-4 gap-3 relative z-10">
          <h2 className="text-lg font-semibold">
            {podcast.episodes.length} Episodes{" "}
            <span className="text-gray-500 text-sm ml-1">
              Showing 1 - {filteredEpisodes.length} of {podcast.episodes.length}
            </span>
          </h2>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search Episode"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded px-3 py-1 text-sm w-48 focus:ring focus:ring-blue-300"
            />
            <select className="border rounded px-3 py-1 text-sm">
              <option value="latest">Sort by: Latest</option>
              <option value="oldest">Sort by: Oldest</option>
              <option value="popular">Sort by: Popular</option>
            </select>
          </div>
        </div>

        {/* Episodes List */}
        <div className="space-y-4 relative z-10">
          {filteredEpisodes.map((ep) => (
            <div
              key={ep.number}
              className="flex items-center gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition"
            >
              {/* Thumbnail */}
              <div className="relative">
                <img
                  src={ep.thumbnail}
                  alt={ep.title}
                  className="w-16 h-16 rounded-md"
                />
                <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xs rounded-md">
                  ▶
                </button>
              </div>

              {/* Episode Info */}
              <Link href={`/podcast/podcast-details`} className="flex-1">
                <h3 className="font-medium text-sm">{ep.title}</h3>
                <div className="text-xs text-gray-500 flex gap-3 mt-1">
                  <span className="text-black  text-xs">Ep: {ep.number}</span>
                  <span className="text-black  text-xs">{ep.duration}</span>
                  <span className="text-black  text-xs">{ep.views} views</span>
                  <span className="text-black  text-xs">{ep.date}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PodcastAllList;
