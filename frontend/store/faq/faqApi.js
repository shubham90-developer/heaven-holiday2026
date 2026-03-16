// redux/api/faq/faqApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const faqApi = createApi({
  reducerPath: "faqApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["FAQ", "Category"],
  endpoints: (builder) => ({
    // Get all FAQs and categories
    getAllFAQs: builder.query({
      query: () => "/faqs",
      providesTags: ["FAQ"],
    }),

    // Get only categories
    getAllCategories: builder.query({
      query: () => "/faqs/categories",
      providesTags: ["Category"],
    }),
  }),
});

export const { useGetAllFAQsQuery, useGetAllCategoriesQuery } = faqApi;
