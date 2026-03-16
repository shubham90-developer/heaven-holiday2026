"use client";
import Link from "next/link";
import React from "react";
import { FaFilePdf } from "react-icons/fa";
import { useGetAnnualReturnQuery } from "../../../../store/annualReturn/annualReturnApi";

const AnnualReturn = () => {
  const {
    data: AnnualReturn,
    isLoading: AnnualReturnLoading,
    error: AnnualReturnError,
  } = useGetAnnualReturnQuery();

  if (AnnualReturnLoading) {
    return (
      <>
        {/* Hero Skeleton */}
        <section className="py-20 bg-gray-300 animate-pulse">
          <div className="max-w-6xl mx-auto text-center">
            <div className="h-10 bg-gray-400 rounded w-64 mx-auto" />
          </div>
        </section>

        {/* Table Skeleton */}
        <section className="py-10 bg-gray-100">
          <div className="max-w-2xl mx-auto px-4">
            <div className="overflow-x-auto bg-white shadow-md rounded-lg animate-pulse">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-900">
                    <th className="px-6 py-3">
                      <div className="h-4 bg-blue-700 rounded w-16" />
                    </th>
                    <th className="px-6 py-3">
                      <div className="h-4 bg-blue-700 rounded w-24" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(4)].map((_, i) => (
                    <tr key={i} className="border-b">
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-32" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-24" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (AnnualReturnError) {
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

  const annualReturnData = AnnualReturn?.data;
  const items = annualReturnData?.items || [];

  return (
    <>
      <section
        className="py-20 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.2)), url(/assets/img/annual-return/1.avif)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-white">
            <p className="text-5xl font-bold">Annual Return</p>
          </div>
        </div>
      </section>

      {/* table */}
      <section className="py-10 bg-gray-100">
        <div className="max-w-2xl mx-auto px-4">
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="w-full border-collapse">
              {/* Table Head */}
              <thead>
                <tr className="bg-blue-900 text-white text-left">
                  <th className="px-6 py-3 text-white font-semibold">Title</th>
                  <th className="px-6 py-3 text-white font-semibold">
                    Particulars
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <tr
                      key={item._id}
                      className={
                        index !== items.length - 1
                          ? "border-b hover:bg-gray-50"
                          : "hover:bg-gray-50"
                      }
                    >
                      <td className="px-6 py-4">{item.title}</td>
                      <td className="px-6 py-4">
                        <Link
                          href={`https://docs.google.com/viewer?url=${encodeURIComponent(item.particulars)}`}
                          className="flex items-center cursor-pointer gap-2 text-red-600 hover:text-red-800"
                          target="_blank"
                        >
                          <FaFilePdf /> View PDF
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="2"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No annual returns available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default AnnualReturn;
