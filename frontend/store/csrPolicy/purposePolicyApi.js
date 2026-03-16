import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const purposePolicyApi = createApi({
  reducerPath: "purposePolicyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers) => {
      // Don't set Content-Type for FormData - browser will set it automatically
      return headers;
    },
  }),
  tagTypes: ["PurposePolicy"],
  endpoints: (builder) => ({
    // Get Purpose Policy
    getPurposePolicy: builder.query({
      query: () => "/csr-purpose-policy",
      providesTags: ["PurposePolicy"],
    }),
  }),
});

export const { useGetPurposePolicyQuery } = purposePolicyApi;
