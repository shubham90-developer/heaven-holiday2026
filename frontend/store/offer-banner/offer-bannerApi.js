import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const offerBannerApi = createApi({
  reducerPath: "offerBannerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["OfferBanner"],
  endpoints: (builder) => ({
    getOfferBanner: builder.query({
      query: () => ({
        url: "/offer-banner",
        method: "GET",
      }),
      providesTags: ["OfferBanner"],
    }),
  }),
});

export const { useGetOfferBannerQuery } = offerBannerApi;
