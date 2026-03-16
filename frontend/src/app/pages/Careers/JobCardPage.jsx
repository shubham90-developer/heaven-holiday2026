"use client";
import { Clock, MapPin } from "lucide-react";
import Link from "next/link";
import React, { useState, useMemo } from "react";
import {
  useGetLocationsQuery,
  useGetDepartmentsQuery,
  useGetJobPageQuery,
} from "../../../../store/careers/jobOpeningApi";

const JobCard = ({ job }) => {
  return (
    <div className="border border-gray-100 rounded-lg shadow-sm p-5 bg-white hover:shadow-md transition">
      <Link href={`careers/${job._id}`}>
        <p className="text-sm text-black font-bold">
          {job.department?.name || job.department}
        </p>
        <h3 className="text-base font-semibold text-blue-800 mt-1">
          {job.jobTitle}
        </h3>
        <div className="mt-3 space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-600" />
            <span>{job.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-600" />
            <span>{job.location?.name || job.location}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

const JobCardPage = () => {
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");

  const {
    data: locationData,
    error: locationError,
    isLoading: locationLoading,
  } = useGetLocationsQuery();
  const {
    data: departmentData,
    error: departmentError,
    isLoading: departmentLoading,
  } = useGetDepartmentsQuery();
  const {
    data: jobsData,
    error: jobsError,
    isLoading: jobsLoading,
  } = useGetJobPageQuery();

  // Extract jobs array from API response
  const jobs = useMemo(() => {
    return jobsData?.data?.jobs || [];
  }, [jobsData]);

  // Extract locations for dropdown
  const locations = useMemo(() => {
    return locationData?.data || [];
  }, [locationData]);

  // Extract departments for dropdown
  const departments = useMemo(() => {
    return departmentData?.data || [];
  }, [departmentData]);

  // Filter jobs based on selected filters
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const departmentMatch =
        departmentFilter === "All" ||
        job.department?._id === departmentFilter ||
        job.department?.name === departmentFilter;

      const locationMatch =
        locationFilter === "All" ||
        job.location?._id === locationFilter ||
        job.location?.name === locationFilter;

      return departmentMatch && locationMatch;
    });
  }, [jobs, departmentFilter, locationFilter]);

  if (jobsLoading || locationLoading || departmentLoading) {
    return (
      <section className="py-10 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-gray-600">Loading...</p>
        </div>
      </section>
    );
  }

  if (jobsError || locationError || departmentError) {
    return (
      <section className="py-10 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-red-600">
            Error loading data. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-10 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 ">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {jobsData?.data?.title || "Current Openings"}
              </h1>
              <p className="text-gray-600">
                {jobsData?.data?.subtitle ||
                  "We're currently looking to fill the following roles on our team."}
              </p>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm text-gray-700"
              >
                <option value="All">All departments</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>

              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm text-gray-700"
              >
                <option value="All">All locations</option>
                {locations.map((loc) => (
                  <option key={loc._id} value={loc._id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Job Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => <JobCard key={job._id} job={job} />)
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-600">
                  No jobs found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default JobCardPage;
