import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const tourPackageApi = createApi({
  reducerPath: "tourPackageApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  tagTypes: ["TourPackage", "Category"],

  endpoints: (builder) => ({
    getTourPackage: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();

        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              queryParams.append(key, String(value));
            }
          });
        }

        return `/tour-package/tour-package-cards${
          queryParams.toString() ? `?${queryParams.toString()}` : ""
        }`;
      },
      providesTags: ["TourPackage"],
    }),

    getCategories: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();

        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              queryParams.append(key, String(value));
            }
          });
        }

        return `/tour-package/categories${
          queryParams.toString() ? `?${queryParams.toString()}` : ""
        }`;
      },
      providesTags: ["Category"],
    }),
    shareTourByEmail: builder.mutation({
      query: ({ tourId, recipientEmail }) => ({
        url: "/tour-package/share-email",
        method: "POST",
        body: { tourId, recipientEmail },
      }),
    }),
  }),
});

export const {
  useGetTourPackageQuery,
  useGetCategoriesQuery,
  useShareTourByEmailMutation,
} = tourPackageApi;
