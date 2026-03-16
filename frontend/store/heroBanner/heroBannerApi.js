import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const heroBannerApi = createApi({
  reducerPath: "heroBannerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["HeroBanner"],
  endpoints: (builder) => ({
    getHeroBanner: builder.query({
      query: () => ({
        url: "/hero-banner",
        method: "GET",
      }),
      providesTags: ["HeroBanner"],
    }),
  }),
});

export const { useGetHeroBannerQuery } = heroBannerApi;
