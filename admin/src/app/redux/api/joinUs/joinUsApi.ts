// redux/api/joinUs/joinUsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../baseQuery";
export const joinUsApi = createApi({
  reducerPath: "joinUsApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["JoinUs"],
  endpoints: (builder) => ({
    getContent: builder.query({
      query: () => "/joinUs/",
      providesTags: ["JoinUs"],
    }),

    updateJoinUs: builder.mutation({
      query: (data) => ({
        url: "/joinUs/",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["JoinUs"],

      async onQueryStarted(updateData, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          joinUsApi.util.updateQueryData("getContent", undefined, (draft) => {
            Object.assign(draft.data, updateData);
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useGetContentQuery, useUpdateJoinUsMutation } = joinUsApi;
