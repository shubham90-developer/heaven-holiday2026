import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const commentApi = createApi({
  reducerPath: "commentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["Comment"],
  endpoints: (builder) => ({
    getAllComments: builder.query({
      query: () => "/comment",
      providesTags: ["Comment"],
    }),

    createComment: builder.mutation({
      query: (body) => ({
        url: "/comment",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Comment"],
    }),
  }),
});

export const { useGetAllCommentsQuery, useCreateCommentMutation } = commentApi;
