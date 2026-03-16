"use client";
import Image from "next/image";
import React from "react";
import { useGetTeamsQuery } from "../../../../store/teamApi/team";

const Team = () => {
  const { data, isLoading, error } = useGetTeamsQuery();

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 animate-pulse">
          {/* Heading skeleton */}
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-10" />

          {/* Team grid skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8 text-center">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-32 h-32 md:w-40 md:h-40 lg:w-44 lg:h-44 bg-gray-200 rounded-md" />
                <div className="h-4 bg-gray-200 rounded w-24 mt-4" />
                <div className="h-3 bg-gray-200 rounded w-16 mt-2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            Team information unavailable at the moment.
          </p>
        </div>
      </section>
    );
  }
  const teamMembers = data?.data || [];

  // Filter only active members if needed
  const activeMembers = teamMembers.filter(
    (member) => member.status === "Active",
  );

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-900 mb-10">
          Our Leadership Team
        </h2>

        {/* Team Grid */}
        {activeMembers.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8 text-center">
            {activeMembers.map((member) => (
              <div key={member._id} className="flex flex-col items-center">
                {/* Photo */}
                <div className="w-32 h-32 md:w-40 md:h-40 lg:w-44 lg:h-50 relative rounded-md overflow-hidden shadow-lg">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-cover"
                  />
                </div>

                {/* Name & Role */}
                <h3 className="mt-4 text-base md:text-lg font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-xs md:text-sm text-gray-600">
                  {member.designation}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">
            No team members available.
          </p>
        )}
      </div>
    </section>
  );
};

export default Team;
