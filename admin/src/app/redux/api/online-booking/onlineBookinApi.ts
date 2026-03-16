import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const onlineBookingApi = createApi({
  reducerPath: "onlineBookingApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["OnlineBooking", "Steps"],
  endpoints: (builder) => ({
    // Get full online booking document
    getOnlineBooking: builder.query({
      query: () => "/online-booking/",
      providesTags: ["OnlineBooking"],
    }),

    // Update title and description
    updateOnlineBooking: builder.mutation({
      query: (data) => ({
        url: "/online-booking/",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["OnlineBooking"],
    }),

    // Create a new step
    createStep: builder.mutation({
      query: (formData) => ({
        url: "/online-booking/steps",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["OnlineBooking", "Steps"],
    }),

    // Update a step
    updateStep: builder.mutation({
      query: ({ stepNo, formData }) => ({
        url: `/online-booking/steps/${stepNo}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["OnlineBooking", "Steps"],
    }),

    // Delete a step
    deleteStep: builder.mutation({
      query: (stepNo) => ({
        url: `/online-booking/steps/${stepNo}`,
        method: "DELETE",
      }),
      invalidatesTags: ["OnlineBooking", "Steps"],
    }),
  }),
});

export const {
  useGetOnlineBookingQuery,
  useUpdateOnlineBookingMutation,
  useCreateStepMutation,
  useUpdateStepMutation,
  useDeleteStepMutation,
} = onlineBookingApi;
