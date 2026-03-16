"use client";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { useGetPodcastsQuery } from "store/podcasts/podcastApi";

const PodcastAllList = () => {
  const [search, setSearch] = useState("");
  const { id: podcastId } = useParams();
  const { data, isLoading, error } = useGetPodcastsQuery();

  // Audio state
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  // Initialize audio ref
  useEffect(() => {
    audioRef.current = new Audio();

    // Listen for audio end
    audioRef.current.onended = () => {
      setIsPlaying(false);
      setCurrentPlayingId(null);
      setCurrentTime(0);
    };

    // Update current time as audio plays
    audioRef.current.ontimeupdate = () => {
      setCurrentTime(audioRef.current.currentTime);
    };

    // Set duration when metadata loads
    audioRef.current.onloadedmetadata = () => {
      setDuration(audioRef.current.duration);
    };

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Format time (seconds to MM:SS)
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Play/Pause handler
  const handlePlayPause = (episode, e) => {
    e.preventDefault();
    e.stopPropagation();

    const audio = audioRef.current;

    // If clicking same episode
    if (currentPlayingId === episode._id) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    }
    // If clicking different episode
    else {
      audio.pause();
      audio.src = episode.audioUrl;
      audio.play();
      setCurrentPlayingId(episode._id);
      setIsPlaying(true);
      setCurrentTime(0);
    }
  };

  // Handle progress bar seek
  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  if (isLoading) {
    return <p>loading</p>;
  }

  if (error) {
    return <p>error</p>;
  }

  // Fix: Handle array properly and get first item
  const podcastDetail = data?.data?.find((item) => item._id === podcastId);

  // Fix: Return early if no podcast found
  if (!podcastDetail) {
    return <p>Podcast not found</p>;
  }

  // Fix: Access episodesList correctly from podcastDetail object
  const filteredEpisodes = podcastDetail?.episodesList?.filter((ep) =>
    ep.title.toLowerCase().includes(search.toLowerCase()),
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
              src={podcastDetail.cover}
              alt={podcastDetail.title}
              className="rounded-lg shadow-md w-full"
            />
          </div>

          {/* Podcast Info */}
          <div className="w-full md:w-3/4">
            <span className="mt-2 mb-4 inline-block px-3 py-1 bg-blue-200 text-xs font-medium rounded-full">
              {podcastDetail.language}
            </span>
            <h1 className="text-2xl font-bold mb-3">{podcastDetail.title}</h1>
            <p className="text-gray-700 text-sm leading-relaxed">
              {/* Fix: Strip HTML tags from description or use dangerouslySetInnerHTML */}
              <span
                dangerouslySetInnerHTML={{ __html: podcastDetail.description }}
              />
            </p>
          </div>
        </div>

        {/* Episodes Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-8 mb-4 gap-3 relative z-10">
          <h2 className="text-lg font-semibold">
            {podcastDetail?.episodesList?.length || 0} Episodes{" "}
            <span className="text-gray-500 text-sm ml-1">
              Showing 1 - {filteredEpisodes?.length || 0} of{" "}
              {podcastDetail?.episodesList?.length || 0}
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
          {filteredEpisodes?.map((ep, index) => (
            <div
              key={ep._id || index}
              className="flex flex-col gap-2 p-4 bg-white rounded-lg shadow hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                {/* Thumbnail */}
                <div className="relative">
                  <img
                    src={ep.thumbnail || podcastDetail.cover}
                    alt={ep.title || "Episode thumbnail"}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                  <button
                    onClick={(e) => handlePlayPause(ep, e)}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xs rounded-md cursor-pointer hover:bg-opacity-60 transition"
                  >
                    {currentPlayingId === ep._id && isPlaying ? "⏸" : "▶"}
                  </button>
                </div>

                {/* Episode Info */}
                <Link
                  href={`/podcast/podcast-details/${ep._id}`}
                  className="flex-1"
                >
                  <h3 className="font-medium text-sm">{ep.title}</h3>
                  <div className="text-xs text-gray-500 flex gap-3 mt-1">
                    <span className="text-black text-xs">
                      Ep: {ep.order + 1}
                    </span>
                    <span className="text-black text-xs">{ep.duration}</span>

                    <span className="text-black text-xs">
                      {new Date(ep.date).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              </div>

              {/* Progress Bar - Only show for currently playing episode */}
              {currentPlayingId === ep._id && (
                <div className="flex items-center gap-3 px-4">
                  <span className="text-xs text-gray-600 min-w-[40px]">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    style={{
                      background: `linear-gradient(to right, #2563eb 0%, #2563eb ${(currentTime / duration) * 100}%, #e5e7eb ${(currentTime / duration) * 100}%, #e5e7eb 100%)`,
                    }}
                  />
                  <span className="text-xs text-gray-600 min-w-[40px]">
                    {formatTime(duration)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PodcastAllList;
