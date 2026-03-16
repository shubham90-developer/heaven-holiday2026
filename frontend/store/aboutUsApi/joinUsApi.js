import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const joinUsApi = createApi({
  reducerPath: "joinUsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["JoinUs"],
  endpoints: (builder) => ({
    getContent: builder.query({
      query: () => "/joinUs",
      providesTags: ["JoinUs"],
    }),
  }),
});

export const { useGetContentQuery } = joinUsApi;
