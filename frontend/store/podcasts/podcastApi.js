import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const podcastsApi = createApi({
  reducerPath: "podcastsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  tagTypes: ["Podcasts", "Episodes"],
  endpoints: (builder) => ({
    getPodcasts: builder.query({
      query: () => "/podcasts",
      providesTags: ["Podcasts"],
    }),
  }),
});

export const { useGetPodcastsQuery } = podcastsApi;
