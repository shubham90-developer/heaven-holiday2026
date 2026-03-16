"use client";
import Link from "next/link";
import React from "react";
import { useGetContactDetailsQuery } from "store/aboutUsApi/contactApi";

const Excitedtowork = () => {
  const { data, isLoading, error } = useGetContactDetailsQuery();
  if (isLoading) {
    return <p>error</p>;
  }
  if (error) {
    return <p>error</p>;
  }

  return (
    <>
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <p className="text-lg md:text-3xl font-bold text-black">
              Excited to work with us, but don't see your position listed?
            </p>
            <p className="text-lg md:text-xl font-semibold text-black">
              Let us know how you stand out from the crowd.
            </p>
            <p className="text-lg md:text-xl font-semibold text-black mt-10">
              Email your resume at{" "}
              <span className="text-blue-600">
                <Link href={`mailto:${data?.data?.writeToUs?.emails[0]}`}>
                  {data?.data?.writeToUs?.emails[0]}{" "}
                </Link>
              </span>
              and our team will reach out to you.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Excitedtowork;
