// features/celebrate/celebrateApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const celebrateApi = createApi({
  reducerPath: "celebrateApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["Celebrate"],
  endpoints: (builder) => ({
    // ================= GET CELEBRATE SECTION =================
    getCelebrate: builder.query({
      query: () => ({
        url: "/travel-deal-offer-banners/celebrate",
        method: "GET",
      }),
      providesTags: ["Celebrate"],
    }),
  }),
});

export const { useGetCelebrateQuery } = celebrateApi;
