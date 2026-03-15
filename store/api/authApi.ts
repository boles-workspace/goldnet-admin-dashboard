import { baseApi } from './baseApi';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'USER';
  organizationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  message: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Admin-specific endpoints
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/admin/login', // Changed to admin endpoint
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
    logout: builder.mutation<{message: string}, void>({
      query: () => ({
        url: '/admin/logout', // Changed to admin endpoint
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
    getCurrentUser: builder.query<User, void>({
      query: () => '/admin/me', // Changed to admin endpoint
      providesTags: ['Auth', 'User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
} = authApi;
