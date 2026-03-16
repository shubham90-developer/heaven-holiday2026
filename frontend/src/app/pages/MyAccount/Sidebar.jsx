"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaUser,
  FaBook,
  FaPlane,
  FaHeart,
  FaGift,
  FaCamera,
  FaCheck,
  FaEnvelope,
  FaQq,
  FaQuestion,
} from "react-icons/fa";
import {
  useGetProfileQuery,
  useUploadProfileImageMutation,
} from "store/authApi/authApi";
import { useGetContactDetailsQuery } from "store/aboutUsApi/contactApi";
import { auth } from "@/app/config/firebase";

const Sidebar = () => {
  const fileInputRef = useRef(null);
  const pathname = usePathname();

  // Get user from Firebase
  const user = auth.currentUser;

  // Fetch profile data
  const { data: profileData, isLoading } = useGetProfileQuery();
  const { data: contact, isLoading: contactLoading } =
    useGetContactDetailsQuery();
  const [uploadProfileImage] = useUploadProfileImageMutation();

  const userProfile = profileData?.data?.user;
  const displayName = userProfile?.name || "User";
  const email = userProfile?.email || user?.email || "No email";
  const phone = userProfile?.phone || user?.phoneNumber || "No phone";
  const profileImg = userProfile?.profileImg;

  // Get initials for avatar
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        await uploadProfileImage(file).unwrap();
        alert("Profile image updated successfully!");
      } catch (error) {
        console.error("Upload error:", error);
        alert("Failed to upload image");
      }
    }
  };

  const menuItems = [
    { icon: <FaUser />, label: "My Account", url: "/account" },
    { icon: <FaBook />, label: "My Booking", url: "/account/my-booking" },
    // {
    //   icon: <FaPlane />,
    //   label: "My Holiday Cart",
    //   url: "/account/my-holiday-cart",
    // },
    { icon: <FaHeart />, label: "Wishlist", url: "/account/wishlist" },
    // { icon: <FaGift />, label: "Gift Cards", url: "/account/gift-cards" },
    { icon: <FaQuestion />, label: "Faq's", url: "/faq" },
  ];

  if (isLoading || contactLoading) {
    return (
      <div className="w-64 bg-white shadow-md rounded-lg p-6">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded mt-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-white shadow-md rounded-lg p-6">
      {/* Profile */}
      <div className="flex flex-col items-center mb-6 border-b border-gray-200 pb-6 relative">
        <div className="relative">
          {profileImg ? (
            <img
              src={profileImg}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center text-2xl font-bold">
              {initials}
            </div>
          )}
          <button
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md text-gray-600 hover:text-blue-600 cursor-pointer"
          >
            <FaCamera size={14} />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <h3 className="mt-3 font-semibold">{displayName}</h3>
        <p className="text-sm text-gray-600">{email}</p>
        <p className="text-sm font-bold text-gray-600 flex items-center gap-1">
          {phone}
          {userProfile?.phoneVerified && (
            <FaCheck className="text-white text-md bg-green-400 p-1 rounded-full" />
          )}
        </p>
      </div>

      {/* Menu */}
      <ul className="space-y-2 text-gray-700">
        {menuItems.map((item, idx) => {
          const isActive = pathname === item.url;
          return (
            <li key={idx}>
              <Link
                href={item.url}
                className={`flex items-center gap-2 p-2 rounded-md transition ${
                  isActive
                    ? "bg-blue-900 text-white"
                    : "hover:bg-blue-50 hover:text-blue-900"
                }`}
              >
                <span className={isActive ? "text-white" : "text-gray-500"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Support */}
      <div className="mt-6 text-sm bg-gray-100 p-4 rounded-md">
        <p className="font-medium mb-1">Need to talk before you depart?</p>
        <Link
          href="tel:1800227979"
          className="block text-gray-700 hover:text-blue-600"
        >
          {contact?.data?.callUs?.phoneNumbers[0] || ""} /{" "}
          {contact?.data?.callUs?.phoneNumbers[1] || ""}
        </Link>
        <p className="text-blue-600 flex items-center gap-2 mt-1">
          <FaEnvelope /> {contact?.data?.writeToUs?.emails[0]}
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
