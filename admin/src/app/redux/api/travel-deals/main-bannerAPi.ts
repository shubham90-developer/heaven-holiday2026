// features/travelDealBanner/travelDealBannerApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const travelDealBannerApi = createApi({
  reducerPath: "travelDealBannerApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["TravelDealBanner"],
  endpoints: (builder) => ({
    // ================= GET TRAVEL DEAL BANNER =================
    getTravelDealBanner: builder.query<any, void>({
      query: () => ({
        url: "/travel-deal/travel-deal-banner",
        method: "GET",
      }),
      providesTags: ["TravelDealBanner"],
    }),

    // ================= UPDATE TRAVEL DEAL BANNER =================
    updateTravelDealBanner: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/travel-deal/travel-deal-banner",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["TravelDealBanner"],
    }),
  }),
});

export const {
  useGetTravelDealBannerQuery,
  useUpdateTravelDealBannerMutation,
} = travelDealBannerApi;
