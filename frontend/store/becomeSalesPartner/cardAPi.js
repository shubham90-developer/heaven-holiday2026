import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cardApi = createApi({
  reducerPath: "cardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["Card"],
  endpoints: (builder) => ({
    getAllCards: builder.query({
      query: () => "/become-partner",
      providesTags: ["Card"],
    }),
  }),
});

export const { useGetAllCardsQuery } = cardApi;
