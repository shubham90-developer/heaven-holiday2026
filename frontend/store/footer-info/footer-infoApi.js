import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const footerInfoApi = createApi({
  reducerPath: "footerInfoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["FooterInfo"],
  endpoints: (builder) => ({
    getFooterInfo: builder.query({
      query: () => "/footer-info",
      providesTags: ["FooterInfo"],
    }),
  }),
});

export const { useGetFooterInfoQuery } = footerInfoApi;
