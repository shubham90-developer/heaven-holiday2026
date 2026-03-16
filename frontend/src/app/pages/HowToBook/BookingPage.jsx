"use client";
import React, { useState, useCallback } from "react";
import { useGetOnlineBookingQuery } from "../../../../store/onlineBookingApi/stepsApi";
import { useGetContactDetailsQuery } from "../../../../store/aboutUsApi/contactApi";
import { useCreateEnquiryMutation } from "../../../../store/enquiryApi/enquiryApi";
import { useGetCounterQuery } from "../../../../store/counterApi/counterApi";
/** Utility for conditional classes */
function classNames(...c) {
  return c.filter(Boolean).join(" ");
}

const TABS = [
  { id: "booking", label: "Online Booking" },
  { id: "offices", label: "Sales Offices & Partners" },
  { id: "query", label: "Drop us a Query" },
];

export default function BookingTabs() {
  const [active, setActive] = useState("booking");
  const activeIndex = TABS.findIndex((t) => t.id === active);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    mono: "",
    email: "",
    message: "",
  });

  const onKey = useCallback(
    (e) => {
      if (e.key === "ArrowRight") {
        const next = TABS[(activeIndex + 1) % TABS.length].id;
        setActive(next);
      } else if (e.key === "ArrowLeft") {
        const prev = TABS[(activeIndex - 1 + TABS.length) % TABS.length].id;
        setActive(prev);
      }
    },
    [activeIndex],
  );

  const {
    data: onlineBooking,
    isLoading: onlineBookingLoading,
    error: onlineBookingError,
  } = useGetOnlineBookingQuery();

  const {
    data: contactDetails,
    isLoading: isContactDetailsLoading,
    error: contactDetailsError,
  } = useGetContactDetailsQuery();

  const {
    data: counter,
    isLoading: isCounterLoading,
    error: counterError,
  } = useGetCounterQuery();

  const [createEnquiry, { isLoading: isSubmitting }] =
    useCreateEnquiryMutation();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Add destinations with default value
      const submitData = {
        ...formData,
        destinations: "-",
      };

      await createEnquiry(submitData).unwrap();

      // Success - reset form
      setFormData({
        name: "",
        mono: "",
        email: "",
        message: "",
      });

      alert("Enquiry submitted successfully!");
    } catch (error) {
      console.error("Failed to submit enquiry:", error);
      const errorMessage =
        error?.data?.message || "Failed to submit enquiry. Please try again.";
      alert(errorMessage);
    }
  };

  // Handle form reset
  const handleReset = () => {
    setFormData({
      name: "",
      mono: "",
      email: "",
      message: "",
    });
  };

  if (onlineBookingLoading || isContactDetailsLoading || isCounterLoading) {
    return (
      <div className="w-full bg-gray-100 animate-pulse">
        {/* Tabs Skeleton */}
        <div className="bg-blue-900 py-4">
          <div className="max-w-6xl mx-auto flex justify-center gap-10">
            <div className="h-4 w-32 bg-blue-700 rounded"></div>
            <div className="h-4 w-40 bg-blue-700 rounded"></div>
            <div className="h-4 w-28 bg-blue-700 rounded"></div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">
          {/* Booking Step Skeleton */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="h-4 w-20 bg-gray-300 rounded"></div>
              <div className="h-6 w-48 bg-gray-300 rounded"></div>
              <div className="h-3 w-full bg-gray-200 rounded"></div>
              <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
              <div className="h-3 w-4/6 bg-gray-200 rounded"></div>
            </div>
            <div className="h-60 bg-gray-200 rounded-xl"></div>
          </div>

          {/* Offices Skeleton */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="h-4 w-40 bg-gray-300 rounded"></div>
              <div className="h-3 w-full bg-gray-200 rounded"></div>
              <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
              <div className="h-3 w-4/6 bg-gray-200 rounded"></div>
            </div>
            <div className="bg-gray-200 rounded-lg h-40"></div>
          </div>

          {/* Query Form Skeleton */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="h-6 w-40 bg-gray-300 rounded"></div>
              <div className="h-10 w-full bg-gray-200 rounded"></div>
              <div className="h-10 w-full bg-gray-200 rounded"></div>
              <div className="h-10 w-full bg-gray-200 rounded"></div>
              <div className="h-24 w-full bg-gray-200 rounded"></div>
            </div>
            <div className="bg-gray-200 rounded-lg h-48"></div>
          </div>
        </div>
      </div>
    );
  }

  if (onlineBookingError || contactDetailsError || counterError) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-red-600">
            Failed to load data. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  const bookingData = onlineBooking?.data;
  const steps = bookingData?.steps || [];

  return (
    <div className="w-full text-gray-800 bg-gray-100">
      {/* Top Tabs */}
      <div className="bg-blue-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div
            role="tablist"
            aria-label="Page sections"
            className="flex justify-center items-center gap-8 py-3"
            onKeyDown={onKey}
          >
            {TABS.map((t) => {
              const isActive = t.id === active;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`${t.id}-panel`}
                  onClick={() => setActive(t.id)}
                  className={classNames(
                    "pb-2 px-1 text-sm cursor-pointer md:text-base focus:outline-none",
                    isActive
                      ? "border-b-2 border-white font-semibold"
                      : "text-blue-200 hover:text-white",
                  )}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-12">
        {/* Online Booking */}
        <section
          id="booking-panel"
          role="tabpanel"
          aria-labelledby="booking"
          hidden={active !== "booking"}
        >
          <div className="mb-10">
            <p className="text-sm font-bold text-black">
              {bookingData?.title || "Registration or Login"}
            </p>
            <div
              className="mt-1 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: bookingData?.description || "",
              }}
            />
          </div>
          <div className="space-y-10">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={step.stepNo}
                  className="grid md:grid-cols-2 gap-8 items-center"
                >
                  {/* Text Content */}
                  <div className={isEven ? "" : "md:order-2 order-1"}>
                    <h3 className="text-sm font-semibold text-gray-600">
                      Step {step.stepNo}
                    </h3>
                    <h2 className="text-2xl font-bold mt-2">
                      {step.stepTitle}
                    </h2>
                    <div
                      className="mt-4 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: step.stepDescription }}
                    />
                  </div>

                  {/* Image */}
                  <div
                    className={classNames(
                      "rounded-xl p-6",
                      isEven ? "bg-yellow-50" : "bg-gray-50 md:order-1 order-2",
                    )}
                  >
                    <img
                      src={step.image}
                      alt={step.stepTitle}
                      className="w-full h-auto rounded shadow"
                      onError={(e) => {
                        e.currentTarget.src = `data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='260'><rect width='100%' height='100%' fill='${isEven ? "%23fef3c7" : "%23eef2ff"}'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23707b7c' font-size='20'>${step.stepTitle}</text></svg>`;
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Sales Offices & Partners */}
        <section
          id="offices-panel"
          role="tabpanel"
          aria-labelledby="offices"
          hidden={active !== "offices"}
        >
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">
              You can visit any of our Sales Offices or Sales Partner's offices
              in India. At the time of booking, please ensure you carry the
              following:
            </h2>
            <p>Find the nearest Heaven Holiday</p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-sm leading-relaxed space-y-3">
                <p>
                  <strong>Travel Documents</strong>
                  <br />
                  Ensure you carry required documents (photo ID, passport, visa
                  where applicable).
                </p>

                <p>
                  <strong>Registration amount</strong>
                  <br />
                  Typical registration is 40% of the tour price (payable at
                  booking).
                </p>

                <p>
                  <strong>Payment</strong>
                  <br />
                  Multiple modes accepted: Cards, Netbanking, UPI, Wallets, etc.
                </p>

                <p>
                  <strong>Cancellation & Changes</strong>
                  <br />
                  Changes or cancellations are subject to the program's policy
                  and cancellation charges.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 text-sm">
                <h3 className="font-semibold mb-2">Contact & Support</h3>
                <p>
                  For bookings & queries call:
                  <br />
                  <a
                    href={`tel:${contactDetails?.data?.callUs?.phoneNumbers[0]}`}
                    className="text-blue-600"
                  >
                    {contactDetails?.data?.callUs?.phoneNumbers[0]}
                  </a>{" "}
                  |{" "}
                  <a
                    href={`tel:${contactDetails?.data?.callUs?.phoneNumbers[1]}`}
                    className="text-blue-600"
                  >
                    {contactDetails?.data?.callUs?.phoneNumbers[1]}
                  </a>
                </p>
                <p className="mt-3">
                  Or email:{" "}
                  <a
                    href={`mailto:${contactDetails?.data?.writeToUs?.emails[0]}`}
                    className="text-blue-600"
                  >
                    {contactDetails?.data?.writeToUs?.emails[0]}
                  </a>{" "}
                  |{" "}
                  <a
                    href={`mailto:${contactDetails?.data?.writeToUs?.emails[1]}`}
                    className="text-blue-600"
                  >
                    {contactDetails?.data?.writeToUs?.emails[1]}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Drop us a Query */}
        <section
          id="query-panel"
          role="tabpanel"
          aria-labelledby="query"
          hidden={active !== "query"}
        >
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <h2 className="text-2xl font-bold">Drop us a Query</h2>
              <p className="mt-3 text-sm leading-relaxed">
                Call or email us and our team will respond within 24 hours.
              </p>
              <div className="mt-4 text-sm space-y-1">
                <p>
                  <strong>Phone:</strong>{" "}
                  <a
                    href={`tel:${contactDetails?.data?.callUs?.phoneNumbers[0]}`}
                    className="text-blue-600"
                  >
                    {contactDetails?.data?.callUs?.phoneNumbers[0]}
                  </a>
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  <a
                    href={`mailto:${contactDetails?.data?.writeToUs?.emails[0]}`}
                    className="text-blue-600"
                  >
                    {contactDetails?.data?.writeToUs?.emails[0]}
                  </a>
                </p>
              </div>

              {/* quick contact form (now functional) */}
              <form onSubmit={handleSubmit} className="mt-6 space-y-3 max-w-lg">
                <input
                  className="w-full border rounded px-3 py-2 text-sm"
                  placeholder="Your name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  required
                />
                <input
                  className="w-full border rounded px-3 py-2 text-sm"
                  placeholder="Phone number"
                  name="mono"
                  value={formData.mono}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  required
                />
                <input
                  className="w-full border rounded px-3 py-2 text-sm"
                  placeholder="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  required
                />
                <textarea
                  className="w-full border rounded px-3 py-2 text-sm"
                  rows={4}
                  placeholder="Tell us your query... (min 10 characters)"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  required
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 border rounded"
                    onClick={handleReset}
                    disabled={isSubmitting}
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Why choose us?</h3>
              <ul className="text-sm space-y-2">
                <li>✔ {counter?.data?.guests} Happy guests</li>
                <li>✔ {counter?.data?.toursCompleted} Successful tours</li>
                <li>✔ {counter?.data?.tourDestination} Tour Destinations</li>
                <li>✔ {counter?.data?.tourExpert} Tour Experts</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
