// features/gallery/galleryApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const toursGalleryApi = createApi({
  reducerPath: "toursGalleryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  tagTypes: ["Gallery", "Images"],
  endpoints: (builder) => ({
    getGallery: builder.query({
      query: () => "/tours-gallery/gallery",
      providesTags: ["Gallery"],
    }),
  }),
});

export const { useGetGalleryQuery } = toursGalleryApi;
