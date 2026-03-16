// redux/api/contactUs/contactUsApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const footerContactApi = createApi({
  reducerPath: "footerContactApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["ContactUs"],
  endpoints: (builder) => ({
    // GET - Fetch contact details
    getFooterContactApi: builder.query({
      query: () => "/contact-us",
      providesTags: ["ContactUs"],
    }),
  }),
});

export const { useGetFooterContactApiQuery } = footerContactApi;
