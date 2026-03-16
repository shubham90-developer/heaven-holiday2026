import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const applicationApi = createApi({
  reducerPath: "applicationApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Application"],
  endpoints: (builder) => ({
    getAllApplications: builder.query({
      query: () => "/application-process/",
      providesTags: ["Application"],
    }),
    createApplication: builder.mutation({
      query: (formData) => ({
        url: "/application-process/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Application"],
    }),
    updateApplication: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/application-process/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Application"],
    }),
    deleteApplication: builder.mutation({
      query: (id) => ({
        url: `/application-process/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Application"],
    }),
  }),
});

export const {
  useGetAllApplicationsQuery,
  useCreateApplicationMutation,
  useUpdateApplicationMutation,
  useDeleteApplicationMutation,
} = applicationApi;
