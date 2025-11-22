import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Billboard, BillboardFilter } from '../../types';
import billboardService from '../../services/billboardService';

interface BillboardState {
    billboards: Billboard[];
    selectedBillboard: Billboard | null;
    ownerBillboards: Billboard[];
    loading: boolean;
    error: string | null;
    detailLoading: boolean;
    detailError: string | null;
    filter: BillboardFilter | null;
}

const initialState: BillboardState = {
    billboards: [],
    selectedBillboard: null,
    ownerBillboards: [],
    loading: false,
    error: null,
    detailLoading: false,
    detailError: null,
    filter: null,
};

// Async Thunks

export const fetchBillboards = createAsyncThunk(
    'billboard/fetchBillboards',
    async (filter: BillboardFilter | undefined, { rejectWithValue }) => {
        const response = await billboardService.getBillboards(filter);
        if (response.success && response.data) {
            return response.data;
        } else {
            return rejectWithValue(response.error || 'Failed to fetch billboards');
        }
    }
);

export const fetchBillboardById = createAsyncThunk(
    'billboard/fetchBillboardById',
    async (id: string, { rejectWithValue }) => {
        const response = await billboardService.getBillboardById(id);
        if (response.success && response.data) {
            return response.data;
        } else {
            return rejectWithValue(response.error || 'Failed to fetch billboard details');
        }
    }
);

export const fetchOwnerBillboards = createAsyncThunk(
    'billboard/fetchOwnerBillboards',
    async (ownerId: string, { rejectWithValue }) => {
        const response = await billboardService.getOwnerBillboards(ownerId);
        if (response.success && response.data) {
            return response.data;
        } else {
            return rejectWithValue(response.error || 'Failed to fetch owner billboards');
        }
    }
);

export const createBillboard = createAsyncThunk(
    'billboard/createBillboard',
    async (billboardData: Omit<Billboard, 'id' | 'createdAt' | 'viewsCount' | 'rating' | 'reviewCount'>, { rejectWithValue }) => {
        const response = await billboardService.createBillboard(billboardData);
        if (response.success && response.data) {
            return response.data;
        } else {
            return rejectWithValue(response.error || 'Failed to create billboard');
        }
    }
);

const billboardSlice = createSlice({
    name: 'billboard',
    initialState,
    reducers: {
        setFilter: (state, action: PayloadAction<BillboardFilter>) => {
            state.filter = action.payload;
        },
        clearFilter: (state) => {
            state.filter = null;
        },
        clearSelectedBillboard: (state) => {
            state.selectedBillboard = null;
        },
    },
    extraReducers: builder => {
        // Fetch Billboards
        builder.addCase(fetchBillboards.pending, state => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchBillboards.fulfilled, (state, action: PayloadAction<Billboard[]>) => {
            state.loading = false;
            state.billboards = action.payload;
        });
        builder.addCase(fetchBillboards.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Fetch Billboard By ID
        builder.addCase(fetchBillboardById.pending, state => {
            state.detailLoading = true;
            state.detailError = null;
        });
        builder.addCase(fetchBillboardById.fulfilled, (state, action: PayloadAction<Billboard>) => {
            state.detailLoading = false;
            state.selectedBillboard = action.payload;
        });
        builder.addCase(fetchBillboardById.rejected, (state, action) => {
            state.detailLoading = false;
            state.detailError = action.payload as string;
        });

        // Fetch Owner Billboards
        builder.addCase(fetchOwnerBillboards.pending, state => {
            state.loading = true;
        });
        builder.addCase(fetchOwnerBillboards.fulfilled, (state, action: PayloadAction<Billboard[]>) => {
            state.loading = false;
            state.ownerBillboards = action.payload;
        });
        builder.addCase(fetchOwnerBillboards.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Create Billboard
        builder.addCase(createBillboard.pending, state => {
            state.loading = true;
        });
        builder.addCase(createBillboard.fulfilled, (state, action: PayloadAction<Billboard>) => {
            state.loading = false;
            state.ownerBillboards.push(action.payload);
        });
        builder.addCase(createBillboard.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { setFilter, clearFilter, clearSelectedBillboard } = billboardSlice.actions;
export default billboardSlice.reducer;
