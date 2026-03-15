import { baseApi } from './baseApi';

export interface Organization {
  _id: string;
  nameEn: string;
  nameAr: string;
  slug: string;
  types: string[];
  tenantId: string;
  tenantDbName?: string;
  ownerId: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  businessLicense?: string;
  numberOfBranches: number;
  maxUsers: number;
  currentUsers: number;
  planId?: string;
  billingCycle?: string;
  subscriptionDuration?: number;
  totalPrice?: number;
  transactionReference?: string;
  paymentReceiptUrl?: string;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'suspended' | 'expired' | 'cancelled';
  activatedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  suspendedAt?: string;
  suspensionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApproveOrganizationRequest {
  status: 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
}

export interface ProvisionTenantRequest {
  organizationId: string;
}

export const organizationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // List all organizations
    listOrganizations: builder.query<{ data: Organization[]; total: number }, { status?: string }>({
      query: ({ status }) => ({
        url: '/tenants',
        params: status ? { status } : undefined,
      }),
      transformResponse: (response: any) => ({
        data: response.data || [],
        total: response.total || 0,
      }),
      providesTags: ['Organization'],
    }),

    // Get organization by ID
    getOrganization: builder.query<Organization, string>({
      query: (id) => `/tenants/${id}`,
      transformResponse: (response: any) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'Organization', id }],
    }),

    // Approve or reject organization
    approveOrganization: builder.mutation<Organization, { id: string; data: ApproveOrganizationRequest }>({
      query: ({ id, data }) => ({
        url: `/tenants/${id}/approve`,
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: ['Organization'],
    }),

    // Provision tenant database (separate step after approval)
    provisionTenant: builder.mutation<void, string>({
      query: (organizationId) => ({
        url: `/tenants/provision/${organizationId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Organization'],
    }),
  }),
});

export const {
  useListOrganizationsQuery,
  useGetOrganizationQuery,
  useApproveOrganizationMutation,
  useProvisionTenantMutation,
} = organizationApi;
