// features/blog/blogApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Blog", "Category"],
  endpoints: (builder) => ({
    // --- CATEGORY ENDPOINTS ---
    getAllCategories: builder.query({
      query: () => "/blogs/categories",
      providesTags: ["Category"],
    }),
    createCategory: builder.mutation({
      query: (body) => ({
        url: "/blogs/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/blogs/categories/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/blogs/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category", "Blog"],
    }),

    // --- BLOG ENDPOINTS ---
    getAllBlogs: builder.query({
      query: () => "/blogs/blogs",
      providesTags: ["Blog"],
    }),
    createBlog: builder.mutation({
      query: (formData) => ({
        url: "/blogs/blogs",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Blog"],
    }),
    updateBlog: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/blogs/blogs/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Blog"],
    }),
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/blogs/blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),
  }),
});

export const {
  // Category hooks
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  // Blog hooks
  useGetAllBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;
