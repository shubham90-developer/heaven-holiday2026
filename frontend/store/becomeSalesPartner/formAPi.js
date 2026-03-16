import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const becomePartnerFormApi = createApi({
  reducerPath: "becomePartnerFormApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["Form"],
  endpoints: (builder) => ({
    createForm: builder.mutation({
      query: (body) => ({
        url: "/become-partner-form",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Form"],
    }),
  }),
});

export const { useCreateFormMutation } = becomePartnerFormApi;
