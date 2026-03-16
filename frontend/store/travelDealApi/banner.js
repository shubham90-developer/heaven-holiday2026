// features/travelDealBanner/travelDealBannerApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const travelDealBannerApi = createApi({
  reducerPath: "travelDealBannerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["TravelDealBanner"],
  endpoints: (builder) => ({
    getTravelDealBanner: builder.query({
      query: () => ({
        url: "/travel-deal/travel-deal-banner",
        method: "GET",
      }),
      providesTags: ["TravelDealBanner"],
    }),
  }),
});

export const { useGetTravelDealBannerQuery } = travelDealBannerApi;
