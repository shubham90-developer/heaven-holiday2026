import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const trendingDestinationsApi = createApi({
  reducerPath: "trendingDestinationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  tagTypes: ["TrendingDestinations", "Destination"],
  endpoints: (builder) => ({
    getTrendingDestinations: builder.query({
      query: () => "/trending-destinations",
      providesTags: ["TrendingDestinations"],
    }),
  }),
});

export const { useGetTrendingDestinationsQuery } = trendingDestinationsApi;
