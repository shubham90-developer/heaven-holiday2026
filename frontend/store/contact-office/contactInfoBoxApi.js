// redux/api/contactfeatures/contactFeaturesApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const contactFeaturesApi = createApi({
  reducerPath: "contactFeaturesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["ContactFeatures"],
  endpoints: (builder) => ({
    // Get contact features
    getContactFeatures: builder.query({
      query: () => "/contact-info-box",
      providesTags: ["ContactFeatures"],
    }),
  }),
});

export const { useGetContactFeaturesQuery } = contactFeaturesApi;
