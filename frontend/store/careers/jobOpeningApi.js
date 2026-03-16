// features/department/departmentApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// -------------------- Department API --------------------
export const departmentApi = createApi({
  reducerPath: "departmentApi",
  baseQuery,
  tagTypes: ["Department"],
  endpoints: (builder) => ({
    getDepartments: builder.query({
      query: (isActive) =>
        isActive !== undefined
          ? `/careers-department/?isActive=${isActive}`
          : `/careers-department/department`,
      providesTags: ["Department"],
    }),
  }),
});

export const { useGetDepartmentsQuery } = departmentApi;

// -------------------- Location API --------------------
export const locationApi = createApi({
  reducerPath: "locationApi",
  baseQuery,
  tagTypes: ["Location"],
  endpoints: (builder) => ({
    getLocations: builder.query({
      query: (isActive) =>
        isActive !== undefined
          ? `/careers-location/?isActive=${isActive}`
          : `/careers-location/location`,
      providesTags: ["Location"],
    }),
  }),
});

export const { useGetLocationsQuery } = locationApi;

// -------------------- Jobs API --------------------
export const jobsApi = createApi({
  reducerPath: "jobsApi",
  baseQuery,
  tagTypes: ["Jobs"],
  endpoints: (builder) => ({
    getJobPage: builder.query({
      query: () => `/careers-jobs/job/page`,
      providesTags: ["Jobs"],
    }),
  }),
});

export const { useGetJobPageQuery } = jobsApi;
