import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const managementApi = createApi({
  reducerPath: "managementApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Management"],
  endpoints: (builder) => ({
    // Get Management
    getManagement: builder.query({
      query: () => "csr-management/management",
      providesTags: ["Management"],
    }),

    // Update Main Fields
    updateMainFields: builder.mutation({
      query: (data) => ({
        url: "csr-management/management/main-fields",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Management"],
    }),

    // Add Card
    addCard: builder.mutation({
      query: (formData) => ({
        url: "csr-management/management/card",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Management"],
    }),

    // Update Card
    updateCard: builder.mutation({
      query: (formData) => ({
        url: "csr-management/management/card",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Management"],
    }),

    // Delete Card
    deleteCard: builder.mutation({
      query: (id) => ({
        url: "csr-management/management/card",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["Management"],
    }),
  }),
});

export const {
  useGetManagementQuery,
  useUpdateMainFieldsMutation,
  useAddCardMutation,
  useUpdateCardMutation,
  useDeleteCardMutation,
} = managementApi;
