// app/redux/api/howWeHireApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const howWeHireApi = createApi({
  reducerPath: "howWeHireApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["HowWeHire"],
  endpoints: (builder) => ({
    // GET HowWeHire document
    getHowWeHire: builder.query({
      query: () => "/hiring-process/",
      providesTags: ["HowWeHire"],
    }),

    // UPDATE heading / introText / subText
    updateHowWeHireInfo: builder.mutation({
      query: (data) => ({
        url: "/hiring-process/info",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["HowWeHire"],
    }),

    // ADD a step
    addHowWeHireStep: builder.mutation({
      query: (formData) => ({
        url: "/hiring-process/step",
        method: "POST",
        body: formData, // should be FormData if uploading images
      }),
      invalidatesTags: ["HowWeHire"],
    }),

    // UPDATE a step
    updateHowWeHireStep: builder.mutation({
      query: (formData) => ({
        url: "/hiring-process/step",
        method: "PUT",
        body: formData, // should be FormData if uploading images
      }),
      invalidatesTags: ["HowWeHire"],
    }),

    // DELETE a step
    deleteHowWeHireStep: builder.mutation({
      query: (data) => ({
        url: "/hiring-process/step",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["HowWeHire"],
    }),
  }),
});

// Export hooks
export const {
  useGetHowWeHireQuery,
  useUpdateHowWeHireInfoMutation,
  useAddHowWeHireStepMutation,
  useUpdateHowWeHireStepMutation,
  useDeleteHowWeHireStepMutation,
} = howWeHireApi;
