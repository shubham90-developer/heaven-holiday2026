"use client";

import Breadcrumb from "@/app/components/Breadcum";
import React, { useState } from "react";
import {
  useGetAllVideoBlogsQuery,
  useGetAllCategoriesQuery,
} from "../../../../store/videoBlogs/videoBlogs";

const VideoBlogPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const blogsPerPage = 4;

  const {
    data: videoBlogData,
    isLoading: videoBlogLoading,
    error: videoBlogError,
  } = useGetAllVideoBlogsQuery();

  const {
    data: categoryData,
    isLoading: categoryLoading,
    error: categoryError,
  } = useGetAllCategoriesQuery();

  // SKELETON LOADER
  if (videoBlogLoading || categoryLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-2 space-y-8">
            {Array.from({ length: blogsPerPage }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden animate-pulse"
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-200"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Skeleton */}
          <aside className="lg:col-span-1 space-y-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="p-5 border border-gray-100 rounded-lg bg-white space-y-2 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="space-y-2 mt-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </section>
    );
  }

  if (videoBlogError || categoryError) {
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

  // Filter only active video blogs
  const allVideoBlogs = (videoBlogData?.data || []).filter(
    (blog) => blog.status === "active",
  );

  // Filter only active categories
  const activeCategories = (categoryData?.data || []).filter(
    (cat) => cat.status === "active",
  );

  // Apply search and category filters
  const filteredBlogs = allVideoBlogs.filter((blog) => {
    const matchesSearch = blog.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Get recent blogs (last 3)
  const recentBlogs = allVideoBlogs.slice(0, 3);

  // Convert YouTube URL to embed format
  const getEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("youtube.com/watch")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("/embed/")) {
      return url;
    }
    return url;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Video Blog", href: "/video-blog" },
        ]}
      />

      <section
        className="py-20 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.2)), url(/assets/img/blog/vb.avif)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-white">
            <p className="text-5xl font-bold">Explore the World</p>
            <p>through our LENS</p>
          </div>
        </div>
      </section>

      <section className="py-10 bg-gray-100">
        <main className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Video Grid */}
          <section className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {currentBlogs.length > 0 ? (
                currentBlogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden"
                  >
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe
                        className="w-full h-full"
                        src={getEmbedUrl(blog.videoUrl)}
                        title={blog.title}
                        frameBorder="0"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="p-4">
                      <h2 className="text-lg font-semibold">{blog.title}</h2>
                      <p className="text-sm text-gray-500">
                        {formatDate(blog.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-10">
                  <p className="text-gray-500">No video blogs found</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 0 && (
              <div className="flex justify-center mt-6 space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer text-xs"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`px-3 py-1 border rounded cursor-pointer text-xs ${
                      currentPage === i + 1
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border cursor-pointer text-xs rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </section>

          {/* Right Column: Sidebar */}
          <aside className="lg:col-span-1 space-y-8">
            {/* Search */}
            <div className="p-5 border border-gray-100 rounded-lg bg-white">
              <h3 className="font-semibold mb-3">Search</h3>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1 border rounded-l px-3 py-2 text-sm"
                />
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-gray-200 border rounded-r text-sm"
                >
                  Go
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="p-5 border border-gray-100 rounded-lg bg-white">
              <h3 className="font-semibold mb-3">Categories</h3>
              <ul className="space-y-2 text-sm">
                <li
                  onClick={() => handleCategoryClick("")}
                  className={`cursor-pointer ${
                    selectedCategory === ""
                      ? "text-indigo-600 font-semibold"
                      : "hover:text-indigo-600"
                  }`}
                >
                  • All Categories
                </li>
                {activeCategories.length > 0 ? (
                  activeCategories.map((cat) => (
                    <li
                      key={cat._id}
                      onClick={() => handleCategoryClick(cat.name)}
                      className={`cursor-pointer ${
                        selectedCategory === cat.name
                          ? "text-indigo-600 font-semibold"
                          : "hover:text-indigo-600"
                      }`}
                    >
                      • {cat.name}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No categories available</li>
                )}
              </ul>
            </div>

            {/* Recent Blogs */}
            <div className="p-5 border border-gray-100 rounded-lg bg-white">
              <h3 className="font-semibold mb-3">Recent Blogs</h3>
              <ul className="space-y-2 text-sm">
                {recentBlogs.length > 0 ? (
                  recentBlogs.map((blog) => (
                    <li
                      key={blog._id}
                      className="hover:text-indigo-600 cursor-pointer"
                    >
                      {blog.title}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No recent blogs</li>
                )}
              </ul>
            </div>
          </aside>
        </main>
      </section>
    </>
  );
};

export default VideoBlogPage;
