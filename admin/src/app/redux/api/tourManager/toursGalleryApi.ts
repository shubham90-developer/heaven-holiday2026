// features/gallery/galleryApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const toursGalleryApi = createApi({
  reducerPath: "toursGalleryApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Gallery", "Images"],
  endpoints: (builder) => ({
    getGallery: builder.query<any, void>({
      query: () => "/tours-gallery/gallery",
      providesTags: ["Gallery"],
    }),

    createGallery: builder.mutation<any, any>({
      query: (body) => ({
        url: "/tours-gallery/gallery",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Gallery"],
    }),

    updateGallery: builder.mutation<any, any>({
      query: (body) => ({
        url: "/tours-gallery/gallery",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Gallery"],
    }),

    getImages: builder.query<any, void>({
      query: () => "/tours-gallery/gallery/images",
      providesTags: ["Images"],
    }),

    // NEW: Upload image with file (Cloudinary)
    uploadImage: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/tours-gallery/gallery/images/upload",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Images", "Gallery"],
    }),

    // Keep for URL-based images (without file upload)
    addImage: builder.mutation<any, any>({
      query: (body) => ({
        url: "/tours-gallery/gallery/images",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Images", "Gallery"],
    }),

    // NEW: Update image with file upload
    updateImageWithUpload: builder.mutation<
      any,
      { imageId: string; formData: FormData }
    >({
      query: ({ imageId, formData }) => ({
        url: `/tours-gallery/gallery/images/${imageId}/upload`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Images", "Gallery"],
    }),

    // Update image without file (metadata only)
    updateImage: builder.mutation<any, { imageId: string; body: any }>({
      query: ({ imageId, body }) => ({
        url: `/tours-gallery/gallery/images/${imageId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Images", "Gallery"],
    }),

    deleteImage: builder.mutation<any, string>({
      query: (imageId) => ({
        url: `/tours-gallery/gallery/images/${imageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Images", "Gallery"],
    }),
  }),
});

export const {
  useGetGalleryQuery,
  useCreateGalleryMutation,
  useUpdateGalleryMutation,
  useGetImagesQuery,
  useUploadImageMutation,
  useAddImageMutation,
  useUpdateImageWithUploadMutation,
  useUpdateImageMutation,
  useDeleteImageMutation,
} = toursGalleryApi;
