"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useGetOfferBannerQuery } from "store/offer-banner/offer-bannerApi";
const Banner = () => {
  const { data, isLoading, error } = useGetOfferBannerQuery();
  if (isLoading) {
    return <>loading</>;
  }
  if (error) {
    return <p>error</p>;
  }

  return (
    <>
      <section className="w-full relative py-10 bg-gray-50 z-0">
        <div className="max-w-6xl mx-auto">
          <Link href="/tour-list">
            <div className="h-50 w-full">
              <Image
                src={data?.data[0]?.banners[0].image || ""}
                alt=""
                width={1000}
                height={600}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Banner;
