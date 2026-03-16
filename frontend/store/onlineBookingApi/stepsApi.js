import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const onlineBookingApi = createApi({
  reducerPath: "onlineBookingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  tagTypes: ["OnlineBooking", "Steps"],
  endpoints: (builder) => ({
    // Get full online booking document
    getOnlineBooking: builder.query({
      query: () => "/online-booking",
      providesTags: ["OnlineBooking"],
    }),
  }),
});

export const { useGetOnlineBookingQuery } = onlineBookingApi;
