import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const bookApi = createApi({
  reducerPath: "bookApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Book"],
  endpoints: (builder) => ({
    getAllBooks: builder.query({
      query: () => "/books/",
      providesTags: ["Book"],
    }),

    createBook: builder.mutation({
      query: (formData) => ({
        url: "/books/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Book"],
    }),

    updateBook: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/books/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Book", id },
        "Book",
      ],
    }),

    deleteBook: builder.mutation({
      query: (id) => ({
        url: `/books/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Book"],
    }),

    addImagesToBook: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/books/${id}/add-images`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Book", id },
        "Book",
      ],
    }),

    removeImageFromBook: builder.mutation({
      query: ({ id, imageUrl }) => ({
        url: `/books/${id}/remove-image`,
        method: "DELETE",
        body: { imageUrl },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Book", id },
        "Book",
      ],
    }),
  }),
});

export const {
  useGetAllBooksQuery,

  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useAddImagesToBookMutation,
  useRemoveImageFromBookMutation,
} = bookApi;
