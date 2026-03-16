import { createApi } from "@reduxjs/toolkit/query/react"; // ← remove fetchBaseQuery
import { baseQueryWithAuth } from "../../baseQuery";

export const aboutUsApi = createApi({
  reducerPath: "aboutUsApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["AboutUs"],
  endpoints: (builder) => ({
    getAboutUs: builder.query({
      query: () => "/aboutus",
      providesTags: ["AboutUs"],
    }),

    updateAboutUs: builder.mutation({
      query: (formData) => ({
        url: "/aboutus",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["AboutUs"],
    }),
  }),
});

export const { useGetAboutUsQuery, useUpdateAboutUsMutation } = aboutUsApi;
