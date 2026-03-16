"use client";
import React, { useState, useMemo } from "react";
import { useGetGalleryQuery } from "../../../../store/galleryApi/galleryApi";
import { useGetTourReviewQuery } from "store/reviewsApi/reviewsApi";

const ReviewsAndTestimonialTab = ({ searchQuery = "" }) => {
  const [activeTab, setActiveTab] = useState("reviews");
  const [currentPage, setCurrentPage] = useState(1);
  const [galleryPage, setGalleryPage] = useState(1);
  const { data, isLoading, isError } = useGetTourReviewQuery(undefined);

  const activeReviews =
    data?.data?.reviews.filter((item) => {
      return item.status === "active";
    }) || [];

  // Filter reviews based on searchQuery from parent
  const filteredReviews = useMemo(() => {
    if (!searchQuery.trim()) return activeReviews;
    const q = searchQuery.toLowerCase();
    return activeReviews.filter(
      (review) =>
        review.title?.toLowerCase().includes(q) ||
        review.tag?.toLowerCase().includes(q) ||
        review.author?.toLowerCase().includes(q) ||
        review.text?.toLowerCase().includes(q),
    );
  }, [searchQuery, activeReviews]);

  // Pagination using real filtered data
  const reviewsPerPage = 6;
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const currentReviews = filteredReviews.slice(
    startIndex,
    startIndex + reviewsPerPage,
  );

  const goToPage = (page) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  const {
    data: galleryData,
    isLoading: galleryLoading,
    error: galleryError,
  } = useGetGalleryQuery();

  if (galleryLoading || isLoading) {
    return (
      <section className="py-10 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6 animate-pulse">
          {/* Tabs skeleton */}
          <div className="flex items-center gap-4 border-b border-gray-200 pb-2">
            <div className="h-8 bg-gray-200 rounded w-24" />
            <div className="h-8 bg-gray-200 rounded w-28" />
          </div>

          {/* Count skeleton */}
          <div className="h-4 bg-gray-200 rounded w-48 mt-6 mb-4" />

          {/* Review cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="border border-gray-100 bg-white rounded-lg p-4 shadow-sm space-y-3"
              >
                <div className="h-5 bg-gray-200 rounded w-16" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="space-y-1">
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                  <div className="h-3 bg-gray-200 rounded w-4/6" />
                </div>
                <div className="h-3 bg-gray-200 rounded w-24" />
                <div className="h-3 bg-gray-200 rounded w-32" />
              </div>
            ))}
          </div>

          {/* Pagination skeleton */}
          <div className="flex justify-center gap-2 mt-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-8 h-7 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (galleryError || isError) {
    return (
      <section className="py-10 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <p className="text-gray-500 text-sm">
            Content unavailable at the moment.
          </p>
        </div>
      </section>
    );
  }

  // Filter only active images
  const galleryImages = (galleryData?.data?.images || []).filter(
    (img) => img.status === "active",
  );

  // Gallery pagination
  const imagesPerPage = 10;
  const totalGalleryPages = Math.ceil(galleryImages.length / imagesPerPage);
  const galleryStartIndex = (galleryPage - 1) * imagesPerPage;
  const currentGalleryImages = galleryImages.slice(
    galleryStartIndex,
    galleryStartIndex + imagesPerPage,
  );

  const goToGalleryPage = (page) => {
    if (page > 0 && page <= totalGalleryPages) setGalleryPage(page);
  };

  return (
    <section className="py-10 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex items-center gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-6 py-2 rounded-md text-sm font-medium border cursor-pointer ${
              activeTab === "reviews"
                ? "bg-blue-800 text-white border-blue-800"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            All reviews
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={`px-6 py-2 rounded-md text-sm font-medium border cursor-pointer ${
              activeTab === "gallery"
                ? "bg-blue-800 text-white border-blue-800"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            Photo gallery
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "reviews" && (
            <div>
              <p className="text-sm text-gray-500 mb-4">
                Showing {filteredReviews.length === 0 ? 0 : startIndex + 1}-
                {startIndex + currentReviews.length} of{" "}
                <span className="font-semibold">{filteredReviews.length}</span>{" "}
                total reviews
              </p>

              {/* Review Cards - single grid using real paginated data */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentReviews.length > 0 ? (
                  currentReviews.map((review) => (
                    <div
                      key={review._id}
                      className="border border-gray-100 bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition"
                    >
                      <span className="text-xs text-pink-600 font-medium bg-pink-100 px-2 py-1 rounded">
                        {review.tag}
                      </span>

                      <h3 className="mt-2 font-semibold text-gray-800">
                        {review.title}
                      </h3>

                      <p
                        className="text-sm text-gray-600 mt-1"
                        dangerouslySetInnerHTML={{ __html: review.text }}
                      />

                      <p className="text-sm font-medium mt-3">
                        {review.author}
                      </p>

                      <p className="text-xs text-gray-500">
                        Travelled in{" "}
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="col-span-3 text-center text-gray-500 py-10">
                    {searchQuery
                      ? `No reviews found for "${searchQuery}"`
                      : "No reviews available"}
                  </p>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center mt-6">
                  <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {/* Previous */}
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border text-xs rounded disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      Previous
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => goToPage(i + 1)}
                        className={`px-3 py-1 border rounded text-xs whitespace-nowrap ${
                          currentPage === i + 1
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    {/* Next */}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border text-xs rounded disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "gallery" && (
            <div>
              <p className="text-sm text-gray-500 mb-4">
                Showing {galleryStartIndex + 1}-
                {galleryStartIndex + currentGalleryImages.length} of{" "}
                <span className="font-semibold">{galleryImages.length}</span>{" "}
                total photos & videos
              </p>

              {/* Dynamic Photo Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {currentGalleryImages.length > 0 ? (
                  currentGalleryImages.map((image) => (
                    <div
                      key={image._id}
                      className="aspect-square overflow-hidden rounded-lg"
                    >
                      <img
                        src={image.url}
                        alt="gallery"
                        className="w-full h-full object-cover hover:scale-105 transition"
                        onError={(e) => {
                          e.currentTarget.src =
                            "data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><rect width='100%' height='100%' fill='%23f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='16'>Image</text></svg>";
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-gray-500">No gallery images available</p>
                  </div>
                )}
              </div>

              {/* Gallery Pagination */}
              {totalGalleryPages > 1 && (
                <div className="flex items-center justify-center mt-6">
                  <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {/* Previous */}
                    <button
                      onClick={() => goToGalleryPage(galleryPage - 1)}
                      disabled={galleryPage === 1}
                      className="px-3 py-1 border text-xs rounded disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      Previous
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalGalleryPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => goToGalleryPage(i + 1)}
                        className={`px-3 py-1 border rounded text-xs whitespace-nowrap ${
                          galleryPage === i + 1
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    {/* Next */}
                    <button
                      onClick={() => goToGalleryPage(galleryPage + 1)}
                      disabled={galleryPage === totalGalleryPages}
                      className="px-3 py-1 border text-xs rounded disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReviewsAndTestimonialTab;
