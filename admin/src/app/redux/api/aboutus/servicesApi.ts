import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const servicesApi = createApi({
  reducerPath: "servicesApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Services"],
  endpoints: (builder) => ({
    getAllMain: builder.query({
      query: () => "/services/",
      providesTags: ["Services"],
    }),
    createServices: builder.mutation({
      query: (data: FormData) => ({
        url: "/services/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Services"],
    }),
    // Update only main fields (title, subtitle)
    updateMainFields: builder.mutation({
      query: ({
        id,
        data,
      }: {
        id: string;
        data: { title?: string; subtitle?: string };
      }) => ({
        url: `/services/${id}/fields`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
      invalidatesTags: ["Services"],
    }),
    // Update a specific item in the array
    updateMainItem: builder.mutation({
      query: ({
        id,
        itemIndex,
        data,
      }: {
        id: string;
        itemIndex: number;
        data: FormData;
      }) => ({
        url: `/services/${id}/items/${itemIndex}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Services"],
    }),
    // Update entire items array
    updateMainItemsArray: builder.mutation({
      query: ({ id, data }: { id: string; data: FormData }) => ({
        url: `/services/${id}/items`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Services"],
    }),
    deleteMain: builder.mutation({
      query: (id: string) => ({
        url: `/services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Services"],
    }),
  }),
});

export const {
  useGetAllMainQuery,
  useCreateServicesMutation,
  useUpdateMainFieldsMutation,
  useUpdateMainItemMutation,
  useUpdateMainItemsArrayMutation,
  useDeleteMainMutation,
} = servicesApi;
