// redux/api/contactfeatures/contactFeaturesApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const contactFeaturesApi = createApi({
  reducerPath: "contactFeaturesApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["ContactFeatures"],
  endpoints: (builder) => ({
    // Get contact features
    getContactFeatures: builder.query({
      query: () => "/contact-info-box/",
      providesTags: ["ContactFeatures"],
    }),

    // Create contact features document
    createContactFeatures: builder.mutation({
      query: (data) => ({
        url: "/contact-info-box/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ContactFeatures"],
    }),

    // Create feature
    createFeature: builder.mutation({
      query: (data) => ({
        url: "/contact-info-box/feature",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ContactFeatures"],
    }),

    // Update feature
    updateFeature: builder.mutation({
      query: ({ featureId, ...data }) => ({
        url: `/contact-info-box/feature/${featureId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ContactFeatures"],
    }),

    // Delete feature
    deleteFeature: builder.mutation({
      query: (featureId) => ({
        url: `/contact-info-box/feature/${featureId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ContactFeatures"],
    }),

    // Update highlight
    updateHighlight: builder.mutation({
      query: (data) => ({
        url: "/contact-info-box/highlight",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ContactFeatures"],
    }),
  }),
});

export const {
  useGetContactFeaturesQuery,
  useCreateContactFeaturesMutation,
  useCreateFeatureMutation,
  useUpdateFeatureMutation,
  useDeleteFeatureMutation,
  useUpdateHighlightMutation,
} = contactFeaturesApi;
