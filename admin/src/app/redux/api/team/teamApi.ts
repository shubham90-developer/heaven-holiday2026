// store/api/teamApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const teamApi = createApi({
  reducerPath: "teamApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Team"],
  endpoints: (builder) => ({
    getTeams: builder.query({
      query: (status?: "active" | "inactive") => ({
        url: "/teams",
        params: status ? { status } : undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }: any) => ({
                type: "Team" as const,
                id: _id,
              })),
              { type: "Team", id: "LIST" },
            ]
          : [{ type: "Team", id: "LIST" }],
    }),

    getTeamById: builder.query({
      query: (id: string) => `/teams/${id}`,
      providesTags: (result, error, id) => [{ type: "Team", id }],
    }),

    createTeam: builder.mutation({
      query: (formData: FormData) => ({
        url: "/teams",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Team", id: "LIST" }],
    }),

    updateTeam: builder.mutation({
      query: ({ id, formData }: { id: string; formData: FormData }) => ({
        url: `/teams/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Team", id },
        { type: "Team", id: "LIST" },
      ],
    }),

    deleteTeam: builder.mutation({
      query: (id: string) => ({
        url: `/teams/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Team", id },
        { type: "Team", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetTeamsQuery,
  useGetTeamByIdQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
} = teamApi;
