import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';
import authService from '../../services/authService';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

// Async thunks
export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
        const response = await authService.login(email, password);
        if (response.success && response.data) {
            return response.data;
        } else {
            return rejectWithValue(response.error || 'Login failed');
        }
    },
);

export const register = createAsyncThunk(
    'auth/register',
    async (
        {
            email,
            password,
            fullName,
            userType,
            phone,
        }: {
            email: string;
            password: string;
            fullName: string;
            userType: 'advertiser' | 'owner';
            phone: string;
        },
        { rejectWithValue },
    ) => {
        const response = await authService.register(email, password, fullName, userType, phone);
        if (response.success && response.data) {
            return response.data;
        } else {
            return rejectWithValue(response.error || 'Registration failed');
        }
    },
);

export const loadUser = createAsyncThunk('auth/loadUser', async () => {
    const user = await authService.getCurrentUser();
    const token = await authService.getToken();
    return { user, token };
});

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async ({ userId, updates }: { userId: string; updates: Partial<User> }, { rejectWithValue }) => {
        const response = await authService.updateProfile(userId, updates);
        if (response.success && response.data) {
            return response.data;
        } else {
            return rejectWithValue(response.error || 'Update failed');
        }
    },
);

export const logout = createAsyncThunk('auth/logout', async () => {
    await authService.logout();
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: state => {
            state.error = null;
        },
    },
    extraReducers: builder => {
        // Login
        builder.addCase(login.pending, state => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
        });
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Register
        builder.addCase(register.pending, state => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
        });
        builder.addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Load User
        builder.addCase(
            loadUser.fulfilled,
            (state, action: PayloadAction<{ user: User | null; token: string | null }>) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = !!action.payload.user;
            },
        );

        // Update Profile
        builder.addCase(updateProfile.pending, state => {
            state.loading = true;
        });
        builder.addCase(updateProfile.fulfilled, (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.user = action.payload;
        });
        builder.addCase(updateProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Logout
        builder.addCase(logout.fulfilled, state => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
