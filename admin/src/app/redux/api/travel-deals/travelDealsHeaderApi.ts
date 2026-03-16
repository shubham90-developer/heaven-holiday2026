// features/holidaySection/holidaySectionApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const holidaySectionApi = createApi({
  reducerPath: "holidaySectionApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["HolidaySection"],
  endpoints: (builder) => ({
    // ================= GET HOLIDAY SECTION =================
    getHolidaySection: builder.query<any, void>({
      query: () => ({
        url: "/travel-deal-heading/holiday-section",
        method: "GET",
      }),
      providesTags: ["HolidaySection"],
    }),

    // ================= UPDATE MAIN FIELDS =================
    updateMainFields: builder.mutation<any, any>({
      query: (data) => ({
        url: "/travel-deal-heading/holiday-section/main-fields",
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: data,
      }),
      invalidatesTags: ["HolidaySection"],
    }),

    // ================= ADD FEATURE =================
    addFeature: builder.mutation<any, any>({
      query: (data) => ({
        url: "/travel-deal-heading/holiday-section/feature",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data,
      }),
      invalidatesTags: ["HolidaySection"],
    }),

    // ================= UPDATE FEATURE =================
    updateFeature: builder.mutation<
      any,
      { id: string; title: string; description: string }
    >({
      query: ({ id, ...data }) => ({
        url: `/travel-deal-heading/holiday-section/feature/${id}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: data,
      }),
      invalidatesTags: ["HolidaySection"],
    }),

    // ================= DELETE FEATURE =================
    deleteFeature: builder.mutation<any, string>({
      query: (id) => ({
        url: `/travel-deal-heading/holiday-section/feature/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["HolidaySection"],
    }),

    // ================= LEGACY: UPDATE HOLIDAY SECTION (for backward compatibility) =================
    updateHolidaySection: builder.mutation<any, any>({
      query: (data) => ({
        url: "/travel-deal-heading/holiday-section",
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: data,
      }),
      invalidatesTags: ["HolidaySection"],
    }),
  }),
});

export const {
  useGetHolidaySectionQuery,
  useUpdateMainFieldsMutation,
  useAddFeatureMutation,
  useUpdateFeatureMutation,
  useDeleteFeatureMutation,
  useUpdateHolidaySectionMutation,
} = holidaySectionApi;
