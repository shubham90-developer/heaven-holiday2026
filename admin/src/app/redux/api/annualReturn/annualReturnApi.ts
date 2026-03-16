// features/annualReturn/annualReturnApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const annualReturnApi = createApi({
  reducerPath: "annualReturnApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["AnnualReturn"],
  endpoints: (builder) => ({
    // ================= GET ANNUAL RETURN =================
    getAnnualReturn: builder.query<any, void>({
      query: () => ({
        url: "/annual-return/annual-return",
        method: "GET",
      }),
      providesTags: ["AnnualReturn"],
    }),

    // ================= UPDATE MAIN STATUS =================
    updateMainStatus: builder.mutation<any, any>({
      query: (data) => ({
        url: "/annual-return/annual-return/status",
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: data,
      }),
      invalidatesTags: ["AnnualReturn"],
    }),

    // ================= ADD ITEM =================
    addItem: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/annual-return/annual-return/item",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["AnnualReturn"],
    }),

    // ================= UPDATE ITEM =================
    updateItem: builder.mutation<any, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/annual-return/annual-return/item/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["AnnualReturn"],
    }),

    // ================= DELETE ITEM =================
    deleteItem: builder.mutation<any, string>({
      query: (id) => ({
        url: `/annual-return/annual-return/item/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AnnualReturn"],
    }),
  }),
});

export const {
  useGetAnnualReturnQuery,
  useUpdateMainStatusMutation,
  useAddItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} = annualReturnApi;
