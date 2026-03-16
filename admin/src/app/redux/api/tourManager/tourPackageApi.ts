import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const tourPackageApi = createApi({
  reducerPath: "tourPackageApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Category", "TourPackageCard", "Departure"],
  endpoints: (builder) => ({
    // ==================== CATEGORY ENDPOINTS ====================

    createCategory: builder.mutation({
      query: (data: FormData) => ({
        url: "/tour-package/categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category"],
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
        return `/tour-package/categories${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      },
      providesTags: ["Category"],
    }),

    updateCategory: builder.mutation({
      query: ({
        categoryId,
        data,
      }: {
        categoryId: string;
        data: FormData;
      }) => ({
        url: `/tour-package/categories/${categoryId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { categoryId }) => [
        { type: "Category", id: categoryId },
        "Category",
      ],
    }),

    deleteCategory: builder.mutation({
      query: (categoryId: string) => ({
        url: `/tour-package/categories/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, categoryId) => [
        { type: "Category", id: categoryId },
        "Category",
      ],
    }),

    // ==================== TOUR PACKAGE CARD ENDPOINTS ====================

    createTourPackageCard: builder.mutation({
      query: (data: FormData) => ({
        url: "/tour-package/tour-package-cards",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["TourPackageCard"],
    }),

    getTourPackageCards: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              queryParams.append(key, String(value));
            }
          });
        }
        return `/tour-package/tour-package-cards${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      },
      providesTags: ["TourPackageCard"],
    }),

    updateTourPackageCard: builder.mutation({
      query: ({ cardId, data }: { cardId: string; data: FormData }) => ({
        url: `/tour-package/tour-package-cards/${cardId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { cardId }) => [
        { type: "TourPackageCard", id: cardId },
        "TourPackageCard",
        "Departure", // Invalidate departures when tour is updated
      ],
    }),

    deleteTourPackageCard: builder.mutation({
      query: (cardId: string) => ({
        url: `/tour-package/tour-package-cards/${cardId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, cardId) => [
        { type: "TourPackageCard", id: cardId },
        "TourPackageCard",
        "Departure",
      ],
    }),

    // ==================== NEW: DEPARTURE ENDPOINTS ====================

    // Get all departures for a tour (with filters)
    getTourDepartures: builder.query({
      query: ({ tourId, params }: { tourId: string; params?: any }) => {
        const queryParams = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              queryParams.append(key, String(value));
            }
          });
        }
        return `/tour-package/tours/${tourId}/departures${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      },
      providesTags: (result, error, { tourId }) => [
        { type: "Departure", id: tourId },
      ],
    }),

    // Get departure cities for a tour
    getDepartureCities: builder.query({
      query: (tourId: string) => ({
        url: `/tour-package/tours/${tourId}/departure-cities`,
      }),
      providesTags: (result, error, tourId) => [
        { type: "Departure", id: `${tourId}-cities` },
      ],
    }),

    // Update departure seats (booking)
    updateDepartureSeats: builder.mutation({
      query: ({
        tourId,
        data,
      }: {
        tourId: string;
        data: {
          departureCity: string;
          departureDate: string;
          seatsToReduce: number;
        };
      }) => ({
        url: `/tour-package/tours/${tourId}/departures/book`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { tourId }) => [
        { type: "Departure", id: tourId },
        { type: "TourPackageCard", id: tourId },
        "TourPackageCard",
      ],
    }),

    // Bulk add departures (admin)
    bulkAddDepartures: builder.mutation({
      query: (data: {
        tourId: string;
        departures: Array<{
          city: string;
          date: string;
          fullPackagePrice: number;
          joiningPrice: number;
          availableSeats: number;
          totalSeats: number;
        }>;
      }) => ({
        url: "/tour-package/tours/departures/bulk-add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { tourId }) => [
        { type: "Departure", id: tourId },
        { type: "TourPackageCard", id: tourId },
        "TourPackageCard",
      ],
    }),

    // Bulk update departure status (admin)
    bulkUpdateDepartureStatus: builder.mutation({
      query: (data: {
        tourId: string;
        departureCity?: string;
        departureDate?: string;
        newStatus: "Available" | "Filling Fast" | "Sold Out" | "Cancelled";
      }) => ({
        url: "/tour-package/tours/departures/bulk-update-status",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { tourId }) => [
        { type: "Departure", id: tourId },
        { type: "TourPackageCard", id: tourId },
        "TourPackageCard",
      ],
    }),
  }),
});

export const {
  // Category hooks
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,

  // Tour Package Card hooks
  useCreateTourPackageCardMutation,
  useGetTourPackageCardsQuery,
  useUpdateTourPackageCardMutation,
  useDeleteTourPackageCardMutation,

  // NEW: Departure hooks
  useGetTourDeparturesQuery,
  useGetDepartureCitiesQuery,
  useUpdateDepartureSeatsMutation,
  useBulkAddDeparturesMutation,
  useBulkUpdateDepartureStatusMutation,
} = tourPackageApi;
