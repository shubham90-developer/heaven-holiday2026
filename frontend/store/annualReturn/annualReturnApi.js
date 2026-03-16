// features/annualReturn/annualReturnApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const annualReturnApi = createApi({
  reducerPath: "annualReturnApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["AnnualReturn"],
  endpoints: (builder) => ({
    getAnnualReturn: builder.query({
      query: () => ({
        url: "/annual-return/annual-return",
        method: "GET",
      }),
      providesTags: ["AnnualReturn"],
    }),
  }),
});

export const { useGetAnnualReturnQuery } = annualReturnApi;
