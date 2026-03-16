import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const heroBannerApi = createApi({
  reducerPath: "heroBannerApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["HeroBanner"],
  endpoints: (builder) => ({
    getHeroBanner: builder.query<any, void>({
      query: () => ({
        url: "/hero-banner",
        method: "GET",
      }),
      providesTags: ["HeroBanner"],
    }),
    createHeroBanner: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/hero-banner",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["HeroBanner"],
    }),
    updateHeroBanner: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/hero-banner",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["HeroBanner"],
    }),
    deleteHeroBanner: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: "/hero-banner",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["HeroBanner"],
    }),
  }),
});

export const {
  useGetHeroBannerQuery,
  useCreateHeroBannerMutation,
  useUpdateHeroBannerMutation,
  useDeleteHeroBannerMutation,
} = heroBannerApi;
