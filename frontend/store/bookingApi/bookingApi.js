// features/booking/bookingApi.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bookingApi = createApi({
  reducerPath: "bookingApi",
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
  tagTypes: ["Booking", "BookingList", "AllBookings"],
  endpoints: (builder) => ({
    // Create a new booking
    createBooking: builder.mutation({
      query: (bookingData) => ({
        url: "/booking",
        method: "POST",
        body: bookingData,
        formData: true,
      }),
      invalidatesTags: ["BookingList", "AllBookings"],
    }),

    // Get all user bookings
    getUserBookings: builder.query({
      query: () => `/booking/?limit=1000`,
      providesTags: ["BookingList"],
    }),

    // Get ALL bookings (admin)
    getAllBookings: builder.query({
      query: ({ status, page = 1, limit = 50 } = {}) => {
        const params = new URLSearchParams();
        if (status) params.append("status", status);
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        return `/booking/admin/all?${params.toString()}`;
      },
      providesTags: ["AllBookings"],
    }),

    // Get booking by ID
    getBookingById: builder.query({
      query: (bookingId) => `/booking/${bookingId}`,
      providesTags: (result, error, bookingId) => [
        { type: "Booking", id: bookingId },
      ],
    }),

    // Get booking summary
    getBookingSummary: builder.query({
      query: (bookingId) => `/booking/${bookingId}/summary`,
      providesTags: (result, error, bookingId) => [
        { type: "Booking", id: `${bookingId}-summary` },
      ],
    }),

    // Add payment to booking (existing - for manual payments)
    addPayment: builder.mutation({
      query: ({ bookingId, paymentData }) => ({
        url: `/booking/${bookingId}/payment`,
        method: "POST",
        body: paymentData,
      }),
      invalidatesTags: (result, error, { bookingId }) => [
        { type: "Booking", id: bookingId },
        "BookingList",
        "AllBookings",
      ],
    }),

    createPaymentOrder: builder.mutation({
      query: ({ bookingId, amount }) => ({
        url: `/booking/${bookingId}/create-payment-order`,
        method: "POST",
        body: { amount },
      }),
    }),

    verifyPayment: builder.mutation({
      query: ({ bookingId, paymentData }) => ({
        url: `/booking/${bookingId}/verify-payment`,
        method: "POST",
        body: paymentData,
      }),
      invalidatesTags: (result, error, { bookingId }) => [
        { type: "Booking", id: bookingId },
        { type: "Booking", id: `${bookingId}-summary` },
        "BookingList",
        "AllBookings",
      ],
    }),

    handlePaymentFailure: builder.mutation({
      query: ({ bookingId, failureData }) => ({
        url: `/booking/${bookingId}/payment-failure`,
        method: "POST",
        body: failureData,
      }),
      invalidatesTags: (result, error, { bookingId }) => [
        { type: "Booking", id: bookingId },
      ],
    }),

    updateBookingTravelers: builder.mutation({
      query: (formData) => {
        const bookingId = formData.get("bookingId");
        return {
          url: `/booking/${bookingId}/travelers`,
          method: "PATCH",
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: (result, error, formData) => {
        const bookingId = formData.get("bookingId");
        return [
          { type: "Booking", id: bookingId },
          { type: "Booking", id: `${bookingId}-summary` },
          "BookingList",
          "AllBookings",
        ];
      },
    }),

    cancelBooking: builder.mutation({
      query: ({ bookingId, reason, cancellationComments }) => ({
        url: `/booking/${bookingId}/cancel`,
        method: "PATCH",
        body: { reason, cancellationComments },
      }),
      invalidatesTags: (result, error, { bookingId }) => [
        { type: "Booking", id: bookingId },
        "BookingList",
        "AllBookings",
      ],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetUserBookingsQuery,
  useGetAllBookingsQuery,
  useGetBookingByIdQuery,
  useGetBookingSummaryQuery,
  useAddPaymentMutation,
  useUpdateBookingTravelersMutation,
  useCancelBookingMutation,
  useCreatePaymentOrderMutation,
  useVerifyPaymentMutation,
  useHandlePaymentFailureMutation,
} = bookingApi;
