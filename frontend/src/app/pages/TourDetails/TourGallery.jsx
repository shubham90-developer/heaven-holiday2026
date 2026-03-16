"use client";
import React, { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const TourGallery = ({ galleryImages = [] }) => {
  // Use provided gallery images or fallback to default images
  const images = galleryImages && galleryImages.length > 0 ? galleryImages : [];

  const [isOpen, setIsOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const openGallery = (index) => {
    setStartIndex(index);
    setIsOpen(true);
  };

  const closeGallery = () => setIsOpen(false);

  return (
    <div>
      {/* Top Gallery Grid (Only 4 shown) */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {images.slice(0, 3).map((src, index) => (
          <div key={index} onClick={() => openGallery(index)}>
            <Image
              src={src}
              alt={`Guest Photo ${index + 1}`}
              width={600}
              height={600}
              className="w-full h-20 object-cover rounded-lg cursor-pointer"
            />
          </div>
        ))}

        {/* Last Thumbnail shows remaining count */}
        {images.length > 3 && (
          <div
            onClick={() => openGallery(3)}
            className="relative w-full h-20 bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
          >
            <Image
              src={images[3]}
              alt="More Photos"
              width={600}
              height={600}
              className="absolute inset-0 w-full h-full object-cover rounded-lg opacity-70"
            />
            <span className="absolute inset-0 flex items-center justify-center text-white font-semibold text-sm bg-black/40">
              +{images.length - 3} more
            </span>
          </div>
        )}
      </div>

      {/* Fullscreen Modal with Slider */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          {/* Close Button */}
          <button
            onClick={closeGallery}
            className="absolute top-2 right-2 text-gray-500 cursor-pointer bg-gray-300 p-2 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Custom Nav Buttons */}
          <div className="absolute left-4 z-50">
            <div className="swiper-button-prev !static bg-white/20 p-2 rounded-full text-white hover:bg-white/40 cursor-pointer">
              <ChevronLeft className="w-6 h-6" />
            </div>
          </div>
          <div className="absolute right-4 z-50">
            <div className="swiper-button-next !static bg-white/20 p-2 rounded-full text-white hover:bg-white/40 cursor-pointer">
              <ChevronRight className="w-6 h-6" />
            </div>
          </div>

          {/* Swiper Slider */}
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            initialSlide={startIndex}
            className="w-full max-w-4xl"
          >
            {images.map((src, index) => (
              <SwiperSlide key={index}>
                <div className="flex items-center justify-center h-[80vh]">
                  <Image
                    src={src}
                    alt={`Slide ${index + 1}`}
                    width={1200}
                    height={800}
                    className="object-contain max-h-full rounded-lg"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default TourGallery;
