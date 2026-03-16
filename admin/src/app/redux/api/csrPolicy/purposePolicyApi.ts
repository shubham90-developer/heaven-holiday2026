import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const purposePolicyApi = createApi({
  reducerPath: "purposePolicyApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["PurposePolicy"],
  endpoints: (builder) => ({
    // Get Purpose Policy
    getPurposePolicy: builder.query({
      query: () => "/csr-purpose-policy/",
      providesTags: ["PurposePolicy"],
    }),

    // Update Main Fields
    updateMainFields: builder.mutation({
      query: (data) => ({
        url: "/csr-purpose-policy/main-fields",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["PurposePolicy"],
    }),

    // Add Card
    addCard: builder.mutation({
      query: (formData) => ({
        url: "/csr-purpose-policy/card",
        method: "POST",
        body: formData,
        // FormData will automatically set correct Content-Type with boundary
      }),
      invalidatesTags: ["PurposePolicy"],
    }),

    // Update Card
    updateCard: builder.mutation({
      query: (formData) => ({
        url: "/csr-purpose-policy/card",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["PurposePolicy"],
    }),

    // Delete Card
    deleteCard: builder.mutation({
      query: (id) => ({
        url: "/csr-purpose-policy/card",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["PurposePolicy"],
    }),
  }),
});

export const {
  useGetPurposePolicyQuery,
  useUpdateMainFieldsMutation,
  useAddCardMutation,
  useUpdateCardMutation,
  useDeleteCardMutation,
} = purposePolicyApi;
