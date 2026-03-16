import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const tourManagerDirectoryApi = createApi({
  reducerPath: "tourManagerDirectoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["TourManagerDirectory", "Manager"],
  endpoints: (builder) => ({
    // Get tour manager directory (with optional search, letter, and status filter)
    getTourManagerDirectory: builder.query({
      query: () => ({
        url: "/tour-manager-team",
      }),
      providesTags: ["TourManagerDirectory"],
    }),
  }),
});

export const { useGetTourManagerDirectoryQuery } = tourManagerDirectoryApi;
