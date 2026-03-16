"use client";
import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaChevronDown } from "react-icons/fa";
import KycDocuments from "./KycDocuments";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateAddressMutation,
} from "store/authApi/authApi";

const MyProfile = () => {
  const [openProfile, setOpenProfile] = useState(true);
  const [openTravellers, setOpenTravellers] = useState(false);

  // RTK Queries
  const { data: profileData, isLoading } = useGetProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [updateAddress] = useUpdateAddressMutation();

  const userProfile = profileData?.data?.user;

  // Form state
  const [formData, setFormData] = useState({
    gender: "",
    nationality: "",
    dateOfBirth: "",
    address: "",
  });

  // Populate form when data loads
  useEffect(() => {
    if (userProfile) {
      setFormData({
        gender: userProfile.gender || "",
        nationality: userProfile.nationality || "",
        dateOfBirth: userProfile.dateOfBirth
          ? new Date(userProfile.dateOfBirth).toISOString().split("T")[0]
          : "",
        address: userProfile.address?.address || "",
      });
    }
  }, [userProfile]);

  const handleSave = async () => {
    try {
      // Update profile
      await updateProfile({
        gender: formData.gender,
        nationality: formData.nationality,
        dateOfBirth: formData.dateOfBirth,
      }).unwrap();

      // Update address
      await updateAddress({
        address: formData.address,
      }).unwrap();

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update profile");
    }
  };

  const handleCancel = () => {
    // Reset to original data
    if (userProfile) {
      setFormData({
        gender: userProfile.gender || "",
        nationality: userProfile.nationality || "",
        dateOfBirth: userProfile.dateOfBirth
          ? new Date(userProfile.dateOfBirth).toISOString().split("T")[0]
          : "",
        address: userProfile.address?.address || "",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-6">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {/* My Profile Section */}
      <div className="mb-5 border border-gray-200 bg-white rounded-lg">
        <button
          className="flex justify-between items-center w-full px-6 py-4 text-black cursor-pointer"
          onClick={() => setOpenProfile(!openProfile)}
        >
          <span className="font-semibold">My Profile</span>
          <FaChevronDown
            className={`transform transition ${
              openProfile ? "rotate-180" : ""
            }`}
          />
        </button>

        {openProfile && (
          <div className="p-6 border-t bg-white">
            <h3 className="font-medium mb-2">Personal Information</h3>

            {/* Gender */}
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setFormData({ ...formData, gender: "male" })}
                className={`px-4 py-1 text-xs border cursor-pointer rounded-md ${
                  formData.gender === "male"
                    ? "bg-blue-900 text-white border-blue-900"
                    : "hover:bg-gray-100"
                }`}
              >
                Male
              </button>
              <button
                onClick={() => setFormData({ ...formData, gender: "female" })}
                className={`px-4 py-1 text-xs border cursor-pointer rounded-md ${
                  formData.gender === "female"
                    ? "bg-blue-900 text-white border-blue-900"
                    : "hover:bg-gray-100"
                }`}
              >
                Female
              </button>
              <button
                onClick={() => setFormData({ ...formData, gender: "other" })}
                className={`px-4 py-1 text-xs border cursor-pointer rounded-md ${
                  formData.gender === "other"
                    ? "bg-blue-900 text-white border-blue-900"
                    : "hover:bg-gray-100"
                }`}
              >
                Other
              </button>
            </div>

            {/* Nationality */}
            <input
              type="text"
              placeholder="Nationality"
              value={formData.nationality}
              onChange={(e) =>
                setFormData({ ...formData, nationality: e.target.value })
              }
              className="w-full border rounded-md p-2 mb-3 border-gray-400 text-xs py-3"
            />

            {/* DOB */}
            <div className="flex items-center rounded-md mb-3">
              <FaCalendarAlt className="text-gray-400 mr-2" />
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
                className="w-full border rounded-md p-2 border-gray-400 text-xs py-3"
              />
            </div>

            {/* Address */}
            <textarea
              placeholder="Enter Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full border rounded-md p-2 mb-3 border-gray-400 text-xs py-3"
            />

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border rounded-md text-xs cursor-pointer hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-yellow-400 rounded-md text-xs cursor-pointer hover:bg-yellow-500"
              >
                Save
              </button>
            </div>

            {/* KYC Documents */}
            <div className="mt-6">
              <KycDocuments />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
