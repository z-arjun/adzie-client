import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, ApiResponse } from '../types';

const STORAGE_KEY = '@billboard_user';
const TOKEN_KEY = '@billboard_token';

// Mock user database
const mockUsers: User[] = [
    {
        id: '1',
        email: 'owner@example.com',
        fullName: 'John Owner',
        userType: 'owner',
        phone: '+1234567890',
        profileImage: 'https://i.pravatar.cc/150?img=12',
        verified: true,
        createdAt: new Date().toISOString(),
    },
    {
        id: '2',
        email: 'advertiser@example.com',
        fullName: 'Jane Advertiser',
        userType: 'advertiser',
        phone: '+1234567891',
        profileImage: 'https://i.pravatar.cc/150?img=45',
        verified: false,
        createdAt: new Date().toISOString(),
    },
];

class AuthService {
    /**
     * Mock login authentication
     */
    async login(email: string, password: string): Promise<ApiResponse<User>> {
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Find user by email
            const user = mockUsers.find(u => u.email === email);

            if (!user || password !== 'password123') {
                return {
                    success: false,
                    error: 'Invalid email or password',
                };
            }

            // Generate mock token
            const token = `mock_token_${user.id}_${Date.now()}`;

            // Store user and token
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
            await AsyncStorage.setItem(TOKEN_KEY, token);

            return {
                success: true,
                data: user,
                message: 'Login successful',
            };
        } catch (error) {
            return {
                success: false,
                error: 'An error occurred during login',
            };
        }
    }

    /**
     * Mock user registration
     */
    async register(
        email: string,
        password: string,
        fullName: string,
        userType: 'advertiser' | 'owner',
        phone: string,
    ): Promise<ApiResponse<User>> {
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Check if user already exists
            if (mockUsers.find(u => u.email === email)) {
                return {
                    success: false,
                    error: 'Email already registered',
                };
            }

            // Create new user
            const newUser: User = {
                id: `${mockUsers.length + 1}`,
                email,
                fullName,
                userType,
                phone,
                verified: false,
                createdAt: new Date().toISOString(),
            };

            mockUsers.push(newUser);

            // Generate mock token
            const token = `mock_token_${newUser.id}_${Date.now()}`;

            // Store user and token
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
            await AsyncStorage.setItem(TOKEN_KEY, token);

            return {
                success: true,
                data: newUser,
                message: 'Registration successful',
            };
        } catch (error) {
            return {
                success: false,
                error: 'An error occurred during registration',
            };
        }
    }

    /**
     * Get current user from storage
     */
    async getCurrentUser(): Promise<User | null> {
        try {
            const userJson = await AsyncStorage.getItem(STORAGE_KEY);
            if (userJson) {
                return JSON.parse(userJson);
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Get authentication token
     */
    async getToken(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(TOKEN_KEY);
        } catch (error) {
            return null;
        }
    }

    /**
     * Logout user
     */
    async logout(): Promise<void> {
        try {
            await AsyncStorage.multiRemove([STORAGE_KEY, TOKEN_KEY]);
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    /**
     * Update user profile
     */
    async updateProfile(userId: string, updates: Partial<User>): Promise<ApiResponse<User>> {
        try {
            await new Promise(resolve => setTimeout(resolve, 800));

            const userIndex = mockUsers.findIndex(u => u.id === userId);
            if (userIndex === -1) {
                return {
                    success: false,
                    error: 'User not found',
                };
            }

            mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mockUsers[userIndex]));

            return {
                success: true,
                data: mockUsers[userIndex],
                message: 'Profile updated successfully',
            };
        } catch (error) {
            return {
                success: false,
                error: 'Failed to update profile',
            };
        }
    }
}

export default new AuthService();
