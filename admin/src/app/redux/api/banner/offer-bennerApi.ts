import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const offerBannerApi = createApi({
  reducerPath: "offerBannerApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["OfferBanner"],
  endpoints: (builder) => ({
    getOfferBanner: builder.query<any, void>({
      query: () => ({
        url: "/offer-banner/",
        method: "GET",
      }),
      providesTags: ["OfferBanner"],
    }),
    createOfferBanner: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/offer-banner/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["OfferBanner"],
    }),
    updateOfferBanner: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/offer-banner/",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["OfferBanner"],
    }),
    deleteOfferBanner: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: "/offer-banner/",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["OfferBanner"],
    }),
  }),
});

export const {
  useGetOfferBannerQuery,
  useCreateOfferBannerMutation,
  useUpdateOfferBannerMutation,
  useDeleteOfferBannerMutation,
} = offerBannerApi;
