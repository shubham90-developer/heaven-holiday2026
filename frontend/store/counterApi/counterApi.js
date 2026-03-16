import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const counterApi = createApi({
  reducerPath: "counterApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  endpoints: (builder) => ({
    getCounter: builder.query({
      query: () => "/counter",
    }),
  }),
});

export const { useGetCounterQuery } = counterApi;
