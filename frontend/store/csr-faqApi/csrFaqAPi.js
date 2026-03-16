// faqApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const csrfaqApi = createApi({
  reducerPath: "csrfaqApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["FAQ"],
  endpoints: (builder) => ({
    // Get all FAQs
    getAllFAQs: builder.query({
      query: () => "/csr-faq",
      providesTags: ["FAQ"],
    }),
  }),
});

export const { useGetAllFAQsQuery } = csrfaqApi;
