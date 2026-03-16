// redux/api/excitedtowork/excitedToWorkApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const excitedToWorkApi = createApi({
  reducerPath: "excitedToWorkApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["ExcitedToWork"],
  endpoints: (builder) => ({
    getExcitedToWork: builder.query({
      query: () => "/excited-to-work/",
      providesTags: ["ExcitedToWork"],
    }),

    updateExcitedToWork: builder.mutation({
      query: (data) => ({
        url: "/excited-to-work/",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ExcitedToWork"],
    }),
  }),
});

export const { useGetExcitedToWorkQuery, useUpdateExcitedToWorkMutation } =
  excitedToWorkApi;
