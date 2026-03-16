import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cityApi = createApi({
  reducerPath: "cityApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["City"],
  endpoints: (builder) => ({
    getAllCities: builder.query({
      query: () => "/contact-city",
    }),
  }),
});

export const { useGetAllCitiesQuery } = cityApi;
