"use client";

import React, { useState } from "react";
import Image from "next/image";
import { LogOut, X, User } from "lucide-react";
import Link from "next/link";
import { auth } from "@/app/config/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useGetProfileQuery } from "store/authApi/authApi";

const ProfileDrawer = ({ user }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Fetch user profile data from backend
  const { data: profileData, isLoading } = useGetProfileQuery();

  // Get user info
  const userProfile = profileData?.data?.user;
  const displayName = userProfile?.name || user?.phoneNumber || "User";
  const firstName = userProfile?.name?.split(" ")[0] || "User";
  const profileImage = userProfile?.profileImg || "/assets/img/search/1.avif";

  const handleLogout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);

      // Clear localStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");

      // Close drawer
      setOpen(false);

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  return (
    <>
      {/* Avatar */}
      <button
        onClick={() => setOpen(true)}
        className="w-8 h-8 rounded-full overflow-hidden border border-gray-300 cursor-pointer"
      >
        {profileImage ? (
          <Image
            src={profileImage}
            alt="User"
            width={30}
            height={30}
            className="object-contain"
          />
        ) : (
          <div className="w-full h-full bg-yellow-500 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-opacity-40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-yellow-100">
          <p className="text-gray-700 font-semibold">Hello, {firstName}</p>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-gray-700 bg-gray-200 p-2 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <div className="py-2 overflow-y-auto h-[calc(100%-120px)] text-black text-xs">
          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 hover:bg-gray-100 border-b border-dotted border-gray-500"
          >
            <p className="font-medium">My Account</p>
            <p className="text-xs text-gray-500">
              Manage your profile & traveller details.
            </p>
          </Link>

          <Link
            href="/account/my-booking"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 hover:bg-gray-100 border-b border-dotted border-gray-500"
          >
            <p className="font-medium">My Bookings</p>
            <p className="text-xs text-gray-500">See booking details.</p>
          </Link>

          <Link
            href="/account/my-holiday-cart"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 hover:bg-gray-100 border-b border-dotted border-gray-500"
          >
            <p className="font-medium">My Holiday Cart</p>
            <p className="text-xs text-gray-500">
              Complete your pending payments here.
            </p>
          </Link>

          <Link
            href="/account/wishlist"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 hover:bg-gray-100 border-b border-dotted border-gray-500"
          >
            <p className="font-medium">My Wishlist</p>
            <p className="text-xs text-gray-500">
              Save tours to your wishlist for later.
            </p>
          </Link>

          <Link
            href="/account/gift-cards"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 hover:bg-gray-100 border-b border-dotted border-gray-500"
          >
            <p className="font-medium">Gift Cards</p>
            <p className="text-xs text-gray-500">Your purchase history.</p>
          </Link>
        </div>

        {/* Footer - Sign Out */}
        <div className="border-t p-4 bg-yellow-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-3 text-left text-red-500 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileDrawer;
