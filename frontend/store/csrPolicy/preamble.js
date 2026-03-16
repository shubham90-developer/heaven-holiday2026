import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const preambleApi = createApi({
  reducerPath: "preambleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["Preamble"],
  endpoints: (builder) => ({
    // Get Preamble
    getPreamble: builder.query({
      query: () => "/csr-preamble/preamble",
      providesTags: ["Preamble"],
    }),
  }),
});

export const { useGetPreambleQuery } = preambleApi;
