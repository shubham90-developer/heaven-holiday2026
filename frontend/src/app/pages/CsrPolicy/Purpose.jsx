"use client";
import React from "react";
import { useGetPurposePolicyQuery } from "../../../../store/csrPolicy/purposePolicyApi";
const array = [
  {
    id: 1,
    name: "To lay down guidelines to make CSR a key business process for economic and ecological sustainable development and to aim in enhancing welfare measures of the society.",
    img: "/assets/img/csr/purpose-1.svg",
  },
  {
    id: 2,
    name: "To pursue CSR Programmes primarily in areas those fall within the economic vicinity of the Company's operations to enable close supervision and ensure maximum development impact.",
    img: "/assets/img/csr/purpose-2.svg",
  },
];

const PurposePolicy = () => {
  const { data, isLoading, error } = useGetPurposePolicyQuery();

  if (isLoading) {
    return (
      <section className="py-10 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center animate-pulse">
          {/* Heading skeleton */}
          <div className="h-7 bg-gray-200 rounded w-64 mx-auto mb-3" />
          {/* Underline skeleton */}
          <div className="flex justify-center mb-8">
            <div className="h-3 bg-gray-200 rounded w-40" />
          </div>
          {/* Paragraph skeleton */}
          <div className="space-y-2 mb-8">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto" />
            <div className="h-4 bg-gray-200 rounded w-4/6 mx-auto" />
          </div>

          {/* Cards grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="flex bg-gray-200 p-10 rounded-xl items-center flex-col gap-4"
              >
                <div className="w-20 h-20 bg-gray-300 rounded-full" />
                <div className="space-y-2 w-full">
                  <div className="h-3 bg-gray-300 rounded w-full" />
                  <div className="h-3 bg-gray-300 rounded w-5/6 mx-auto" />
                  <div className="h-3 bg-gray-300 rounded w-4/6 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-10 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            Content unavailable at the moment.
          </p>
        </div>
      </section>
    );
  }
  const responce = data.data;

  const cards = responce?.cards || [];
  const filteredCards = cards.filter((item) => {
    return item.status == "Active";
  });
  return (
    <section className="py-10 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-2xl md:text-2xl text-center font-bold mb-3">
          {responce?.heading || ""}
        </h2>

        {/* Underline Image */}
        <div className="flex justify-center mb-8">
          <img
            src="/assets/img/header-bottom.svg" // 👉 replace with your underline image path
            alt="underline"
            className="w-40 md:w-50"
          />
        </div>
        {/* Paragraph */}
        <p
          className="text-gray-700 text-sm md:text-base leading-relaxed mb-8"
          dangerouslySetInnerHTML={{ __html: responce?.subtitle || "" }}
        ></p>

        {/* grid cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredCards.map((item) => (
            <div
              key={item._id}
              className="flex bg-gray-200 p-10 rounded-xl items-center flex-col gap-4"
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-20 h-20 rounded-full bg-gray-100 p-2"
                />
              </div>

              {/* Content */}
              <div className="flex-grow">
                <h3
                  className="text-xs font-semibold"
                  dangerouslySetInnerHTML={{
                    __html: item.description || "",
                  }}
                ></h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PurposePolicy;
