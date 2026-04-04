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
      <div className="relative w-44 h-22 sm:w-52 sm:h-26 md:w-60 md:h-30 lg:w-68 lg:h-34">
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
