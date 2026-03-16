import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const teamApi = createApi({
  reducerPath: "teamApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["Team"],
  endpoints: (builder) => ({
    getTeams: builder.query({
      query: (status) => ({
        url: "/teams",
        params: status ? { status } : undefined,
      }),
      providesTags: ["Team"],
    }),
  }),
});

export const { useGetTeamsQuery } = teamApi;
