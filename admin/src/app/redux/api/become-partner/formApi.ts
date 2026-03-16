import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const becomePartnerFormApi = createApi({
  reducerPath: "becomePartnerFormApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Form"],
  endpoints: (builder) => ({
    getAllForms: builder.query({
      query: () => "/become-partner-form/",
      providesTags: ["Form"],
    }),

    updateFormStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/become-partner-form/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Form"],
    }),
    deleteForm: builder.mutation({
      query: (id) => ({
        url: `/become-partner-form/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Form"],
    }),
  }),
});

export const {
  useGetAllFormsQuery,

  useUpdateFormStatusMutation,
  useDeleteFormMutation,
} = becomePartnerFormApi;
