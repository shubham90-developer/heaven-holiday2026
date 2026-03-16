import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const tourReviewApi = createApi({
  reducerPath: "tourReviewApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["TourReview"],
  endpoints: (builder) => ({
    getTourReview: builder.query({
      query: () => "/reviews/",
      providesTags: ["TourReview"],
    }),

    updateMainFields: builder.mutation({
      query: (body) => ({
        url: "/reviews/update-main",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["TourReview"],
    }),

    addReview: builder.mutation({
      query: (body) => ({
        url: "/reviews/review/add",
        method: "POST",
        body,
      }),
      invalidatesTags: ["TourReview"],
    }),
    updateReview: builder.mutation({
      query: ({ id, data }) => ({
        url: `/reviews/review/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["TourReview"],
    }),
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/review/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TourReview"],
    }),
  }),
});

export const {
  useGetTourReviewQuery,
  useUpdateMainFieldsMutation,
  useAddReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = tourReviewApi;
