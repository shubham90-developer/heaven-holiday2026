import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const principlesApi = createApi({
  reducerPath: "principlesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  tagTypes: ["Principle"],
  endpoints: (builder) => ({
    // Get all principles
    getAllPrinciples: builder.query({
      query: () => "/principles",
      providesTags: ["Principle"],
    }),
  }),
});

export const { useGetAllPrinciplesQuery } = principlesApi;
