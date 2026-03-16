"use client";

import React from "react";
import { Heart, Download, Mail, Share2, X, Copy } from "lucide-react";
import Link from "next/link";
import { FaFacebook, FaWhatsapp, FaTwitter, FaInstagram } from "react-icons/fa";
import { useRouter } from "next/navigation";
import {
  useGetProfileQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "store/authApi/authApi";
import { useState, useEffect } from "react";
import { auth } from "@/app/config/firebase";
import toast from "react-hot-toast";
import { useShareTourByEmailMutation } from "store/toursManagement/toursPackagesApi";

const TourActions = ({ packageId, tourTitle: tourTitleProp }) => {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState(null);
  const [addToWishlist] = useAddToWishlistMutation();
  const [emailInput, setEmailInput] = useState("");
  const [shareTourByEmail, { isLoading: isSending }] =
    useShareTourByEmailMutation();

  const closeModal = () => setActiveModal(null);

  // Share helpers
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const tourTitle = tourTitleProp || "Check out this tour on Heaven Holiday!";
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const { data: profileData } = useGetProfileQuery();
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    if (profileData?.data?.user?.wishlist) {
      setIsInWishlist(profileData.data.user.wishlist.includes(packageId));
    }
  }, [profileData, packageId]);
  const handleWhatsAppShare = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(tourTitle + " " + shareUrl)}`,
      "_blank",
    );
  };

  const handleFacebookShare = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      "_blank",
    );
  };

  const handleTwitterShare = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(tourTitle)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank",
    );
  };

  const handleInstagramShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: tourTitle, url: shareUrl });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied! Open Instagram and paste it in your story or bio.");
    }
  };

  const handleSendEmail = async () => {
    if (!emailInput) {
      toast.error("Please enter an email address");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      await shareTourByEmail({
        tourId: packageId,
        recipientEmail: emailInput,
      }).unwrap();
      toast.success("Tour brochure sent successfully!");
      setEmailInput("");
      closeModal();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send email");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard!");
  };

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("authToken");
    if (!token && !auth.currentUser) {
      alert("Please login first");
      router.push("/login");
      return;
    }

    try {
      if (isInWishlist) {
        await removeFromWishlist({ packageId }).unwrap();
        setIsInWishlist(false);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist({ packageId }).unwrap();
        setIsInWishlist(true);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update wishlist");
    }
  };

  return (
    <div>
      {/* Bottom buttons */}
      <div className="flex justify-between text-xs text-blue-800 items-center gap-4 mt-4">
        <button
          onClick={handleAddToWishlist}
          className="flex items-center gap-1 cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 ${isInWishlist ? "fill-red-500 text-red-500" : ""}`}
          />
          Wishlist
        </button>

        <button
          onClick={() => setActiveModal("email")}
          className="flex items-center gap-1 cursor-pointer"
        >
          <Mail className="w-4 h-4" /> Email
        </button>

        <button
          onClick={() => setActiveModal("share")}
          className="flex items-center gap-1 cursor-pointer"
        >
          <Share2 className="w-4 h-4" /> Share
        </button>
      </div>

      {/* Download Modal */}
      {activeModal === "download" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg w-[600px] flex relative overflow-hidden">
            <div className="w-1/2">
              <img
                src="/assets/img/tour-card/1.avif"
                alt="Tour"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="w-1/2 p-6">
              <button
                className="absolute top-2 right-2 text-gray-500 cursor-pointer bg-gray-300 p-2 rounded-full"
                onClick={closeModal}
              >
                <X className="w-3 h-3" />
              </button>
              <h2 className="text-lg font-semibold mb-2">
                You're printing the itinerary & price details for tour date 28
                Nov 2025
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Please go back to calendar if you wish to change the date or
                click on Print.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  className="border px-4 py-2 rounded cursor-pointer text-xs"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button className="bg-red-700 px-4 py-2 rounded font-semibold hover:bg-yellow-500 text-xs cursor-pointer">
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {activeModal === "email" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg w-[600px] flex relative overflow-hidden">
            <div className="w-1/2">
              <img
                src="/assets/img/tour-card/2.avif"
                alt="Tour"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="w-1/2 p-6">
              <button
                className="absolute top-2 right-2 text-gray-500 cursor-pointer bg-gray-300 p-2 rounded-full"
                onClick={closeModal}
              >
                <X className="w-3 h-3" />
              </button>
              <h2 className="text-lg font-semibold mb-2">
                You're mailing the itinerary & price details.
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                A complete PDF brochure will be sent to the email address below.
              </p>
              <input
                type="email"
                placeholder="Recipient Email ID"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendEmail()}
                className="w-full border border-gray-400 p-3 text-xs rounded-xl mb-3"
              />
              <div className="flex gap-3 justify-end">
                <button
                  className="border px-4 py-2 rounded cursor-pointer text-xs"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendEmail}
                  disabled={isSending || !emailInput}
                  className="bg-red-700 px-4 py-2 rounded font-semibold hover:bg-yellow-500 text-xs cursor-pointer text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSending ? "Sending..." : "Send Email"}
                </button>
              </div>
              {isSending && (
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Generating PDF and sending... please wait
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {activeModal === "share" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg w-[500px] flex relative overflow-hidden">
            <div className="w-1/2">
              <img
                src="/assets/img/tour-card/3.avif"
                alt="Tour"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="w-1/2 p-6">
              <button
                className="absolute top-2 right-2 text-gray-500 cursor-pointer bg-gray-300 p-2 rounded-full"
                onClick={closeModal}
              >
                <X className="w-3 h-3" />
              </button>
              <h2 className="text-lg font-semibold mb-4">Share This Tour</h2>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleWhatsAppShare}
                  className="flex items-center gap-2 border px-3 py-2 rounded hover:bg-gray-100 text-green-600 text-xs cursor-pointer"
                >
                  <FaWhatsapp className="w-4 h-4" />
                  Share via WhatsApp
                </button>

                <button
                  onClick={handleFacebookShare}
                  className="flex items-center gap-2 border px-3 py-2 rounded hover:bg-gray-100 text-blue-600 text-xs cursor-pointer"
                >
                  <FaFacebook className="w-4 h-4" />
                  Share via Facebook
                </button>

                <button
                  onClick={handleTwitterShare}
                  className="flex items-center gap-2 border px-3 py-2 rounded hover:bg-gray-100 text-sky-500 text-xs cursor-pointer"
                >
                  <FaTwitter className="w-4 h-4" />
                  Share via Twitter
                </button>

                <button
                  onClick={handleInstagramShare}
                  className="flex items-center gap-2 border px-3 py-2 rounded hover:bg-gray-100 text-pink-600 text-xs cursor-pointer"
                >
                  <FaInstagram className="w-4 h-4" />
                  Share via Instagram
                </button>

                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 border px-3 py-2 rounded hover:bg-gray-100 text-gray-700 text-xs cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourActions;
