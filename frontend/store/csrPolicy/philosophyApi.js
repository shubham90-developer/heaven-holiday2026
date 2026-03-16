import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const managementApi = createApi({
  reducerPath: "managementApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["Management"],
  endpoints: (builder) => ({
    // Get Management
    getManagement: builder.query({
      query: () => "/csr-management/management",
      providesTags: ["Management"],
    }),
  }),
});

export const { useGetManagementQuery } = managementApi;
