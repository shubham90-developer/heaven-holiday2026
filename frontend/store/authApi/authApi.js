import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { auth } from "@/app/config/firebase";

// Base query with token handling from localStorage + Firebase fallback
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  prepareHeaders: async (headers) => {
    // Try to get token from localStorage first
    let token = localStorage.getItem("authToken");

    // If no token in localStorage, get from Firebase
    if (!token && auth.currentUser) {
      try {
        token = await auth.currentUser.getIdToken(true);
        // Save to localStorage for future requests
        localStorage.setItem("authToken", token);
      } catch (error) {
        console.error("Error getting token from Firebase:", error);
      }
    }

    // Add token to headers if available
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  tagTypes: ["User", "Profile", "Wishlist"],
  endpoints: (builder) => ({
    // Step 1: Verify Phone & Register/Login
    verifyPhoneAndRegister: builder.mutation({
      query: (data) => ({
        url: "/register/verify-phone",
        method: "POST",
        body: data,
      }),

      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          const mongoUserId = data?.data?.user?._id;

          if (mongoUserId) {
            localStorage.setItem("userId", mongoUserId);
          } else {
            console.error("MongoDB userId not found in backend response");
          }

          if (auth.currentUser) {
            const token = await auth.currentUser.getIdToken(true);
            localStorage.setItem("authToken", token);
          }
        } catch (error) {
          console.error("Error in verifyPhoneAndRegister:", error);
        }
      },

      invalidatesTags: ["User", "Profile"],
    }),

    // Step 2: Complete Basic Info
    completeBasicInfo: builder.mutation({
      query: (data) => ({
        url: "register/complete-profile",
        method: "POST",
        body: data, // { firstName, lastName, email }
      }),
      // Refresh token after profile completion
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;

          if (auth.currentUser) {
            const token = await auth.currentUser.getIdToken(true);
            localStorage.setItem("authToken", token);
          }
        } catch (error) {
          console.error("Error in completeBasicInfo:", error);
        }
      },
      invalidatesTags: ["User", "Profile"],
    }),

    // Get User Profile
    getProfile: builder.query({
      query: () => "/register/profile",
      providesTags: ["Profile", "Wishlist"],
    }),

    // Update Profile (includes profile image)
    updateProfile: builder.mutation({
      query: (data) => {
        const formData = new FormData();

        // Add text fields
        if (data.firstName) formData.append("firstName", data.firstName);
        if (data.lastName) formData.append("lastName", data.lastName);
        if (data.email) formData.append("email", data.email);
        if (data.phone) formData.append("phone", data.phone);
        if (data.gender) formData.append("gender", data.gender);
        if (data.nationality) formData.append("nationality", data.nationality);
        if (data.dateOfBirth) formData.append("dateOfBirth", data.dateOfBirth);

        // Add profile image if present
        if (data.profileImage) {
          formData.append("profileImage", data.profileImage);
        }

        return {
          url: "/register/profile",
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["Profile"],
    }),

    // Update Address
    updateAddress: builder.mutation({
      query: (data) => ({
        url: "/register/address",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),

    // Upload/Update Profile Image
    uploadProfileImage: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("profileImage", file);

        return {
          url: "/register/profile-image",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Profile"],
    }),

    // Upload Document (Unified endpoint for all document types)
    uploadDocument: builder.mutation({
      query: ({ documentType, side, documentNumber, documentName, file }) => {
        const formData = new FormData();

        formData.append("documentType", documentType);
        formData.append("side", side); // 'front' or 'back'

        if (documentName) {
          formData.append("documentName", documentName);
        }

        if (file) {
          formData.append("documentImage", file);
        }

        return {
          url: "/register/upload-document",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Profile"],
    }),

    // Logout - Clear token from localStorage
    logout: builder.mutation({
      queryFn: async () => {
        try {
          // Sign out from Firebase
          await auth.signOut();

          // Clear token from localStorage
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");

          return { data: { success: true } };
        } catch (error) {
          return { error: { status: 500, data: error } };
        }
      },
      invalidatesTags: ["User", "Profile"],
    }),

    // Add Tour Package to Wishlist
    addToWishlist: builder.mutation({
      query: ({ packageId }) => ({
        url: "/register/wishlist",
        method: "POST",
        body: { packageId }, // Only send packageId, backend gets Firebase UID from token
      }),
      invalidatesTags: ["Wishlist", "Profile"],
    }),

    // Remove Tour Package from Wishlist
    // Remove Tour Package from Wishlist
    removeFromWishlist: builder.mutation({
      query: ({ packageId }) => ({
        url: `/register/wishlist/${packageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist", "Profile"],
    }),
  }),
});

export const {
  useVerifyPhoneAndRegisterMutation,
  useCompleteBasicInfoMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateAddressMutation,
  useUploadProfileImageMutation,
  useUploadDocumentMutation,
  useLogoutMutation,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = authApi;
