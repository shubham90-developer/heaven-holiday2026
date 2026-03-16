// app/redux/api/howWeHireApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const howWeHireApi = createApi({
  reducerPath: "howWeHireApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["HowWeHire"],
  endpoints: (builder) => ({
    // GET HowWeHire document
    getHowWeHire: builder.query({
      query: () => "/hiring-process",
      providesTags: ["HowWeHire"],
    }),
  }),
});

export const { useGetHowWeHireQuery } = howWeHireApi;
