import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Organization {
  _id: string;
  tenantId: string;
  name: string;
  email: string;
  phone: string;
  type: string[];
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED';
  maxBranches: number;
  maxUsers: number;
  createdAt: string;
  updatedAt: string;
}

interface OrganizationState {
  current: Organization | null;
  list: Organization[];
  loading: boolean;
  error: string | null;
  filters: {
    status?: string;
    type?: string;
    search?: string;
  };
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

const initialState: OrganizationState = {
  current: null,
  list: [],
  loading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
  },
};

const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    setOrganizations: (state, action: PayloadAction<Organization[]>) => {
      state.list = action.payload;
    },
    setCurrentOrganization: (state, action: PayloadAction<Organization | null>) => {
      state.current = action.payload;
    },
    updateOrganization: (state, action: PayloadAction<Organization>) => {
      const index = state.list.findIndex((org) => org._id === action.payload._id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
      if (state.current?._id === action.payload._id) {
        state.current = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilters: (state, action: PayloadAction<OrganizationState['filters']>) => {
      state.filters = action.payload;
    },
    setPagination: (state, action: PayloadAction<Partial<OrganizationState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearOrganizations: (state) => {
      state.list = [];
      state.current = null;
    },
  },
});

export const {
  setOrganizations,
  setCurrentOrganization,
  updateOrganization,
  setLoading,
  setError,
  setFilters,
  setPagination,
  clearOrganizations,
} = organizationSlice.actions;

export default organizationSlice.reducer;
