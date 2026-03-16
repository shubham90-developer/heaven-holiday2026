// features/visaInfo/visaInfoApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const visaInfoApi = createApi({
  reducerPath: "visaInfoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["VisaInfo"],
  endpoints: (builder) => ({
    // ================= GET VISA INFO =================
    getVisaInfo: builder.query({
      query: () => ({
        url: "/visa-info/visa-info",
        method: "GET",
      }),
      providesTags: ["VisaInfo"],
    }),
  }),
});

export const { useGetVisaInfoQuery } = visaInfoApi;
