import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Blog", "Category"],
  endpoints: (builder) => ({
    // --- CATEGORY ENDPOINTS ---
    getAllCategories: builder.query({
      query: () => "/blogs/categories",
      providesTags: ["Category"],
    }),

    // --- BLOG ENDPOINTS ---
    getAllBlogs: builder.query({
      query: () => "/blogs/blogs",
      providesTags: ["Blog"],
    }),

    // --- COMMENT ENDPOINTS ---
    addComment: builder.mutation({
      query: ({ blogId, commentBody }) => ({
        url: `/blogs/${blogId}/comments`,
        method: "POST",
        body: { commentBody },
      }),
      invalidatesTags: ["Blog"],
    }),
  }),
});

export const {
  // Category hooks
  useGetAllCategoriesQuery,

  // Blog hooks
  useGetAllBlogsQuery,

  // Comment hooks
  useAddCommentMutation,
} = blogApi;
