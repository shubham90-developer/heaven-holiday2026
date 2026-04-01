import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const pageTitlesApi = createApi({
  reducerPath: "pageTitlesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      return headers;
    },
  }),
  tagTypes: ["PageTitles"],
  endpoints: (builder) => ({
    getPageTitles: builder.query({
      query: () => "/titles",
      providesTags: [{ type: "PageTitles", id: "SINGLE" }],
    }),
  }),
});

export const { useGetPageTitlesQuery } = pageTitlesApi;
