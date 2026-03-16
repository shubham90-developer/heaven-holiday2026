import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const jobApplicationApi = createApi({
  reducerPath: "jobApplicationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["JobApplication"],
  endpoints: (builder) => ({
    // Create job application
    createJobApplication: builder.mutation({
      query: (body) => ({
        url: "/job-applications",
        method: "POST",
        body,
      }),
      invalidatesTags: ["JobApplication"],
    }),
  }),
});

export const { useCreateJobApplicationMutation } = jobApplicationApi;
