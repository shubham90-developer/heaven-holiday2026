"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useGetSettingsQuery } from "store/settings/settingsApi";
const Logo = () => {
  const { data, isLoading, error } = useGetSettingsQuery();

  if (isLoading) {
    return <p>error</p>;
  }
  if (error) {
    return <p>error</p>;
  }

  return (
    <Link href="/" className="block">
      <div className="relative w-24 h-10 sm:w-28 sm:h-12 md:w-30 md:h-15 lg:w-36 lg:h-15">
        <Image
          src={data?.data?.companyLogo || "/public/logo.png"}
          alt="logo"
          fill
          className="object-contain"
          priority
        />
      </div>
    </Link>
  );
};

export default Logo;
