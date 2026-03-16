// redux/api/contactUs/contactUsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const contactUsApi = createApi({
  reducerPath: "contactUsApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["ContactUs"],
  endpoints: (builder) => ({
    // GET - Fetch contact details
    getContactDetails: builder.query({
      query: () => "/contact-us/",
      providesTags: ["ContactUs"],
    }),

    // PUT - Full update/create contact details
    updateContactDetails: builder.mutation({
      query: (data) => ({
        url: "/contact-us/",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ContactUs"],
    }),

    // PATCH - Partial update contact details
    patchContactDetails: builder.mutation({
      query: (data) => ({
        url: "/contact-us/",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["ContactUs"],
    }),
  }),
});

export const {
  useGetContactDetailsQuery,
  useUpdateContactDetailsMutation,
  usePatchContactDetailsMutation,
} = contactUsApi;
