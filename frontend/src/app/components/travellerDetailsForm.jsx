"use client";
import React, { useState } from "react";

const TravellerDetailsForm = ({
  travellerCount,
  onSubmit,
  onBack,
  passportImages,
  setPassportImages,
}) => {
  const [travellers, setTravellers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPassportImage, setCurrentPassportImage] = useState(null);
  const [currentTraveller, setCurrentTraveller] = useState({
    type: "Adult",
    title: "Mr",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    age: 0,
    gender: "Male",
    isLeadTraveler: false,
    email: "",
    phone: "",
  });
  setCurrentPassportImage(null);

  const totalTravellers = travellerCount.total;

  // Generate traveller type based on index
  const getTravellerType = (index) => {
    if (index < travellerCount.adults) return "Adult";
    if (index < travellerCount.adults + travellerCount.children) return "Child";
    return "Infant";
  };

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "dateOfBirth") {
      const age = calculateAge(value);
      setCurrentTraveller((prev) => ({
        ...prev,
        dateOfBirth: value,
        age: age,
      }));
    } else {
      setCurrentTraveller((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleNext = (e) => {
    e.preventDefault();

    // Validation
    if (!currentTraveller.firstName || !currentTraveller.lastName) {
      alert("Please enter first name and last name");
      return;
    }

    if (!currentTraveller.dateOfBirth) {
      alert("Please enter date of birth");
      return;
    }

    // Validate age based on type
    const age = currentTraveller.age;
    if (currentTraveller.type === "Adult" && age < 12) {
      alert("Adult must be 12 years or older");
      return;
    }
    if (currentTraveller.type === "Child" && (age < 2 || age >= 12)) {
      alert("Child must be between 2 and 12 years old");
      return;
    }
    if (currentTraveller.type === "Infant" && age >= 2) {
      alert("Infant must be below 2 years old");
      return;
    }

    // Lead traveler validation
    if (currentTraveller.isLeadTraveler) {
      if (!currentTraveller.email || !currentTraveller.phone) {
        alert("Lead traveller must provide email and phone number");
        return;
      }
    }

    // Add current traveller to list
    const updatedTravellers = [...travellers];
    updatedTravellers[currentIndex] = currentTraveller;
    setTravellers(updatedTravellers);
    if (currentPassportImage) {
      setPassportImages((prev) => ({
        ...prev,
        [`passportImage_${currentIndex}`]: currentPassportImage,
      }));
    }
    // Move to next traveller or submit
    if (currentIndex < totalTravellers - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentTraveller({
        type: getTravellerType(currentIndex + 1),
        title: getTravellerType(currentIndex + 1) === "Adult" ? "Mr" : "Master",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        age: 0,
        gender: "Male",
        isLeadTraveler: false,
        email: "",
        phone: "",
      });
    } else {
      // All travellers added
      onSubmit(updatedTravellers);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentTraveller(travellers[currentIndex - 1]);
    } else {
      onBack();
    }
  };

  const travellerType = getTravellerType(currentIndex);
  const isLeadTravellerAdded = travellers.some((t) => t.isLeadTraveler);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Traveller {currentIndex + 1} of {totalTravellers}
        </h2>
        <p className="text-sm text-gray-500">
          Enter details for {travellerType}
        </p>
        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / totalTravellers) * 100}%`,
            }}
          />
        </div>
      </div>

      <form onSubmit={handleNext}>
        {/* Type Display */}
        <div className="mb-4 p-3 bg-gray-100 rounded-lg">
          <span className="text-sm font-medium text-gray-700">
            Traveller Type:{" "}
            <span className="text-blue-600">{travellerType}</span>
          </span>
        </div>

        {/* Lead Traveller Checkbox */}
        {travellerType === "Adult" && !isLeadTravellerAdded && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isLeadTraveler"
                checked={currentTraveller.isLeadTraveler}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-800">
                This is the Lead Traveller (Primary Contact)
              </span>
            </label>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <select
              name="title"
              value={currentTraveller.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {travellerType === "Adult" && (
                <>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Ms">Ms</option>
                </>
              )}
              {travellerType === "Child" && (
                <>
                  <option value="Master">Master</option>
                  <option value="Miss">Miss</option>
                </>
              )}
              {travellerType === "Infant" && (
                <>
                  <option value="Master">Master</option>
                  <option value="Miss">Miss</option>
                </>
              )}
            </select>
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={currentTraveller.firstName}
              onChange={handleInputChange}
              required
              placeholder="Enter first name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={currentTraveller.lastName}
              onChange={handleInputChange}
              required
              placeholder="Enter last name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth *
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={currentTraveller.dateOfBirth}
              onChange={handleInputChange}
              required
              max={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Age (Auto-calculated) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age
            </label>
            <input
              type="number"
              value={currentTraveller.age}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender *
            </label>
            <select
              name="gender"
              value={currentTraveller.gender}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          {/* Passport Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passport Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setCurrentPassportImage(e.target.files[0]);
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {currentPassportImage && (
              <p className="text-xs text-green-600 mt-1">
                ✓ {currentPassportImage.name}
              </p>
            )}
          </div>

          {/* Email (Required for Lead Traveller) */}
          {(currentTraveller.isLeadTraveler || travellerType === "Adult") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email {currentTraveller.isLeadTraveler && "*"}
              </label>
              <input
                type="email"
                name="email"
                value={currentTraveller.email}
                onChange={handleInputChange}
                required={currentTraveller.isLeadTraveler}
                placeholder="Enter email address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Phone (Required for Lead Traveller) */}
          {(currentTraveller.isLeadTraveler || travellerType === "Adult") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone {currentTraveller.isLeadTraveler && "*"}
              </label>
              <input
                type="tel"
                name="phone"
                value={currentTraveller.phone}
                onChange={handleInputChange}
                required={currentTraveller.isLeadTraveler}
                placeholder="Enter phone number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Info Note */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-600">
            * Please ensure all details match government-issued IDs for smooth
            travel
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <button
            type="button"
            onClick={handlePrevious}
            className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
          >
            {currentIndex === 0 ? "Back to Count" : "Previous Traveller"}
          </button>
          <button
            type="submit"
            className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            {currentIndex < totalTravellers - 1
              ? "Next Traveller"
              : "Review Booking"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TravellerDetailsForm;
