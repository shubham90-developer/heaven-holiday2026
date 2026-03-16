// redux/api/empoweringApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const empoweringApi = createApi({
  reducerPath: "empoweringApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Empowering"],
  endpoints: (builder) => ({
    // Get empowering content
    getEmpowering: builder.query({
      query: () => "/empowering-women/",
      providesTags: ["Empowering"],
    }),

    // Update empowering content
    updateEmpowering: builder.mutation({
      query: (data) => ({
        url: "/empowering-women/",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Empowering"],
    }),
  }),
});

export const { useGetEmpoweringQuery, useUpdateEmpoweringMutation } =
  empoweringApi;
