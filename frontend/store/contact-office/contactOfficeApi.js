import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const contactOfficeApi = createApi({
  reducerPath: "contactOfficeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["Office"],
  endpoints: (builder) => ({
    getAllOffices: builder.query({
      query: () => "/contact-office",
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Office",
                id: _id,
              })),
              { type: "Office", id: "LIST" },
            ]
          : [{ type: "Office", id: "LIST" }],
    }),
    getOfficeById: builder.query({
      query: (id) => `/contact-office/${id}`,
      providesTags: (result, error, id) => [{ type: "Office", id }],
    }),
    checkOfficeStatus: builder.query({
      query: (id) => `/contact-office/${id}/status`,
    }),
  }),
});

export const {
  useGetAllOfficesQuery,
  useGetOfficeByIdQuery,
  useCheckOfficeStatusQuery,
} = contactOfficeApi;
