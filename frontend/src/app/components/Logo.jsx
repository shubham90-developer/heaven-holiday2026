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
      <div className="relative w-32 h-14 sm:w-40 sm:h-16 md:w-48 md:h-20 lg:w-56 lg:h-24">
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
