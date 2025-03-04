import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export default interface IUser {
  email: string;
  password: string;
  username: string;
  profilePicture?: string;
  profession?: string;
  bio?: string;
  isVerified?: boolean;
  isBlocked?: boolean;
  isGoogleUser: boolean;
  _id?: string; 
}

export interface IUserResponse {
  accessToken?: string;
  refreshToken?: string;
  email: string;
  username: string;
  profilePicture?: string;
  profession?: string;
  bio?: string;
  isVerified?: boolean;
  isBlocked?: boolean;
  isGoogleUser: boolean;
  _id: string;
}

export interface SignupRequest {
  userData: {
    email: string;
    password: string;
    username: string;
    profilePicture?: string;
    profession?: string;
    bio?: string;
    isGoogleUser?: boolean;
  };
}

interface SignupResponse {
  email: string; 
}

interface LoginRequest {
  email: string;
  password: string;
}

type LoginResponse = IUserResponse;

export interface OtpRequest{
  otp: string,
  email: string
}

interface otpResponse{
  message: string
}

export interface UpdateProfileRequest {
  username?: string;
  profession?: string;
  bio?: string;
  profilePicture?: string;
}

export interface PresignedUrlRequest {
  userId: string;
  fileType: string;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  key: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3008/api',
    prepareHeaders: (headers) => {
      const token = Cookies.get('accessToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    signup: builder.mutation<SignupResponse, SignupRequest>({
      query: (credentials) => ({
        url: '/auth/signup',
        method: 'POST',
        body: credentials,
      }),
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    otpVerification: builder.mutation<otpResponse, OtpRequest>({
      query:(credentials)=>({
        url: '/auth/verify-otp',
        method: 'POST',
        body: credentials
      })
    }),
    getUser: builder.query<IUserResponse, void>({
      query: () => ({
        url: '/auth/me', 
        method: 'GET',
        headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
      }),
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation<IUserResponse, UpdateProfileRequest>({
      query: (profileData) => ({
        url: '/profile/update',
        method: 'PATCH',
        body: profileData,
      }),
      invalidatesTags: ['User'],
    }),
    getPresignedUrl: builder.mutation<PresignedUrlResponse, PresignedUrlRequest>({
      query: (urlData) => ({
        url: '/profile/upload-url',
        method: 'POST',
        body: urlData,
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation, 
  useOtpVerificationMutation, 
  useGetUserQuery,
  useUpdateProfileMutation,
  useGetPresignedUrlMutation
} = authApi;