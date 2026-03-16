import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const termsConditionApi = createApi({
  reducerPath: "termsConditionApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["TermsCondition"],
  endpoints: (builder) => ({
    getTermsCondition: builder.query({
      query: () => "/terms-conditions/",
      providesTags: ["TermsCondition"],
    }),
    updateTermsCondition: builder.mutation({
      query: (content) => ({
        url: "/terms-conditions/",
        method: "PUT",
        body: { content },
      }),
      invalidatesTags: ["TermsCondition"],
    }),
  }),
});

export const { useGetTermsConditionQuery, useUpdateTermsConditionMutation } =
  termsConditionApi;
