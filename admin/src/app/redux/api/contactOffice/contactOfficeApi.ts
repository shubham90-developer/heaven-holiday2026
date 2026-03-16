import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const contactOfficeApi = createApi({
  reducerPath: "contactOfficeApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Office"],
  endpoints: (builder) => ({
    getAllOffices: builder.query({
      query: () => "/contact-office/",
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }: any) => ({
                type: "Office" as const,
                id: _id,
              })),
              { type: "Office", id: "LIST" },
            ]
          : [{ type: "Office", id: "LIST" }],
    }),

    getOfficeById: builder.query({
      query: (id: string) => `/contact-office/${id}`,
      providesTags: (result, error, id) => [{ type: "Office", id }],
    }),

    createOffice: builder.mutation({
      query: (data: any) => ({
        url: "/contact-office/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Office", id: "LIST" }],
    }),

    updateOffice: builder.mutation({
      query: ({ id, ...data }: { id: string; [key: string]: any }) => ({
        url: `/contact-office/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Office", id },
        { type: "Office", id: "LIST" },
      ],
    }),

    deleteOffice: builder.mutation({
      query: (id: string) => ({
        url: `/contact-office/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Office", id: "LIST" }],
    }),

    updateOfficeTimes: builder.mutation({
      query: ({ id, officeTimes }: { id: string; officeTimes: any[] }) => ({
        url: `/contact-office/${id}/times`,
        method: "PUT",
        body: { officeTimes },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Office", id },
        { type: "Office", id: "LIST" },
      ],
    }),

    addHoliday: builder.mutation({
      query: ({
        id,
        date,
        description,
      }: {
        id: string;
        date: string;
        description: string;
      }) => ({
        url: `/contact-office/${id}/holidays`,
        method: "POST",
        body: { date, description },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Office", id },
        { type: "Office", id: "LIST" },
      ],
    }),

    removeHoliday: builder.mutation({
      query: ({ id, date }: { id: string; date: string }) => ({
        url: `/contact-office/${id}/holidays`,
        method: "DELETE",
        body: { date },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Office", id },
        { type: "Office", id: "LIST" },
      ],
    }),

    getOfficeHolidays: builder.query({
      query: (id: string) => `/contact-office/${id}/holidays`,
      providesTags: (result, error, id) => [{ type: "Office", id }],
    }),

    checkOfficeStatus: builder.query({
      query: (id: string) => `/contact-office/${id}/status`,
    }),

    getOfficeSchedule: builder.query({
      query: ({
        id,
        startDate,
        endDate,
      }: {
        id: string;
        startDate?: string;
        endDate?: string;
      }) => {
        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        return `/contact-office/${id}/schedule${params.toString() ? `?${params.toString()}` : ""}`;
      },
      providesTags: (result, error, { id }) => [{ type: "Office", id }],
    }),
  }),
});

export const {
  useGetAllOfficesQuery,
  useGetOfficeByIdQuery,
  useCreateOfficeMutation,
  useUpdateOfficeMutation,
  useDeleteOfficeMutation,
  useUpdateOfficeTimesMutation,
  useAddHolidayMutation,
  useRemoveHolidayMutation,
  useGetOfficeHolidaysQuery,
  useCheckOfficeStatusQuery,
  useGetOfficeScheduleQuery,
} = contactOfficeApi;
