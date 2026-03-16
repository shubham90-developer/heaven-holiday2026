// store/careersApi/careersApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const careersApi = createApi({
  reducerPath: "careersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["Careers"],
  endpoints: (builder) => ({
    // Get careers info
    getCareers: builder.query({
      query: () => ({
        url: "/careers-header",
        method: "GET",
      }),
      providesTags: ["Careers"],
    }),
  }),
});

export const { useGetCareersQuery } = careersApi;
