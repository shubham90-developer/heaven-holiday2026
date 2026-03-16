"use client";
import Link from "next/link";
import React from "react";
import { useGetAllBlogsQuery } from "store/blogs/blogsApi";

const TravalTips = () => {
  const { data, isLoading, error } = useGetAllBlogsQuery();

  if (isLoading) {
    return (
      <section className="py-12 bg-white animate-pulse">
        <div className="max-w-6xl mx-auto px-6 text-center">
          {/* Heading Skeleton */}
          <div className="h-6 w-2/3 mx-auto bg-gray-300 rounded mb-3"></div>
          <div className="h-4 w-40 mx-auto bg-gray-200 rounded mb-8"></div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="text-center">
                {/* Image Skeleton */}
                <div className="w-full h-40 bg-gray-300 rounded-lg"></div>

                {/* Title Skeleton */}
                <div className="h-4 bg-gray-300 rounded mt-3 w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return <p>error</p>;
  }

  // Filter only published blogs and map to the required format
  const activeBlogs =
    data?.data
      ?.filter((item) => item.status === "published")
      ?.map((blog) => ({
        id: blog._id,
        img: blog.hero,
        title: blog.title,
        link: `/blog/${blog._id}`, // or use blog.slug if available
        category: blog.category?.name,
        readTime: blog.readTime,
        tags: blog.tags,
      })) || [];

  // Fallback if no published blogs
  if (activeBlogs.length === 0) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-2xl text-capitalize text-center font-bold mb-3">
            Travel Tips, Hacks, Tricks and a Ahole Lot More...{" "}
          </h2>
          <div className="flex justify-center mb-8">
            <img
              src="/assets/img/header-bottom.svg"
              alt="underline"
              className="w-40 md:w-50"
            />
          </div>
          <p className="text-gray-500">
            No published blogs available at the moment.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full relative py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-2xl md:text-2xl text-capitalize text-center font-bold mb-3">
          Travel Tips, Hacks, Tricks and a Ahole Lot More...{" "}
        </h2>

        {/* Underline Image */}
        <div className="flex justify-center mb-8">
          <img
            src="/assets/img/header-bottom.svg"
            alt="underline"
            className="w-40 md:w-50"
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {activeBlogs.map((tip) => (
            <Link href={tip.link} key={tip.id} className="text-center">
              <div className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                <img
                  src={tip.img}
                  alt={tip.title}
                  className="w-full h-40 object-cover"
                />
              </div>
              <p className="mt-3 text-sm font-bold text-black">{tip.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TravalTips;
