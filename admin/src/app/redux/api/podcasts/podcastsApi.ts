import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const podcastsApi = createApi({
  reducerPath: "podcastsApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Podcasts", "Episodes"],
  endpoints: (builder) => ({
    getPodcasts: builder.query({
      query: () => "/podcasts/",
      providesTags: ["Podcasts"],
    }),

    createPodcast: builder.mutation({
      query: (data) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("cover", data.cover);
        formData.append("duration", data.duration);
        formData.append("language", data.language);
        formData.append("description", data.description);
        formData.append("status", data.status);

        return {
          url: "/podcasts/",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Podcasts"],
    }),

    updatePodcast: builder.mutation({
      query: ({ id, ...data }) => {
        const formData = new FormData();
        if (data.title) formData.append("title", data.title);
        if (data.cover) formData.append("cover", data.cover);
        if (data.duration) formData.append("duration", data.duration);
        if (data.language) formData.append("language", data.language);
        if (data.description) formData.append("description", data.description);
        if (data.status) formData.append("status", data.status);
        if (data.order !== undefined)
          formData.append("order", data.order.toString());

        return {
          url: `/podcasts/${id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["Podcasts"],
    }),

    deletePodcast: builder.mutation({
      query: (id) => ({
        url: `/podcasts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Podcasts"],
    }),

    getEpisodes: builder.query({
      query: (podcastId) => `/podcasts/${podcastId}/episodes`,
      providesTags: ["Episodes"],
    }),

    addEpisode: builder.mutation({
      query: ({ podcastId, ...data }) => {
        const formData = new FormData();
        if (data.title) formData.append("title", data.title);
        if (data.duration) formData.append("duration", data.duration);
        if (data.date) formData.append("date", data.date);
        if (data.audioUrl) formData.append("audioUrl", data.audioUrl);
        if (data.audio) formData.append("audio", data.audio); // if uploading file
        if (data.status) formData.append("status", data.status);
        if (data.order !== undefined)
          formData.append("order", data.order.toString());

        return {
          url: `/podcasts/${podcastId}/episodes`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Episodes", "Podcasts"],
    }),

    updateEpisode: builder.mutation({
      query: ({ podcastId, episodeId, ...data }) => ({
        url: `/podcasts/${podcastId}/episodes/${episodeId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Episodes", "Podcasts"],
    }),

    deleteEpisode: builder.mutation({
      query: ({ podcastId, episodeId }) => ({
        url: `/podcasts/${podcastId}/episodes/${episodeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Episodes", "Podcasts"],
    }),
  }),
});

export const {
  useGetPodcastsQuery,
  useCreatePodcastMutation,
  useUpdatePodcastMutation,
  useDeletePodcastMutation,
  useGetEpisodesQuery,
  useAddEpisodeMutation,
  useUpdateEpisodeMutation,
  useDeleteEpisodeMutation,
} = podcastsApi;
