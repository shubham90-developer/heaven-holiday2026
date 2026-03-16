"use client";
import Image from "next/image";
import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useGetAllCardsQuery } from "store/becomeSalesPartner/cardAPi";
import { useCreateFormMutation } from "store/becomeSalesPartner/formAPi";
const PartnerStepper = () => {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState(null);
  const { data, isLoading, error } = useGetAllCardsQuery();
  const [createForm, { isLoading: isSubmitting }] = useCreateFormMutation();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    city: "",
    pincode: "",
    state: "",
    message: "",
  });
  if (isLoading) {
    return <p>loading</p>;
  }
  if (error) {
    return <p>error</p>;
  }
  const cards = data?.data || [];
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedCard = cards.find((item) => item._id == selected);
    const cardTitle = selectedCard?.title;

    try {
      await createForm({
        ...formData,
        cardTitle: cardTitle,
      }).unwrap();

      alert("Application submitted successfully!");

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        country: "",
        city: "",
        pincode: "",
        state: "",
        message: "",
      });
      setSelected(null);
      setStep(1);
    } catch (err) {
      console.error("Failed to submit application:", err);
      alert("Failed to submit application. Please try again.");
    }
  };

  const selectedCard = cards.find((item) => {
    return item._id == selected;
  });
  const cardTitle = selectedCard?.title;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow p-6 md:p-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 border-b pb-4 border-gray-200">
          <div className="mb-2 md:mb-0">
            <h2 className="text-xl font-bold text-gray-800">
              Earn with every booking
            </h2>
            <p className="text-sm text-gray-500">
              Apply now to be a part of Heaven Holiday
            </p>
          </div>
          <p className="text-sm text-gray-500">{step} / 2 Steps</p>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <>
            <h3 className="text-center text-lg font-medium text-gray-800 mb-8">
              Choose your association with Heaven Holiday!
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {cards.map((opt) => (
                <div
                  key={opt._id}
                  onClick={() => setSelected(opt._id)}
                  className={`relative border rounded-lg p-6 cursor-pointer transition hover:shadow-md ${
                    selected === opt._id
                      ? "border-blue-800 shadow-md"
                      : "border-gray-300"
                  }`}
                >
                  {selected === opt._id && (
                    <FaCheckCircle className="absolute top-4 right-4 text-blue-800 text-lg" />
                  )}

                  <div className="flex justify-center mb-4">
                    <Image
                      src={opt.icon}
                      alt={opt.title}
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>

                  <h4 className="text-blue-600 font-semibold text-center mb-4">
                    {opt.title || ""}
                  </h4>

                  <p
                    className="text-sm text-gray-600 space-y-2 mb-4"
                    dangerouslySetInnerHTML={{
                      __html: opt.description || "",
                    }}
                  />

                  <p className="text-sm font-medium text-gray-700">
                    Currently open for:
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {opt.cities.map((loc) => (
                      <span
                        key={loc._id}
                        className="px-3 py-1 text-xs bg-gray-100 rounded-full text-gray-700"
                      >
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-8">
              <button
                disabled={!selected}
                onClick={() => setStep(2)}
                className={`${
                  selected
                    ? "bg-red-700 hover:bg-yellow-500"
                    : "bg-gray-300 cursor-not-allowed"
                } text-gray-800 font-semibold px-6 py-2 rounded`}
              >
                Continue to Apply →
              </button>
            </div>
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <h3 className="text-center text-lg font-medium text-gray-800 mb-8">
              {cardTitle} Application
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name*"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-blue-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email ID*"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-blue-500"
                />
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center border rounded px-3 py-2">
                  <span className="mr-2">🇮🇳</span>
                  <span className="mr-2 text-gray-600">+91</span>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number*"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="flex-1 outline-none text-sm"
                  />
                </div>
                <input
                  type="text"
                  name="address"
                  placeholder="Address*"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-blue-500"
                />
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-blue-500"
                >
                  <option value="">Country</option>
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                </select>
                <input
                  type="text"
                  name="city"
                  placeholder="City*"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-blue-500"
                />
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode*"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-blue-500"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State*"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-blue-500"
                />
              </div>

              <textarea
                name="message"
                placeholder="Tell us why do you want to associate with Heaven Holiday? (Optional)"
                value={formData.message}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-blue-500"
                rows="3"
              ></textarea>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-blue-700 hover:underline text-sm"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-red-700 hover:bg-yellow-500 text-gray-800 font-semibold px-6 py-2 rounded disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Send Application →"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default PartnerStepper;
