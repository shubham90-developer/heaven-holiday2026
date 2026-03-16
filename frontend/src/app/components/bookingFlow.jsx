"use client";
import React, { useState } from "react";
import TravellerCountForm from "./travellerCountForm";
import TravellerDetailsForm from "./travellerDetailsForm";

import BookingReview from "./bookingReview";
import PaymentSection from "./paymentSection";
import { FaFileInvoice } from "react-icons/fa";
import Link from "next/link";
import EmiModal from "../pages/TourDetails/EmiModal";
import { useCreateBookingMutation } from "store/bookingApi/bookingApi";
import DepartureSelector from "../pages/TourDetails/DepartureSelector";
const BookingFlow = ({ tourData }) => {
  const [passportImages, setPassportImages] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [travellerCount, setTravellerCount] = useState({
    adults: 0,
    children: 0,
    infants: 0,
    total: 0,
  });
  const [travellers, setTravellers] = useState([]);
  const [bookingData, setBookingData] = useState(null);

  const [createBooking, { isLoading: isCreatingBooking }] =
    useCreateBookingMutation();

  const steps = [
    { number: 1, title: "Select Departure", key: "departure" },
    { number: 2, title: "Traveller Count", key: "count" },
    { number: 3, title: "Traveller Details", key: "details" },
    { number: 4, title: "Review Booking", key: "review" },
    { number: 5, title: "Payment", key: "payment" },
  ];

  // Get first departure for default values
  const firstDeparture = tourData?.departures?.[0];
  const departureCity = selectedDate?.city || firstDeparture?.city || "Mumbai";

  // Format departure date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const departureDate = selectedDate?.date
    ? formatDate(selectedDate.date)
    : firstDeparture?.date
      ? formatDate(firstDeparture.date)
      : "28 Nov 2025";

  // Calculate end date based on days
  const calculateEndDate = (startDate, days) => {
    if (!startDate || !days) return "";
    const date = new Date(startDate);
    date.setDate(date.getDate() + days);
    return formatDate(date);
  };

  const endDate =
    (selectedDate?.date || firstDeparture?.date) && tourData?.days
      ? calculateEndDate(
          selectedDate?.date || firstDeparture.date,
          tourData.days,
        )
      : "02 Dec 2025";

  // Get pricing
  const basePrice =
    selectedDate?.price ||
    tourData?.baseJoiningPrice ||
    tourData?.baseFullPackagePrice ||
    30000;
  const formattedPrice = `₹${basePrice.toLocaleString("en-IN")}`;

  // Calculate total price
  const totalPrice = basePrice * travellerCount.total;
  const formattedTotalPrice = `₹${totalPrice.toLocaleString("en-IN")}`;

  // Calculate EMI
  const emiAmount = Math.ceil(basePrice / 12);
  const formattedEmi = `₹${emiAmount.toLocaleString("en-IN")}/month`;

  // Calculate advance payment (20% of total)
  const advanceAmount = Math.ceil(totalPrice * 0.2);
  const formattedAdvance = `₹${advanceAmount.toLocaleString("en-IN")}`;

  const handleDepartureSelect = (departure) => {
    setSelectedDate(departure);
  };

  const handleTravellerCountSubmit = (counts) => {
    setTravellerCount(counts);
    setCurrentStep(3);
  };

  const handleTravellersSubmit = (travellersData) => {
    setTravellers(travellersData);
    setCurrentStep(4);
  };

  const handleBookingConfirm = async () => {
    try {
      const formData = new FormData();

      // append simple fields
      formData.append("tourPackage", tourData._id);
      formData.append(
        "selectedDeparture",
        JSON.stringify({
          departureId: selectedDate?._id || firstDeparture?._id,
          departureCity: departureCity,
          departureDate: selectedDate?.date || firstDeparture?.date,
          packageType: selectedDate?.packageType || "Joining Package",
        }),
      );
      formData.append("travelers", JSON.stringify(travellers));
      formData.append("travelerCount", JSON.stringify(travellerCount));
      formData.append(
        "pricing",
        JSON.stringify({
          totalAmount: totalPrice,
          advanceAmount: advanceAmount,
          paidAmount: 0,
          pendingAmount: totalPrice,
          pricePerPerson: basePrice,
        }),
      );

      // append passport images
      Object.entries(passportImages).forEach(([key, file]) => {
        formData.append(key, file);
      });

      const response = await createBooking(formData).unwrap();
      setBookingData(response.data.booking);
      setCurrentStep(5);
    } catch (error) {
      console.error("Booking creation failed:", error);
      alert("Failed to create booking. Please try again.");
    }
  };

  const handleStepClick = (stepNumber) => {
    if (stepNumber === 1) {
      setCurrentStep(1);
    } else if (stepNumber === 2 && selectedDate) {
      setCurrentStep(2);
    } else if (stepNumber === 3 && travellerCount.total > 0) {
      setCurrentStep(3);
    } else if (stepNumber === 4 && travellers.length > 0) {
      setCurrentStep(4);
    }
  };

  return (
    <section id="booking-section" className="py-10 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        {/* Step Progress */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => handleStepClick(step.number)}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      currentStep >= step.number
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {step.number}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      currentStep >= step.number
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      currentStep > step.number ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Intro */}
        <div className="mb-6">
          <p className="text-md text-black font-bold">
            {currentStep === 1 &&
              "Select departure city, dates & add guest to book your tour"}
            {currentStep === 2 && "How many people are travelling?"}
            {currentStep === 3 && "Enter traveller details"}
            {currentStep === 4 && "Review your booking details"}
            {currentStep === 5 && "Complete your payment"}
          </p>
          <p className="text-sm text-gray-500">
            {currentStep === 1 &&
              "As seats fill, prices increase! So book today!"}
            {currentStep === 2 && "Add adults, children, and infants"}
            {currentStep === 3 &&
              "Provide accurate information for all travellers"}
            {currentStep === 4 && "Verify all details before proceeding"}
            {currentStep === 5 && "Secure your booking with payment"}
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Left: Step Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <div className="bg-white p-5 rounded-xl shadow">
                <DepartureSelector
                  departures={tourData?.departures}
                  onDateSelect={handleDepartureSelect}
                />
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={!selectedDate}
                    className={`px-6 py-3 rounded-lg font-medium transition ${
                      selectedDate
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <TravellerCountForm onSubmit={handleTravellerCountSubmit} />
            )}

            {currentStep === 3 && (
              <TravellerDetailsForm
                travellerCount={travellerCount}
                onSubmit={handleTravellersSubmit}
                onBack={() => setCurrentStep(2)}
                passportImages={passportImages}
                setPassportImages={setPassportImages}
              />
            )}

            {currentStep === 4 && (
              <BookingReview
                tourData={tourData}
                selectedDate={selectedDate}
                departureCity={departureCity}
                departureDate={departureDate}
                endDate={endDate}
                travellerCount={travellerCount}
                travellers={travellers}
                totalPrice={totalPrice}
                advanceAmount={advanceAmount}
                onConfirm={handleBookingConfirm}
                onBack={() => setCurrentStep(3)}
                isLoading={isCreatingBooking}
              />
            )}

            {currentStep === 5 && bookingData && (
              <PaymentSection
                bookingData={bookingData}
                advanceAmount={advanceAmount}
                totalPrice={totalPrice}
              />
            )}
          </div>

          {/* Right: Booking Summary */}
          <div className="bg-white p-5 rounded-xl shadow border border-gray-200">
            {/* Title */}
            <h2 className="flex items-center gap-2 font-semibold text-lg mb-4 border-b pb-2">
              <FaFileInvoice className="text-blue-600" />
              BOOKING SUMMARY
            </h2>

            {/* Dept City */}
            <div className="mb-2 flex justify-between text-sm text-gray-700">
              <span>Dept. city</span>
              <span className="font-medium">{departureCity}</span>
            </div>

            {/* Dept Date */}
            <div className="mb-2 flex justify-between text-sm text-gray-700 break-words">
              <span>Dept. date</span>
              <span className="font-semibold text-black">
                {departureDate} → {endDate}
              </span>
            </div>

            {/* Travellers */}
            <div className="mb-2 flex justify-between text-sm text-gray-700 break-words">
              <span>Travellers</span>
              <span>
                {travellerCount.adults} Adult(s) | {travellerCount.children}{" "}
                Child | {travellerCount.infants} Infant
              </span>
            </div>

            {/* Rooms */}
            <div className="mb-4 flex justify-between text-sm text-gray-700">
              <span>Rooms</span>
              <span>{Math.ceil(travellerCount.adults / 2)} Room(s)</span>
            </div>

            {/* Price Section */}
            <div className="border-t border-dashed pt-4 mb-4">
              <div className="flex justify-between items-start flex-col sm:flex-row mb-2">
                <span className="text-sm font-medium text-black mb-2 sm:mb-0">
                  Basic Price
                </span>
                <div className="flex flex-col items-start sm:items-end">
                  <p className="text-green-600 font-semibold text-xl">
                    {formattedPrice}
                  </p>
                  <p className="text-xs text-gray-500">
                    per person on twin sharing
                  </p>
                </div>
              </div>

              {travellerCount.total > 0 && (
                <div className="flex justify-between items-start flex-col sm:flex-row mb-2">
                  <span className="text-sm font-medium text-black mb-2 sm:mb-0">
                    Total Price
                  </span>
                  <div className="flex flex-col items-start sm:items-end">
                    <p className="text-blue-600 font-bold text-2xl">
                      {formattedTotalPrice}
                    </p>
                    <p className="text-xs text-gray-500">
                      for {travellerCount.total} traveller(s)
                    </p>
                  </div>
                </div>
              )}

              {travellerCount.total > 0 && (
                <div className="flex justify-between items-center mt-2 bg-yellow-50 p-2 rounded">
                  <span className="text-sm font-medium text-gray-700">
                    Advance Payment
                  </span>
                  <span className="font-semibold text-orange-600">
                    {formattedAdvance}
                  </span>
                </div>
              )}

              <div className="mt-2 flex flex-wrap gap-3 text-xs">
                <Link
                  href="#cancellation-policy"
                  className="text-blue-700 underline"
                >
                  Cancellation Policy
                </Link>
              </div>
            </div>

            {/* EMI */}
            <div className="mb-5">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  EMI Available
                </span>
                <span className="font-semibold">{formattedEmi}</span>
              </div>
              <EmiModal />
            </div>

            {/* Contact Info */}
            <div className="border-t border-dashed pt-4 mb-4 text-sm text-gray-700">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-blue-600">📞</span>
                  <span>1800 22 7979</span>
                  <span>|</span>
                  <span>1800 313 5555</span>
                  <span>|</span>
                  <span>1800 22 7979</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">📍</span>
                  <Link
                    href="/contact-us"
                    className="text-blue-600 hover:underline"
                  >
                    Locate nearest Heaven Holiday
                  </Link>
                </div>
              </div>
            </div>

            {/* Progress Indicator */}
            {currentStep < 5 && (
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Booking Progress</span>
                  <span>{Math.round((currentStep / 5) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingFlow;
