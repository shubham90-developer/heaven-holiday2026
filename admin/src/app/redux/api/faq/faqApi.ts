// redux/api/faq/faqApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const faqApi = createApi({
  reducerPath: "faqApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["FAQ", "Category"],
  endpoints: (builder) => ({
    // Get all FAQs and categories
    getAllFAQs: builder.query({
      query: () => "/faqs/",
      providesTags: ["FAQ"],
    }),

    // Get only categories
    getAllCategories: builder.query({
      query: () => "/faqs/categories",
      providesTags: ["Category"],
    }),

    // Get FAQs by category
    getFAQsByCategory: builder.query({
      query: (category) => `/faqs/category/${category}`,
      providesTags: ["FAQ"],
    }),

    // Create category
    createCategory: builder.mutation({
      query: (data) => ({
        url: "/faqs/category",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category", "FAQ"],
    }),

    // Create FAQ
    createFAQ: builder.mutation({
      query: (data) => ({
        url: "/faqs/faq",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["FAQ"],
    }),

    // Update category
    updateCategory: builder.mutation({
      query: ({ categoryId, ...data }) => ({
        url: `/faqs/category/${categoryId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Category", "FAQ"],
    }),

    // Update FAQ
    updateFAQ: builder.mutation({
      query: ({ faqId, ...data }) => ({
        url: `/faqs/faq/${faqId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["FAQ"],
    }),

    // Delete category
    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `/faqs/category/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category", "FAQ"],
    }),

    // Delete FAQ
    deleteFAQ: builder.mutation({
      query: (faqId) => ({
        url: `/faqs/faq/${faqId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FAQ"],
    }),
  }),
});

export const {
  useGetAllFAQsQuery,
  useGetAllCategoriesQuery,
  useGetFAQsByCategoryQuery,
  useCreateCategoryMutation,
  useCreateFAQMutation,
  useUpdateCategoryMutation,
  useUpdateFAQMutation,
  useDeleteCategoryMutation,
  useDeleteFAQMutation,
} = faqApi;
