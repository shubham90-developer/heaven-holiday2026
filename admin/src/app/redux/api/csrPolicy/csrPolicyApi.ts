import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const preambleApi = createApi({
  reducerPath: "preambleApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Preamble"],
  endpoints: (builder) => ({
    // Get Preamble
    getPreamble: builder.query({
      query: () => "csr-preamble/preamble",
      providesTags: ["Preamble"],
    }),

    // Create Complete Preamble
    createPreamble: builder.mutation({
      query: (data) => ({
        url: "csr-preamble/preamble",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Preamble"],
    }),

    // Update Main Fields
    updateMainFields: builder.mutation({
      query: (data) => ({
        url: "csr-preamble/preamble/main-fields",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Preamble"],
    }),

    // Add Table Row
    addTableRow: builder.mutation({
      query: (data) => ({
        url: "csr-preamble/preamble/table-row",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Preamble"],
    }),

    // Update Table Row
    updateTableRow: builder.mutation({
      query: (data) => ({
        url: "csr-preamble/preamble/table-row",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Preamble"],
    }),

    // Delete Table Row
    deleteTableRow: builder.mutation({
      query: (id) => ({
        url: "csr-preamble/preamble/table-row",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["Preamble"],
    }),
  }),
});

export const {
  useGetPreambleQuery,
  useCreatePreambleMutation,
  useUpdateMainFieldsMutation,
  useAddTableRowMutation,
  useUpdateTableRowMutation,
  useDeleteTableRowMutation,
} = preambleApi;
