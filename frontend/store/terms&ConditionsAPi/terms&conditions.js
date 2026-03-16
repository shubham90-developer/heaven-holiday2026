import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const termsConditionApi = createApi({
  reducerPath: "termsConditionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["TermsCondition"],
  endpoints: (builder) => ({
    getTermsCondition: builder.query({
      query: () => "/terms-conditions",
      providesTags: ["TermsCondition"],
    }),
  }),
});

export const { useGetTermsConditionQuery } = termsConditionApi;
