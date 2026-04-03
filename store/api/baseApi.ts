import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: 'include', // Important for cookies
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');

      // Add Accept-Language header for translated error messages
      // Get language from localStorage or default to Arabic
      const language = typeof window !== 'undefined'
        ? localStorage.getItem('language') || 'ar'
        : 'ar';
      headers.set('Accept-Language', language);

      return headers;
    },
  }),
  tagTypes: ['Auth', 'User', 'Organization', 'Plan', 'Payment', 'Subscription'],
  endpoints: () => ({}),
});
