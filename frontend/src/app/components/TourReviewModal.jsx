"use client";
import React, { useState } from "react";
import { X, Star } from "lucide-react";
import { useGetCounterQuery } from "../../../store/counterApi/counterApi";
import { useGetTourReviewQuery } from "../../../store/reviewsApi/reviewsApi";
import { useGetGalleryQuery } from "../../../store/galleryApi/galleryApi";

const TourReviewModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("reviews");
  const {
    data: counter,
    isError: counterError,
    isLoading: counterLoading,
  } = useGetCounterQuery();

  const {
    data: review,
    isError: reviewsError,
    isLoading: reviewsLoading,
  } = useGetTourReviewQuery();

  const {
    data: gallery,
    isError: galleryError,
    isLoading: galleryLoading,
  } = useGetGalleryQuery();

  if (counterLoading || reviewsLoading || galleryLoading) {
    return <p>loading</p>;
  }
  if (counterError || reviewsError || galleryError) {
    return <p>error</p>;
  }
  const reviews = review?.data?.reviews || "";
  const activeReviews = reviews.filter((item) => {
    return item.status == "active";
  });
  const activeGallery = gallery?.data?.images.filter((item) => {
    return item.status == "active";
  });
  return (
    <div className="text-center mt-10">
      {/* Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-red-700 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md cursor-pointer"
      >
        Read more Reviews
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto relative p-6">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black bg-gray-300 p-2 rounded-full cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="text-left mb-6 bg-yellow-50 p-3 border-b border-gray-200">
              <h2 className="text-xl font-bold">
                {counter?.data?.guests || ""} happy travellers ⭐ 5 |{" "}
                {review?.data?.reviews.length || ""}
                Reviews
              </h2>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setActiveTab("reviews")}
                className={`px-6 py-2 rounded-md border cursor-pointer ${
                  activeTab === "reviews"
                    ? "bg-blue-900 text-white border-blue-900"
                    : "bg-white text-gray-600 border-gray-300"
                }`}
              >
                All reviews
              </button>
              <button
                onClick={() => setActiveTab("gallery")}
                className={`px-6 py-2 rounded-md border cursor-pointer ${
                  activeTab === "gallery"
                    ? "bg-blue-900 text-white border-blue-900"
                    : "bg-white text-gray-600 border-gray-300"
                }`}
              >
                Photo gallery
              </button>
            </div>

            {/* Content */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                {activeReviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-gray-50 rounded-lg p-4 shadow-sm text-left"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold">{review.rating}</span>
                      <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded">
                        {review.tag}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg">{review.title}</h3>
                    <p
                      className="text-gray-700 text-sm mt-2"
                      dangerouslySetInnerHTML={{ __html: review.text || "" }}
                    />

                    <div className="mt-4">
                      <p className="font-semibold">{review.author}</p>
                      <p className="text-xs text-gray-500">
                        Travelled in {review.createdAt}
                      </p>
                    </div>
                    <div className="mt-3 text-blue-900 text-sm">
                      {review.guides.join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "gallery" && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {activeGallery.map((img) => (
                  <img
                    key={img._id}
                    src={img.url}
                    alt={`Gallery`}
                    className="w-full h-40 object-cover rounded-lg shadow-sm"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TourReviewModal;
