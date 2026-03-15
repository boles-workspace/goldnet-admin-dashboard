import { baseApi } from './baseApi';

export interface PlanFeature {
  name: string;
  included: boolean;
  limit?: number;
}

export interface TypePricing {
  jewelry_shop?: number;
  jewelry_workshop?: number;
  gold_trader?: number;
  gold_distributor?: number;
}

export interface BundleDiscounts {
  '1': number;
  '2': number;
  '3': number;
  '4': number;
}

export interface Plan {
  _id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  typePricing: TypePricing;
  bundleDiscounts: BundleDiscounts;
  currency: string;
  billingCycle: 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'TWO_YEARS' | 'FIVE_YEARS';
  features: PlanFeature[];
  maxUsers?: number;
  maxBranches?: number;
  maxStorage?: number; // in GB
  isActive: boolean;
  isPopular?: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlanData {
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  typePricing: TypePricing;
  bundleDiscounts: BundleDiscounts;
  currency: string;
  billingCycle: 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'TWO_YEARS' | 'FIVE_YEARS';
  features?: PlanFeature[];
  maxUsers?: number;
  maxBranches?: number;
  maxStorage?: number;
  isActive?: boolean;
  isPopular?: boolean;
  order?: number;
}

export const planApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPlans: builder.query<Plan[], void>({
      query: () => '/plans',  // No status param = get all plans (active + inactive)
      transformResponse: (response: { count: number; data: Plan[] }) => response.data,
      providesTags: ['Plan'],
    }),

    getPlanById: builder.query<Plan, string>({
      query: (id) => `/plans/${id}`,
      transformResponse: (response: { data: Plan }) => response.data,
      providesTags: ['Plan'],
    }),

    createPlan: builder.mutation<Plan, CreatePlanData>({
      query: (data) => ({
        url: '/plans',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: { message: string; data: Plan }) => response.data,
      invalidatesTags: ['Plan'],
    }),

    updatePlan: builder.mutation<Plan, { id: string; data: Partial<CreatePlanData> }>({
      query: ({ id, data }) => ({
        url: `/plans/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: { message: string; data: Plan }) => response.data,
      invalidatesTags: ['Plan'],
    }),

    deletePlan: builder.mutation<void, string>({
      query: (id) => ({
        url: `/plans/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Plan'],
    }),

    activatePlan: builder.mutation<Plan, string>({
      query: (id) => ({
        url: `/plans/${id}/activate`,
        method: 'PATCH',
      }),
      transformResponse: (response: { message: string; data: Plan }) => response.data,
      invalidatesTags: ['Plan'],
    }),

    deactivatePlan: builder.mutation<Plan, string>({
      query: (id) => ({
        url: `/plans/${id}/deactivate`,
        method: 'PATCH',
      }),
      transformResponse: (response: { message: string; data: Plan }) => response.data,
      invalidatesTags: ['Plan'],
    }),
  }),
});

export const {
  useGetAllPlansQuery,
  useGetPlanByIdQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  useActivatePlanMutation,
  useDeactivatePlanMutation,
} = planApi;
