import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const aboutusApi = createApi({
  reducerPath: "aboutusApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  endpoints: (builder) => ({
    getAboutUs: builder.query({
      query: () => "aboutus",
    }),
  }),
});

export const { useGetAboutUsQuery } = aboutusApi;
