// services/counterApi.ts - WITHOUT INTERFACES
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const counterApi = createApi({
  reducerPath: "counterApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Counter"],
  endpoints: (builder) => ({
    getCounter: builder.query({
      query: () => "/counter",
      providesTags: ["Counter"],
    }),

    updateCounter: builder.mutation({
      query: (body) => ({
        url: "/counter",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Counter"],
    }),
  }),
});

export const { useGetCounterQuery, useUpdateCounterMutation } = counterApi;
