import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reviewsApi = createApi({
  reducerPath: "reviewsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["Reviews"],
  endpoints: (builder) => ({
    getTourReview: builder.query({
      query: () => "/reviews",
      providesTags: ["Reviews"],
    }),
  }),
});

export const { useGetTourReviewQuery } = reviewsApi;
