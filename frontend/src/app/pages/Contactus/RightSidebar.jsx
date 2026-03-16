"use client";
import { Globe, Mail, Phone } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useGetTourPackageQuery } from "../../../../store/toursManagement/toursPackagesApi";
import { useGetContactFeaturesQuery } from "../../../../store/contact-office/contactInfoBoxApi";
import { useGetContactDetailsQuery } from "../../../../store/aboutUsApi/contactApi";
import { useGetTourManagerDirectoryQuery } from "../../../../store/toursManagement/tourManagersApi";
import { useCreateEnquiryMutation } from "../../../../store/enquiryApi/enquiryApi";
import { useGetSettingsQuery } from "store/settings/settingsApi";
import toast from "react-hot-toast";

const RightSidebar = () => {
  const featureImage = [
    "/assets/img/contact/contact-feature-1.svg",
    "/assets/img/contact/contact-feature-2.svg",
    "/assets/img/contact/contact-feature-3.svg",
    "/assets/img/contact/contact-feature-4.svg",
  ];

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    mono: "",
  });

  const [createEnquiry, { isLoading: isSubmitting }] =
    useCreateEnquiryMutation();

  // All API calls
  const {
    data: tourPackages,
    isLoading: isPackagesLoading,
    error: packagesError,
  } = useGetTourPackageQuery();

  const {
    data: tourManagementTeam,
    isLoading: tourManagementTeamLoading,
    error: tourManagementTeamError,
  } = useGetTourManagerDirectoryQuery();

  const {
    data: contactFeatures,
    isLoading: isContactFeaturesLoading,
    error: contactFeaturesError,
  } = useGetContactFeaturesQuery();

  const {
    data: contactDetails,
    isLoading: isContactDetailsLoading,
    error: contactDetailsError,
  } = useGetContactDetailsQuery();

  const {
    data: settings,
    isLoading: settingsLoading,
    error: settingsError,
  } = useGetSettingsQuery();

  // Handle form submission

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.mono) {
      toast.error("Please fill all fields!");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.mono)) {
      toast.error("Mobile number must be exactly 10 digits!");
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

  // Handle loading state for all queries
  if (
    isPackagesLoading ||
    tourManagementTeamLoading ||
    isContactFeaturesLoading ||
    isContactDetailsLoading ||
    settingsLoading
  ) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </section>
    );
  }

  // Handle error state for all queries
  if (
    packagesError ||
    tourManagementTeamError ||
    contactFeaturesError ||
    contactDetailsError ||
    settingsError
  ) {
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

  // Extract data after loading/error checks
  const packages = tourPackages?.data?.packages || [];
  const activePackages = packages.filter((item) => item.status === "Active");

  const contFeatures = contactFeatures?.data;
  const features = contFeatures?.features || [];
  const activeFeatures = features.filter((item) => item.isActive === true);

  return (
    <div className="space-y-6">
      {/* Contact Form */}
      <div className="bg-gray-100 shadow rounded-lg p-4">
        <h3 className="font-semibold text-sm mb-3">Want us to call you?</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border rounded-xl p-2 py-3 text-xs mb-2 border-gray-300"
            required
          />
          <input
            type="tel"
            placeholder="Mobile Number"
            value={formData.mono}
            onChange={(e) => setFormData({ ...formData, mono: e.target.value })}
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
            <span>{isSubmitting ? "Submitting..." : "Request Call Back"}</span>
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
                href={`tel:+91${settings?.data?.nriOutsideIndia || ""}`}
                className="text-blue-600 font-bold"
              >
                +91 {settings?.data?.nriOutsideIndia || ""}
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

      {/* Banners */}
      <div className="grid grid-cols-1 gap-4">
        {activePackages &&
          activePackages.map((item) => (
            <div
              key={item._id}
              className="relative rounded-xl overflow-hidden shadow h-64"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: item.image ? `url(${item.image})` : "none",
                  backgroundColor: item.image ? "transparent" : "#f3f4f6",
                }}
              >
                {/* Title Overlay */}
                {item.badge && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 text-white font-semibold text-sm bg-black/40 px-3 py-1 rounded-lg">
                    {item.badge}
                  </div>
                )}
              </div>

              {/* Info Box */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[90%] bg-white/90 backdrop-blur-md text-center rounded-xl shadow p-3 text-xs font-medium">
                <p>
                  <span className="font-bold">{item.tours}</span> tours |{" "}
                  <span className="font-bold">{item.departures}</span>{" "}
                  departures
                </p>
                <p className="font-bold mt-1">
                  Travel in &#8377;{item.price} Only
                </p>
              </div>
            </div>
          ))}
      </div>

      {/* Tour Manager */}
      <div className="bg-gray-900 shadow rounded-lg flex gap-3 items-center p-4">
        <img
          src="/assets/img/contact/contact-tm.avif"
          alt="Tour Manager"
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div>
          <p className="font-semibold text-sm text-yellow-300">
            The Heaven Holiday Tour Manager
          </p>
          <p
            className="text-xs text-white"
            dangerouslySetInnerHTML={{
              __html: tourManagementTeam?.data?.heading || "",
            }}
          ></p>
        </div>
      </div>

      {/* Info Box */}
      <div className="rounded-xl p-5 text-white text-sm bg-linear-to-b from-blue-800 to-blue-900 space-y-5 shadow">
        {/* All-inclusive tours */}
        {activeFeatures &&
          activeFeatures.map((item, index) => (
            <div key={item._id} className="flex items-start gap-3">
              <img
                src={featureImage[index]}
                alt={item.title}
                className="w-7 h-7"
              />
              <div>
                <p className="font-semibold">{item.title || ""}</p>
                <p
                  className="text-xs mt-1"
                  dangerouslySetInnerHTML={{ __html: item.description || "" }}
                ></p>
              </div>
            </div>
          ))}

        {/* Bottom Highlight Box */}
        <div className="bg-gray-100 text-gray-800 rounded-lg p-4 mt-2 text-center shadow-inner">
          <p className="italic text-gray-600 text-xs mb-2">
            {contFeatures?.highlight?.message || ""}
          </p>
          <div className="flex justify-around font-semibold">
            <div>
              <p className="text-lg">
                {contFeatures?.highlight?.happyTravellers || ""}
              </p>
              <p className="text-xs text-gray-500">happy travellers</p>
            </div>
            <div>
              <p className="text-lg">
                {contFeatures?.highlight?.successfulTours || ""}
              </p>
              <p className="text-xs text-gray-500">successful tours</p>
            </div>
          </div>
        </div>
      </div>

      {/* Corporate Office */}
      <div className="bg-[#06192f] text-white rounded-lg p-5 shadow-md space-y-3">
        {/* Heading */}
        <h3 className="text-yellow-400 font-bold text-base">
          Corporate Office
        </h3>

        {/* Address */}
        <p
          className="text-xs leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: contactDetails?.data?.offices?.description || "",
          }}
        />

        {/* Get Directions */}
        <div className="flex items-center gap-2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
            alt="map icon"
            className="w-4 h-4"
          />
          <Link
            href={contactDetails?.data?.offices?.mapLink || "#"}
            className="text-blue-300 hover:underline text-xs font-semibold"
          >
            Get Directions
          </Link>
        </div>

        {/* Contact Info */}
        <div className="flex justify-between items-center text-xs pt-2 border-t border-white/10">
          <p>
            For <span className="font-semibold">Foreign Nationals</span> only
          </p>
          <p className="font-semibold">Working Hours</p>
        </div>

        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
              alt="whatsapp"
              className="w-4 h-4"
            />
            <span className="font-semibold text-green-400">
              +91 {settings?.data?.nriOutsideIndia || ""}
            </span>
          </div>
          <p className="font-bold">
            {settings?.data?.businessHoursFrom} to{" "}
            {settings?.data?.businessHoursTo}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
