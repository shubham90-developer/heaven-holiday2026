"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Phone, MapPin } from "lucide-react";
import Breadcrumb from "@/app/components/Breadcum";
import { FiPhone } from "react-icons/fi";
import Image from "next/image";
import { useGetOfferBannerQuery } from "store/offer-banner/offer-bannerApi";
import { useCreateEnquiryMutation } from "store/enquiryApi/enquiryApi";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
const CorporateTravel = () => {
  const {
    data: banner,
    isLoading: bannerLoading,
    error: bannerError,
  } = useGetOfferBannerQuery();

  const [createEnquiry, { isLoading: isSubmitting }] =
    useCreateEnquiryMutation();
  const [countryCode, setCountryCode] = useState("91");
  const [formData, setFormData] = useState({
    name: "",
    mono: "",
    email: "",
    message: "",
    modeOfCommunication: "call",
    destinations: "-",
  });
  if (bannerLoading) {
    return <p>loading</p>;
  }
  if (bannerError) {
    return <p>error</p>;
  }

  const banners = banner?.data[0]?.banners?.filter((item) => {
    return item.status == "active";
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEnquiry({
        ...formData,
        mono: `+${countryCode} ${formData.mono}`,
      }).unwrap();
      alert("Enquiry submitted successfully!");
      setFormData({
        name: "",
        mono: "",
        email: "",
        message: "",
        modeOfCommunication: "call",
        destinations: "-",
      });
      setCountryCode("");
    } catch (err) {
      console.error("Failed to submit enquiry:", err);
      alert("Failed to submit enquiry. Please try again.");
    }
  };
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Corporate Travel", href: null },
        ]}
      />

      {/* ====== Full Background Slider Section ====== */}
      <section className="relative w-full h-[600px] md:h-[500px] overflow-hidden">
        {/* Background Swiper */}
        <Swiper
          modules={[Autoplay, Navigation]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          navigation
          loop={banners?.length > 1}
          slidesPerView={1}
          spaceBetween={0}
          speed={800}
          className="w-full h-full"
        >
          {banners &&
            banners.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full">
                  <Image
                    src={img.image}
                    alt={`Corporate Slide ${index + 1}`}
                    fill
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>

        {/* ===== Fixed Form on Top Right ===== */}
        <div className="absolute top-10 right-10 bg-white shadow-2xl rounded-xl p-6 md:p-8 w-[90%] md:w-[380px] z-20">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                required
              />
            </div>

            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
              <PhoneInput
                country={"in"}
                value={countryCode}
                onChange={(value, data) => setCountryCode(data.dialCode)}
                inputStyle={{ display: "none" }}
                buttonStyle={{
                  background: "transparent",
                  border: "none",
                  position: "relative",
                }}
                containerStyle={{ width: "auto", marginBottom: 0 }}
              />
              <span className="text-gray-600 pr-3 border-r border-gray-300">
                +{countryCode}
              </span>
              <input
                type="text"
                name="mono"
                value={formData.mono}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className="flex-1 pl-3 outline-none text-sm"
                required
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
            </div>

            <div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us everything that's on your mind."
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-yellow-500"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-yellow-400 text-gray-800 font-semibold py-2 rounded-md hover:bg-yellow-500 transition"
            >
              <Phone size={16} />{" "}
              {isSubmitting ? "Submitting..." : "Request Call Back"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default CorporateTravel;
