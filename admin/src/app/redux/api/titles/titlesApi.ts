import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";

export const pageTitlesApi = createApi({
  reducerPath: "pageTitlesApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["PageTitles"],
  endpoints: (builder) => ({
    // GET page titles
    getPageTitles: builder.query({
      query: () => "/titles",
      providesTags: ["PageTitles"],
    }),

    // UPDATE page titles
    updatePageTitles: builder.mutation({
      query: (data) => ({
        url: "/titles",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["PageTitles"],
    }),
  }),
});

export const { useGetPageTitlesQuery, useUpdatePageTitlesMutation } =
  pageTitlesApi;
