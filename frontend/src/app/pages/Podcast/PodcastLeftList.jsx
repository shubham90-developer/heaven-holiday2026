"use client";
import Link from "next/link";
import { useState } from "react";
import { FaPlay } from "react-icons/fa";
import { useGetPodcastsQuery } from "../../../../store/podcasts/podcastApi";

const PodcastLeftList = ({ searchQuery = "" }) => {
  const [selectedPodcast, setSelectedPodcast] = useState(null);

  const {
    data: podcastData,
    isLoading: podcastLoading,
    error: podcastError,
  } = useGetPodcastsQuery();

  if (podcastLoading) {
    return (
      <div className="lg:col-span-2 space-y-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="w-full animate-pulse space-y-2">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            <div className="flex gap-4 mt-2">
              <div className="h-32 w-32 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (podcastError) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-red-600">
            Failed to load data. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  // Filter active podcasts then apply search
  const podcasts = (podcastData?.data || [])
    .filter((podcast) => podcast.status === "active")
    .filter((podcast) =>
      searchQuery.trim() === ""
        ? true
        : podcast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          podcast.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          podcast.episodesList.some((ep) =>
            ep.title.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
    );

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Calculate total duration from episodes
  const calculateTotalDuration = (episodes) => {
    if (!episodes || episodes.length === 0) return "0 Mins";

    let totalMinutes = 0;
    episodes.forEach((ep) => {
      const minutes = parseInt(ep.duration.replace(/\D/g, "")) || 0;
      totalMinutes += minutes;
    });

    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    if (hours > 0) return `${hours} Hrs ${mins} Mins`;
    return `${mins} Mins`;
  };

  // Strip HTML tags from description
  const stripHtml = (html) => {
    return html.replace(/<[^>]*>/g, "");
  };

  return (
    <>
      <div className="lg:col-span-2 space-y-8">
        {/* No results state */}
        {podcasts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-gray-500 text-base font-medium">
              No podcasts found for{" "}
              <span className="text-blue-600 font-semibold">
                "{searchQuery}"
              </span>
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Try searching with a different keyword.
            </p>
          </div>
        )}

        {podcasts.map((podcast) => {
          const activeEpisodes = podcast.episodesList.filter(
            (ep) => ep.status === "active",
          );

          const totalDuration = calculateTotalDuration(activeEpisodes);
          const description = stripHtml(podcast.description);

          return (
            <div key={podcast._id} className="w-full">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <h2 className="text-lg font-bold">{podcast.title}</h2>
                <Link
                  href="/podcast/podcast-list"
                  className="text-black text-xs font-bold hover:underline mt-1 sm:mt-0"
                >
                  All Episodes
                </Link>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-3">
                <span>{activeEpisodes.length} Episodes</span> •{" "}
                <span>{totalDuration}</span>
                <span className="bg-blue-200 text-gray-900 px-2 py-0.5 rounded-full text-xs">
                  {podcast.language}
                </span>
              </div>

              {/* Card */}
              <div className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row gap-4">
                <img
                  src={podcast.cover}
                  alt="Podcast Cover"
                  className="w-full sm:w-32 h-48 sm:h-32 rounded-lg object-cover"
                />
                <div className="flex-1 space-y-3">
                  <div className="text-xs text-gray-500">
                    <p>
                      {description.slice(0, 120)}...
                      <button
                        onClick={() => setSelectedPodcast(podcast)}
                        className="text-blue-600 ml-1 hover:underline cursor-pointer"
                      >
                        Read More
                      </button>
                    </p>
                  </div>

                  {/* Episodes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeEpisodes.slice(0, 4).map((ep) => (
                      <Link href={`/podcast/${podcast._id}`} key={ep._id}>
                        <div className="flex items-start gap-2 cursor-pointer">
                          <FaPlay className="text-yellow-400 mt-1 shrink-0" />
                          <div>
                            <p className="text-xs font-bold truncate w-48 sm:w-auto">
                              {ep.title}
                            </p>
                            <span className="text-xs text-gray-500">
                              {formatDate(ep.date)} • {ep.duration}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedPodcast && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              onClick={() => setSelectedPodcast(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-4">{selectedPodcast.title}</h2>
            <div
              className="text-sm text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: selectedPodcast.description }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PodcastLeftList;
