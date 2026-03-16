import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const cardApi = createApi({
  reducerPath: "cardApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Card"],
  endpoints: (builder) => ({
    getAllCards: builder.query({
      query: () => "/become-partner/",
      providesTags: ["Card"],
    }),
    createCard: builder.mutation({
      query: (formData) => ({
        url: "/become-partner/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Card"],
    }),
    updateCard: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/become-partner/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Card"],
    }),
    deleteCard: builder.mutation({
      query: (id) => ({
        url: `/become-partner/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Card"],
    }),
  }),
});

export const {
  useGetAllCardsQuery,
  useCreateCardMutation,
  useUpdateCardMutation,
  useDeleteCardMutation,
} = cardApi;
