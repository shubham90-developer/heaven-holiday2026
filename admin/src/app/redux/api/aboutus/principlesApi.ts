// principleApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const principleApi = createApi({
  reducerPath: "principleApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Principle"],
  endpoints: (builder) => ({
    // GET /v1/api/principles/
    getPrinciple: builder.query({
      query: () => "/principles/", // matches your router.get('/')
      providesTags: ["Principle"],
    }),

    // PUT /v1/api/principles/
    updateMainFields: builder.mutation({
      query: (data) => ({
        url: "/principles/", // matches router.put('/')
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Principle"],
    }),

    // POST /v1/api/principles/details
    addDetail: builder.mutation({
      query: (data) => ({
        url: "/principles/details",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Principle"],
    }),

    // PUT /v1/api/principles/details/:id
    updateDetail: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/principles/details/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Principle"],
    }),

    // DELETE /v1/api/principles/details/:id
    deleteDetail: builder.mutation({
      query: (id) => ({
        url: `/=/principles/details/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Principle"],
    }),
  }),
});

export const {
  useGetPrincipleQuery,
  useUpdateMainFieldsMutation,
  useAddDetailMutation,
  useUpdateDetailMutation,
  useDeleteDetailMutation,
} = principleApi;
