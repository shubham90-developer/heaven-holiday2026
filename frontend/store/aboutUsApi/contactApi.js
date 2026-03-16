// redux/api/contactUs/contactUsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const contactUsApi = createApi({
  reducerPath: "contactUsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  tagTypes: ["ContactUs"],
  endpoints: (builder) => ({
    // GET - Fetch contact details
    getContactDetails: builder.query({
      query: () => "/contact-us",
      providesTags: ["ContactUs"],
    }),
  }),
});

export const { useGetContactDetailsQuery } = contactUsApi;
