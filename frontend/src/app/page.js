import Image from "next/image";
import HeroBanner from "@/app/pages/Hero/HomeBanner";
import Tourscards from "@/app/pages/Hero/Tourscards";
import TravalPlanCards from "@/app/pages/Hero/TravalPlanCards";
import OfferBanner from "@/app/pages/Hero/OfferBanner";
import TabCards from "@/app/pages/Hero/TabCards";
import BookingBanner from "@/app/pages/Hero/BookingBanner";
import TourPackagescards from "@/app/pages/Hero/TourPackagescards";
import TourReview from "@/app/components/TourReview";
import Banner from "@/app/pages/Hero/Banner";
import AllInclusive from "@/app/pages/Hero/AllInclusive";
import Counter from "@/app/components/Counter";
import DiscoverWorld from "@/app/pages/Hero/DiscoverWorld";
import DiscoverWorldSlide from "@/app/pages/Hero/DiscoverWorldSlide";
import DekhoApnaDesh from "@/app/pages/Hero/DekhoApnaDesh";
import TravalTips from "@/app/pages/Hero/TravalTips";
import TravalStories from "@/app/pages/Hero/TravalStories";
import PackagesCard from "@/app/pages/Hero/PackagesCard";

export default function Home() {
  return (
    <>
      {/* Hidden reCAPTCHA container for Firebase */}
      <div id="recaptcha-container" style={{ display: "none" }}></div>

      <HeroBanner />
      <Tourscards />
      <TravalPlanCards />
      <OfferBanner />
      <TabCards />
      <BookingBanner />
      <TourPackagescards />
      <TourReview />
      <Banner />
      <AllInclusive />
      <Counter />
      <DiscoverWorld />
      <DiscoverWorldSlide />
      <DekhoApnaDesh />
      <TravalTips />
      <TravalStories />
      <PackagesCard />
    </>
  );
}
