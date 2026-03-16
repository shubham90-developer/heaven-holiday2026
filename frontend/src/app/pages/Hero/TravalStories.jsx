"use client";
import React from "react";
import { Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useGetPodcastsQuery } from "../../../../store/podcasts/podcastApi";

const TravalStories = () => {
  const { data, isLoading, isError } = useGetPodcastsQuery();

  // Loading state
  if (isLoading) {
    return (
      <section className="py-5 bg-gray-100 animate-pulse">
        <div className="max-w-6xl mx-auto px-6">
          {/* Heading Skeleton */}
          <div className="h-6 w-1/2 mx-auto bg-gray-300 rounded mb-3"></div>
          <div className="h-4 w-40 mx-auto bg-gray-200 rounded mb-8"></div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {[...Array(5)].map((_, index) => (
              <div key={index}>
                {/* Image Skeleton */}
                <div className="w-full h-48 bg-gray-300 rounded-lg"></div>

                {/* Episodes + Language Skeleton */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-3 w-16 bg-gray-300 rounded"></div>
                  <div className="h-4 w-8 bg-gray-300 rounded-full"></div>
                </div>

                {/* Title Skeleton */}
                <div className="h-3 bg-gray-300 rounded mt-2 w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded mt-1 w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (isError) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-red-600">
            Failed to load travel stories. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  // Use API data
  const stories = data?.data || [];

  return (
    <section className="py-5 bg-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <h2 className="text-2xl md:text-2xl text-center font-bold mb-3">
          Listen To Our Travel Stories
        </h2>

        {/* Underline Image */}
        <div className="flex justify-center mb-8">
          <img
            src="/assets/img/header-bottom.svg"
            alt="underline"
            className="w-40 md:w-50"
          />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {stories.length > 0 ? (
            stories.map((story) => (
              <Link
                key={story._id || story.id}
                href={`/podcast/${story._id}`}
                className="group block"
              >
                <div className="relative rounded-lg overflow-hidden shadow hover:shadow-lg transition">
                  {/* Image */}
                  <Image
                    src={story.cover || "/assets/img/placeholder.png"}
                    alt={story.title}
                    width={600}
                    height={600}
                    className="w-full h-48 object-cover"
                  />
                  {/* Hover Play Icon */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                    <div className="bg-black/70 p-2 rounded-full">
                      <Play className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* Episodes + Language */}
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                  <span className="text-xs text-black">
                    {story.episodes || 0} Episodes
                  </span>
                  <span className="px-2 py-0.5 bg-blue-300 font-bold text-black rounded-full text-[10px]">
                    {story.lang || "EN"}
                  </span>
                </div>

                {/* Title */}
                <p className="mt-1 text-sm font-medium text-gray-800 line-clamp-2">
                  {story.title?.slice(0, 25) || "Untitled"}...
                </p>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full mt-12">
              No travel stories found.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default TravalStories;
