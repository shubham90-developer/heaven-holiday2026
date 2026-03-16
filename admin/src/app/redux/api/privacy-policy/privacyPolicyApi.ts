import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const privacyPolicyApi = createApi({
  reducerPath: "privacyPolicyApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["PrivacyPolicy"],
  endpoints: (builder) => ({
    getPrivacyPolicy: builder.query({
      query: () => "/privacy-policy/",
      providesTags: ["PrivacyPolicy"],
    }),
    updatePrivacyPolicy: builder.mutation({
      query: (content) => ({
        url: "/privacy-policy/",
        method: "PUT",
        body: { content },
      }),
      invalidatesTags: ["PrivacyPolicy"],
    }),
  }),
});

export const { useGetPrivacyPolicyQuery, useUpdatePrivacyPolicyMutation } =
  privacyPolicyApi;
