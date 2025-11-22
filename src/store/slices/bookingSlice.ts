import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Booking } from '../../types';
import bookingService from '../../services/bookingService';

interface BookingState {
    bookings: Booking[];
    loading: boolean;
    error: string | null;
}

const initialState: BookingState = {
    bookings: [],
    loading: false,
    error: null,
};

// Async thunks
export const fetchAdvertiserBookings = createAsyncThunk(
    'booking/fetchAdvertiserBookings',
    async (advertiserId: string, { rejectWithValue }) => {
        const response = await bookingService.getAdvertiserBookings(advertiserId);
        if (response.success && response.data) {
            return response.data;
        } else {
            return rejectWithValue(response.error || 'Failed to fetch bookings');
        }
    },
);

export const fetchBillboardBookings = createAsyncThunk(
    'booking/fetchBillboardBookings',
    async (billboardId: string, { rejectWithValue }) => {
        const response = await bookingService.getBillboardBookings(billboardId);
        if (response.success && response.data) {
            return response.data;
        } else {
            return rejectWithValue(response.error || 'Failed to fetch bookings');
        }
    },
);

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        clearBookings: state => {
            state.bookings = [];
            state.error = null;
        },
    },
    extraReducers: builder => {
        // Fetch Advertiser Bookings
        builder.addCase(fetchAdvertiserBookings.pending, state => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchAdvertiserBookings.fulfilled, (state, action: PayloadAction<Booking[]>) => {
            state.loading = false;
            state.bookings = action.payload;
        });
        builder.addCase(fetchAdvertiserBookings.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Fetch Billboard Bookings
        builder.addCase(fetchBillboardBookings.pending, state => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchBillboardBookings.fulfilled, (state, action: PayloadAction<Booking[]>) => {
            state.loading = false;
            state.bookings = action.payload;
        });
        builder.addCase(fetchBillboardBookings.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { clearBookings } = bookingSlice.actions;
export default bookingSlice.reducer;
