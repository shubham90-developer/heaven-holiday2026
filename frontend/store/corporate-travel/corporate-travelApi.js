import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const brandsSectionApi = createApi({
  reducerPath: "brandsSectionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["BrandsSection", "Brand", "Industry"],
  endpoints: (builder) => ({
    // Brands Section
    getBrandsSection: builder.query({
      query: () => ({
        url: "/brands/section",
        method: "GET",
      }),
      providesTags: ["BrandsSection"],
    }),
  }),
});

export const { useGetBrandsSectionQuery } = brandsSectionApi;
