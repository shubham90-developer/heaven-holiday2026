"use client";
import Breadcrumb from "@/app/components/Breadcum";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  useGetAllBlogsQuery,
  useGetAllCategoriesQuery,
} from "../../../../store/blogs/blogsApi";

const Blog = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 10;

  const {
    data: blogData,
    isLoading: blogsLoading,
    error: blogsError,
  } = useGetAllBlogsQuery();

  const {
    data: categoryData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetAllCategoriesQuery();

  if (blogsLoading || categoriesLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </section>
    );
  }

  if (blogsError || categoriesError) {
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

  // Filter only published blogs
  const allBlogs = (blogData?.data || []).filter(
    (blog) => blog.status === "published",
  );

  // Filter only active categories
  const activeCategories = categoryData?.data || [];

  // Updated filtering logic to include both search and category
  const filteredBlogs = allBlogs.filter((blog) => {
    const matchesSearch = blog.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || blog.category?._id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const startIndex = (currentPage - 1) * blogsPerPage;
  const currentBlogs = filteredBlogs.slice(
    startIndex,
    startIndex + blogsPerPage,
  );

  // Get recent posts (last 3 published blogs)
  const recentPosts = allBlogs.slice(0, 3);

  // Format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handle category click
  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? "" : categoryId);
    setCurrentPage(1);
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
        ]}
      />
      <section className="py-10 bg-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          {/* Left Side - Blog Cards */}
          <div className="md:col-span-2">
            {/* Blog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {currentBlogs.length > 0 ? (
                currentBlogs.map((blog) => (
                  <Link
                    href={`blog/${blog._id}`}
                    key={blog._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                  >
                    <Image
                      src={blog.hero}
                      alt={blog.title}
                      width={800}
                      height={400}
                      className="w-full h-56 object-cover"
                    />
                    <div className="p-6">
                      <p className="text-sm text-gray-500">
                        {formatDate(blog.date)}
                      </p>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {blog.content.replace(/<[^>]*>/g, "").substring(0, 100)}
                        ...
                      </p>
                      <button className="text-yellow-500 hover:text-yellow-600 font-medium">
                        Read More →
                      </button>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <p className="text-gray-600">
                    No blogs found matching your filters.
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 0 && (
              <div className="flex justify-center mt-8 space-x-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-4 py-2 rounded-full text-xs cursor-pointer border ${
                      currentPage === index + 1
                        ? "bg-blue-800 text-white font-semibold"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Sidebar */}
          <div className="space-y-8">
            {/* Search */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="font-semibold text-gray-900 mb-3">Search</h4>
              <input
                type="text"
                placeholder="Search blog..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>

            {/* Categories */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="font-semibold text-gray-900 mb-3">Categories</h4>
              <ul className="space-y-2">
                {activeCategories.map((cat) => (
                  <li
                    key={cat._id}
                    onClick={() => handleCategoryClick(cat._id)}
                    className={`cursor-pointer transition ${
                      selectedCategory === cat._id
                        ? "text-yellow-500 font-semibold"
                        : "text-gray-700 hover:text-yellow-500"
                    }`}
                  >
                    {cat.name}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Posts */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="font-semibold text-gray-900 mb-3">Recent Posts</h4>
              <ul className="space-y-3">
                {recentPosts.map((post) => (
                  <li key={post._id}>
                    <p className="text-gray-900 font-medium">{post.title}</p>
                    <span className="text-sm text-gray-500">
                      {formatDate(post.date)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;
