// redux/api/includesApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const includesApi = createApi({
  reducerPath: "includesApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Includes"],
  endpoints: (builder) => ({
    // GET all includes
    getAllIncludes: builder.query({
      query: () => "/includes",
      providesTags: ["Includes"],
    }),

    // CREATE new include
    createInclude: builder.mutation({
      query: (formData) => ({
        url: "/includes",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Includes"],
    }),

    // UPDATE include
    updateInclude: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/includes/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Includes",
        { type: "Includes", id },
      ],
    }),

    // DELETE include
    deleteInclude: builder.mutation({
      query: (id) => ({
        url: `/includes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Includes"],
    }),
  }),
});

export const {
  useGetAllIncludesQuery,
  useCreateIncludeMutation,
  useUpdateIncludeMutation,
  useDeleteIncludeMutation,
} = includesApi;
