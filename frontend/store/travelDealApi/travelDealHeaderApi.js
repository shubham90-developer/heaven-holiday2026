// features/holidaySection/holidaySectionApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const holidaySectionApi = createApi({
  reducerPath: "holidaySectionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["HolidaySection"],
  endpoints: (builder) => ({
    // ================= GET HOLIDAY SECTION =================
    getHolidaySection: builder.query({
      query: () => ({
        url: "/travel-deal-heading/holiday-section",
        method: "GET",
      }),
      providesTags: ["HolidaySection"],
    }),
  }),
});

export const { useGetHolidaySectionQuery } = holidaySectionApi;
