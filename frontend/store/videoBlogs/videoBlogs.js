import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const videoBlogApi = createApi({
  reducerPath: "videoBlogApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["VideoBlogs", "Categories"],
  endpoints: (builder) => ({
    getAllVideoBlogs: builder.query({
      query: () => "/video-blogs/",
      providesTags: ["VideoBlogs"],
    }),

    getAllCategories: builder.query({
      query: () => "/video-blogs/categories",
      providesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetAllVideoBlogsQuery,

  useGetAllCategoriesQuery,
} = videoBlogApi;
