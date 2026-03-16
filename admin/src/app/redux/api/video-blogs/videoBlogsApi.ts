import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const videoBlogApi = createApi({
  reducerPath: "videoBlogApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["VideoBlogs", "Categories"],
  endpoints: (builder) => ({
    // ========== VIDEO BLOG ENDPOINTS ==========

    // Get all video blogs
    getAllVideoBlogs: builder.query({
      query: () => "/video-blogs/",
      providesTags: ["VideoBlogs"],
    }),

    // Create video blog
    createVideoBlog: builder.mutation({
      query: (data) => ({
        url: "/video-blogs/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["VideoBlogs"],
    }),

    // Update video blog
    updateVideoBlog: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/video-blogs/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["VideoBlogs"],
    }),

    // Delete video blog
    deleteVideoBlog: builder.mutation({
      query: (id) => ({
        url: `/video-blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["VideoBlogs"],
    }),

    // ========== CATEGORY ENDPOINTS ==========

    // Get all categories
    getAllCategories: builder.query({
      query: () => "/video-blogs/categories",
      providesTags: ["Categories"],
    }),

    // Add category
    addCategory: builder.mutation({
      query: (data) => ({
        url: "/video-blogs/categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),

    // Update category
    updateCategory: builder.mutation({
      query: ({ categoryId, ...data }) => ({
        url: `/video-blogs/categories/${categoryId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),

    // Delete category
    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `/video-blogs/categories/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetAllVideoBlogsQuery,
  useCreateVideoBlogMutation,
  useUpdateVideoBlogMutation,
  useDeleteVideoBlogMutation,
  useGetAllCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = videoBlogApi;
