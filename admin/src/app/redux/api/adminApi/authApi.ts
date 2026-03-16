import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Role", "User"],

  endpoints: (builder) => ({
    loginAdmin: builder.mutation({
      query: (credentials) => ({
        url: "/admin/login",
        method: "POST",
        body: credentials,
      }),
    }),

    getAdmin: builder.query({
      query: () => "/admin/me",
    }),

    changePassword: builder.mutation({
      query: (passwords) => ({
        url: "/admin/change-password",
        method: "PATCH",
        body: passwords,
      }),
    }),

    updateEmail: builder.mutation({
      query: (data) => ({
        url: "/admin/update-email",
        method: "PUT",
        body: data,
      }),
    }),

    // ─── ROLE MANAGEMENT ────────────────────────────────

    createRole: builder.mutation({
      query: (data) => ({
        url: "/roles/roles",
        method: "POST",
        body: data,
        // body: { name: "Manager", permissions: ["users:view", "orders:view"] }
      }),
      invalidatesTags: ["Role"],
    }),

    getAllRoles: builder.query({
      query: () => "/roles/roles",
      providesTags: ["Role"],
    }),

    updateRole: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/roles/roles/${id}`,
        method: "PATCH",
        body: data,
        // body: { permissions: ["users:view", "orders:view"] }
      }),
      invalidatesTags: ["Role"],
    }),

    deleteRole: builder.mutation({
      query: (id) => ({
        url: `/roles/roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Role"],
    }),

    // ─── USER MANAGEMENT ────────────────────────────────

    createUser: builder.mutation({
      query: (data) => ({
        url: "/roles/users",
        method: "POST",
        body: data,
        // body: { username, email, password, roleId }
      }),
      invalidatesTags: ["User"],
    }),

    getAllUsers: builder.query({
      query: () => "/roles/users",
      providesTags: ["User"],
    }),

    changeUserRole: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/roles/users/${id}/role`,
        method: "PATCH",
        body: data,
        // body: { roleId }
      }),
      invalidatesTags: ["User"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/roles/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  // existing
  useLoginAdminMutation,
  useGetAdminQuery,
  useChangePasswordMutation,
  useUpdateEmailMutation,
  // role management
  useCreateRoleMutation,
  useGetAllRolesQuery,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  // user management
  useCreateUserMutation,
  useGetAllUsersQuery,
  useChangeUserRoleMutation,
  useDeleteUserMutation,
} = adminApi;
