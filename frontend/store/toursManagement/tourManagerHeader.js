import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const tourManagerApi = createApi({
  reducerPath: "tourManagerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      return headers;
    },
  }),
  tagTypes: ["TourManager"],
  endpoints: (builder) => ({
    getTourManager: builder.query({
      query: () => "/tour-manager",
      providesTags: [{ type: "TourManager", id: "SINGLE" }],
    }),
  }),
});

export const { useGetTourManagerQuery } = tourManagerApi;
