import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const trendingDestinationsApi = createApi({
  reducerPath: "trendingDestinationsApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["TrendingDestinations", "Destination"],
  endpoints: (builder) => ({
    getTrendingDestinations: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.category) queryParams.append("category", params.category);
        if (params?.status) queryParams.append("status", params.status);
        return `/trending-destinations/?${queryParams.toString()}`;
      },
      providesTags: ["TrendingDestinations"],
    }),

    updateTitle: builder.mutation({
      query: (body) => ({
        url: "/trending-destinations/title",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["TrendingDestinations"],
    }),

    createDestination: builder.mutation({
      query: (data) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("image", data.image);
        formData.append("tours", data.tours.toString());
        formData.append("departures", data.departures.toString());
        formData.append("guests", data.guests.toString());
        formData.append("category", data.category);
        formData.append("status", data.status);
        formData.append("order", data.order.toString());

        return {
          url: "/trending-destinations/destinations",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["TrendingDestinations"],
    }),

    updateDestination: builder.mutation({
      query: ({ id, ...data }) => {
        const formData = new FormData();
        if (data.title) formData.append("title", data.title);
        if (data.image) formData.append("image", data.image);
        if (data.tours !== undefined)
          formData.append("tours", data.tours.toString());
        if (data.departures !== undefined)
          formData.append("departures", data.departures.toString());
        if (data.guests !== undefined)
          formData.append("guests", data.guests.toString());
        if (data.category) formData.append("category", data.category);
        if (data.status) formData.append("status", data.status);
        if (data.order !== undefined)
          formData.append("order", data.order.toString());

        return {
          url: `/trending-destinations/destinations/${id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        "TrendingDestinations",
        { type: "Destination", id },
      ],
    }),

    deleteDestination: builder.mutation({
      query: (id) => ({
        url: `/trending-destinations/destinations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TrendingDestinations"],
    }),
  }),
});

export const {
  useGetTrendingDestinationsQuery,

  useUpdateTitleMutation,
  useCreateDestinationMutation,
  useUpdateDestinationMutation,
  useDeleteDestinationMutation,
} = trendingDestinationsApi;
