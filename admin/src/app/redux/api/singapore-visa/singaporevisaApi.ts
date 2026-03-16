// features/visaInfo/visaInfoApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const visaInfoApi = createApi({
  reducerPath: "visaInfoApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["VisaInfo"],
  endpoints: (builder) => ({
    // ================= GET VISA INFO =================
    getVisaInfo: builder.query<any, void>({
      query: () => ({
        url: "/visa-info/visa-info",
        method: "GET",
      }),
      providesTags: ["VisaInfo"],
    }),

    // ================= UPDATE VISA INFO =================
    updateVisaInfo: builder.mutation<any, any>({
      query: (data) => ({
        url: "/visa-info/visa-info",
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: data,
      }),
      invalidatesTags: ["VisaInfo"],
    }),
  }),
});

export const { useGetVisaInfoQuery, useUpdateVisaInfoMutation } = visaInfoApi;
