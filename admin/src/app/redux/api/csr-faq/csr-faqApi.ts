// faqApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const csrfaqApi = createApi({
  reducerPath: "csrfaqApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["FAQ"],
  endpoints: (builder) => ({
    // Get all FAQs
    getAllFAQs: builder.query({
      query: () => "/csr-faq/",
      providesTags: ["FAQ"],
    }),

    // Create FAQ
    createFAQ: builder.mutation({
      query: (body) => ({
        url: "/csr-faq/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["FAQ"],
    }),

    // Update FAQ
    updateFAQ: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/csr-faq/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["FAQ"],
    }),

    // Delete FAQ
    deleteFAQ: builder.mutation({
      query: (id) => ({
        url: `/csr-faq/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FAQ"],
    }),
  }),
});

export const {
  useGetAllFAQsQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
} = csrfaqApi;
