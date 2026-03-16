import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const applicationApi = createApi({
  reducerPath: "applicationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["Application"],
  endpoints: (builder) => ({
    getAllApplications: builder.query({
      query: () => "/application-process",
      providesTags: ["Application"],
    }),
  }),
});

export const { useGetAllApplicationsQuery } = applicationApi;
