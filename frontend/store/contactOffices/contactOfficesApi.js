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
              ...result.data.map((_id) => ({
                type: "Office",
                id: _id,
              })),
              { type: "Office", id: "LIST" },
            ]
          : [{ type: "Office", id: "LIST" }],
    }),
  }),
});

export const { useGetAllOfficesQuery } = contactOfficeApi;
