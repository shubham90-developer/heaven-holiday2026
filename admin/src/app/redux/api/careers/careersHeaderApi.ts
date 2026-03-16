// store/careersApi/careersApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const careersApi = createApi({
  reducerPath: "careersApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Careers"],
  endpoints: (builder) => ({
    // Get careers info
    getCareers: builder.query({
      query: () => ({
        url: "/careers-header/",
        method: "GET",
      }),
      providesTags: ["Careers"],
    }),

    // Update careers with video upload
    updateCareers: builder.mutation({
      query: (formData) => ({
        url: "/careers-header/",
        method: "PUT",
        body: formData, // FormData object with video
      }),
      invalidatesTags: ["Careers"],
    }),
  }),
});

export const { useGetCareersQuery, useUpdateCareersMutation } = careersApi;
