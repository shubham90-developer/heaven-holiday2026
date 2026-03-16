// features/booking/bookingApi.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const bookingApi = createApi({
  reducerPath: "bookingApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Booking", "BookingList", "Refunds"],
  endpoints: (builder) => ({
    // Get all bookings
    getAllBookings: builder.query<any, any>({
      query: (params) => {
        const { status, page = 1, limit = 50 } = params || {};
        const urlParams = new URLSearchParams();
        if (status) urlParams.append("status", status);
        urlParams.append("page", page.toString());
        urlParams.append("limit", limit.toString());
        return `/booking/admin/all?${urlParams.toString()}`;
      },
      providesTags: ["BookingList"],
    }),

    // Delete booking
    deleteBooking: builder.mutation<any, string>({
      query: (bookingId) => ({
        url: `/booking/admin/${bookingId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BookingList", "Refunds"],
    }),

    // Get all pending refunds
    getAllPendingRefunds: builder.query<any, any>({
      query: (params) => {
        const { status, page = 1, limit = 50 } = params || {};
        const urlParams = new URLSearchParams();
        if (status) urlParams.append("status", status);
        urlParams.append("page", page.toString());
        urlParams.append("limit", limit.toString());
        return `/booking/admin/refunds/pending?${urlParams.toString()}`;
      },
      providesTags: ["Refunds"],
    }),

    // Update refund status
    updateRefundStatus: builder.mutation<any, any>({
      query: ({ bookingId, refundId, ...body }) => ({
        url: `/booking/admin/refunds/${bookingId}/${refundId}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Refunds", "BookingList"],
    }),
    uploadBookingDocument: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: `/booking/admin/documents/upload`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["BookingList"],
    }),
  }),
});

export const {
  useGetAllBookingsQuery,
  useDeleteBookingMutation,
  useGetAllPendingRefundsQuery,
  useUpdateRefundStatusMutation,
  useUploadBookingDocumentMutation,
} = bookingApi;
