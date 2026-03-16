// redux/api/empoweringApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const empoweringApi = createApi({
  reducerPath: "empoweringApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["Empowering"],
  endpoints: (builder) => ({
    // Get empowering content
    getEmpowering: builder.query({
      query: () => "/empowering-women",
      providesTags: ["Empowering"],
    }),
  }),
});

export const { useGetEmpoweringQuery } = empoweringApi;
