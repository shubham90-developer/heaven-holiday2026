"use client";

import Breadcrumb from "@/app/components/Breadcum";
import React, { useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useGetAllBooksQuery } from "store/booksApi/booksApi";
import { useParams } from "next/navigation";
import { useCreateEnquiryMutation } from "store/enquiryApi/enquiryApi";
import { useState } from "react";
import { useGetContactDetailsQuery } from "store/aboutUsApi/contactApi";
import toast from "react-hot-toast";
const TravelPlannerDetails = () => {
  const bookRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    mono: "",
  });

  const [createEnquiry, { isLoading: isSubmitting }] =
    useCreateEnquiryMutation();
  const { id: bookId } = useParams();
  const { data: books, isLoading, error } = useGetAllBooksQuery();
  const {
    data: contactDetails,
    isLoading: isContactDetailsLoading,
    error: contactDetailsError,
  } = useGetContactDetailsQuery();
  if (isLoading || isContactDetailsLoading) {
    return <p>loading</p>;
  }

  if (error || contactDetailsError) {
    return <p>error</p>;
  }

  // Use find instead of filter to get single book object
  const book = books?.data?.find((item) => item._id === bookId);

  // Handle case when book is not found
  if (!book) {
    return <p>Book not found</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.mono) {
      alert("Please fill all fields!");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.mono)) {
      alert("Mobile number must be exactly 10 digits!");
      return;
    }

    try {
      await createEnquiry({
        name: formData.name,
        mono: formData.mono,
        destinations: "-",
        status: "active",
      }).unwrap();

      toast.success(
        "Request submitted successfully! We will call you back soon.",
      );
      setFormData({ name: "", mono: "" });
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to submit request. Please try again.",
      );
    }
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Travel Planners", href: "/travel-planners" },
          { label: "Travel Planner Details", href: "/travel-planner-details" },
        ]}
      />

      <section className="container bg-gray-100 mx-auto py-10 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Flipbook */}
        <div className="lg:col-span-2 flex flex-col items-center">
          <div className="relative">
            {/* Arrows */}
            <button
              onClick={() => bookRef.current.pageFlip().flipPrev()}
              className="absolute -left-12 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-md hover:bg-gray-700 z-10"
            >
              ◀
            </button>

            <HTMLFlipBook
              width={400}
              height={550}
              size="stretch"
              minWidth={300}
              maxWidth={600}
              maxHeight={800}
              minHeight={400}
              showCover={true}
              drawShadow={true}
              useMouseEvents={true}
              flippingTime={700}
              mobileScrollSupport={true}
              ref={bookRef}
              className="shadow-2xl rounded-lg"
            >
              {/* Cover Page */}
              <div className="w-48 h-64 bg-white flex items-center justify-center relative overflow-hidden rounded-lg">
                <Image
                  src={book.coverImg}
                  alt={book.title}
                  fill
                  className="object-cover"
                  sizes="192px"
                />
              </div>

              {/* Gallery Pages - images is array of URL strings */}
              {book.images.map((imageUrl, index) => (
                <div key={index} className="w-48">
                  <div className="w-full h-full relative overflow-hidden rounded-lg bg-white shadow-sm">
                    <Image
                      src={imageUrl}
                      alt={`${book.title} - Page ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="192px"
                    />
                  </div>
                </div>
              ))}
            </HTMLFlipBook>

            <button
              onClick={() => bookRef.current.pageFlip().flipNext()}
              className="absolute -right-12 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-md hover:bg-gray-700 z-10"
            >
              ▶
            </button>
          </div>
        </div>

        <div className="bg-gray-100 shadow rounded-lg p-4">
          <h3 className="font-semibold text-sm mb-3">Want us to call you?</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border rounded-xl p-2 py-3 text-xs mb-2 border-gray-300"
              required
            />
            <input
              type="tel"
              placeholder="Mobile Number"
              value={formData.mono}
              onChange={(e) =>
                setFormData({ ...formData, mono: e.target.value })
              }
              pattern="[0-9]{10}"
              maxLength={10}
              className="w-full border rounded-xl p-2 py-3 text-xs mb-2 border-gray-300"
              required
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full cursor-pointer bg-red-700 hover:bg-red-500 text-white py-2 rounded font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Phone size={16} className="text-white" />
              <span>
                {isSubmitting ? "Submitting..." : "Request Call Back"}
              </span>
            </button>
          </form>

          {/* Helpline */}
          <div className="mt-4 text-xs text-gray-600 space-y-2">
            <p className="flex items-center gap-2">
              <Phone size={14} className="text-black" />
              <span>
                <span className="font-semibold text-black">
                  For Indian Guests:
                </span>{" "}
                <span>
                  <Link
                    href={`tel:${contactDetails?.data?.callUs?.phoneNumbers[0] || ""}`}
                    className="text-blue-600 font-bold"
                  >
                    {contactDetails?.data?.callUs?.phoneNumbers[0] || ""} /{" "}
                    {contactDetails?.data?.callUs?.phoneNumbers[1] || ""}
                  </Link>
                </span>
              </span>
            </p>

            <p className="flex items-center gap-2">
              <Mail size={14} className="text-black" />
              <Link
                href={`mailto:${contactDetails?.data?.writeToUs?.emails[0] || ""}`}
                className="text-blue-600 font-bold"
              >
                {contactDetails?.data?.writeToUs?.emails[0] || ""} or{" "}
                {contactDetails?.data?.writeToUs?.emails[1] || ""}
              </Link>
            </p>

            <p className="flex items-center gap-2">
              <Phone size={14} className="text-black" />
              <span>
                <span className="font-semibold">For Foreign Nationals:</span>{" "}
                <Link
                  href={`tel:+91${contactDetails?.data?.callUs?.phoneNumbers[0] || ""}`}
                  className="text-blue-600 font-bold"
                >
                  +91 {contactDetails?.data?.callUs?.phoneNumbers[0] || ""}
                </Link>
              </span>
            </p>

            <p className="flex items-center gap-2">
              <Mail size={14} className="text-black" />
              <Link
                href={`mailto:${contactDetails?.data?.writeToUs?.emails[0] || ""}`}
                className="text-blue-600 font-bold"
              >
                {contactDetails?.data?.writeToUs?.emails[0] || ""}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default TravelPlannerDetails;
