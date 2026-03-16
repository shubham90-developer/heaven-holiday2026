"use client";
import { useGetManagementQuery } from "../../../../store/csrPolicy/philosophyApi";
import React from "react";

const array = [
  {
    id: 1,
    name: "responsibility towards the community",
    img: "/assets/img/csr/list-1.svg",
  },
  {
    id: 2,
    name: "Company Ethics",
    img: "/assets/img/csr/list-2.svg",
  },
  {
    id: 3,
    name: "sustainable development",
    img: "/assets/img/csr/list-3.svg",
  },
  {
    id: 4,
    name: "crafting unique models",
    img: "/assets/img/csr/list-4.svg",
  },
];

const Management = () => {
  const { data, isLoading, error } = useGetManagementQuery();

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center flex-col gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full" />
                <div className="h-3 bg-gray-200 rounded w-24" />
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
  const activeCards = cards.filter((item) => {
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
          dangerouslySetInnerHTML={{ __html: responce?.paragraph || "" }}
        ></p>

        {/* grid cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {activeCards.map((item) => (
            <div key={item._id} className="flex items-center flex-col gap-4">
              {/* Icon */}
              <div className="flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-full bg-gray-100 p-2"
                />
              </div>

              {/* Content */}
              <div className="flex-grow">
                <h3 className="text-xs font-semibold">{item.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Management;
