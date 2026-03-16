import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const enquiryApi = createApi({
  reducerPath: "enquiryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["Enquiry"],
  endpoints: (builder) => ({
    createEnquiry: builder.mutation({
      query: (body) => ({
        url: "/enquiry",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Enquiry", id: "LIST" }],
    }),
  }),
});

export const { useCreateEnquiryMutation } = enquiryApi;
