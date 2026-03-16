import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
type GetApplicationsParams = {
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
};
export const jobApplicationApi = createApi({
  reducerPath: "jobApplicationApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["JobApplication"],
  endpoints: (builder) => ({
    // Get all job applications
    getAllJobApplications: builder.query<any, GetApplicationsParams | void>({
      query: (args) => {
        const params = new URLSearchParams();

        if (args?.status) params.append("status", args.status);
        if (args?.page) params.append("page", args.page.toString());
        if (args?.limit) params.append("limit", args.limit.toString());
        if (args?.search) params.append("search", args.search);

        return `/job-applications/?${params.toString()}`;
      },
      providesTags: ["JobApplication"],
    }),

    // Create job application
    createJobApplication: builder.mutation<any, any>({
      query: (body) => ({
        url: "/job-applications/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["JobApplication"],
    }),

    // Update application status
    updateApplicationStatus: builder.mutation<
      any,
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/job-applications/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["JobApplication"],
    }),

    // Delete job application
    deleteJobApplication: builder.mutation<any, string>({
      query: (id) => ({
        url: `/job-applications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["JobApplication"],
    }),
  }),
});

export const {
  useGetAllJobApplicationsQuery,
  useCreateJobApplicationMutation,
  useUpdateApplicationStatusMutation,
  useDeleteJobApplicationMutation,
} = jobApplicationApi;
