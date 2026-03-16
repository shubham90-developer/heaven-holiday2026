import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const cityApi = createApi({
  reducerPath: "cityApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["City"],
  endpoints: (builder) => ({
    getAllCities: builder.query({
      query: () => "/contact-city/",
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }: any) => ({
                type: "City" as const,
                id: _id,
              })),
              { type: "City", id: "LIST" },
            ]
          : [{ type: "City", id: "LIST" }],
    }),

    createCity: builder.mutation({
      query: (data: FormData) => ({
        url: "/contact-city/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "City", id: "LIST" }],
    }),

    updateCity: builder.mutation({
      query: ({ id, data }: { id: string; data: FormData }) => ({
        url: `/contact-city/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "City", id },
        { type: "City", id: "LIST" },
      ],
    }),

    deleteCity: builder.mutation({
      query: (id: string) => ({
        url: `/contact-city/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "City", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllCitiesQuery,
  useCreateCityMutation,
  useUpdateCityMutation,
  useDeleteCityMutation,
} = cityApi;
