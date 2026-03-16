import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const footerInfoApi = createApi({
  reducerPath: "footerInfoApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["FooterInfo"],
  endpoints: (builder) => ({
    getFooterInfo: builder.query({
      query: () => "/footer-info/",
      providesTags: ["FooterInfo"],
    }),

    updateFooterInfo: builder.mutation({
      query: (body) => ({
        url: "/footer-info/",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["FooterInfo"],
    }),
  }),
});

export const {
  useGetFooterInfoQuery,

  useUpdateFooterInfoMutation,
} = footerInfoApi;
