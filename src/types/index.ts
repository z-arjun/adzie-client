// User Types
export type UserType = 'advertiser' | 'owner';

export interface User {
    id: string;
    email: string;
    fullName: string;
    userType: UserType;
    phone: string;
    profileImage?: string;
    verified: boolean;
    createdAt: string;
}

// Billboard Types
export type LightingType = 'daylight' | 'night' | 'both';
export type BillboardStatus = 'active' | 'inactive' | 'pending';

export interface Dimensions {
    width: number;
    height: number;
    unit: 'ft' | 'm';
}

export interface Location {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
    zipCode?: string;
}

export interface Billboard {
    id: string;
    ownerId: string;
    title: string;
    description: string;
    location: Location;
    dimensions: Dimensions;
    pricePerDay: number;
    lighting: LightingType;
    images: (string | number)[];
    status: BillboardStatus;
    viewsCount: number;
    rating: number;
    reviewCount: number;
    availableDates: string[];
    createdAt: string;
    estimatedDailyImpressions: number;
    type: 'digital' | 'static';
    features: string[];
    minBookingDays: number;
}

// Booking Types
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
    id: string;
    billboardId: string;
    advertiserId: string;
    startDate: string;
    endDate: string;
    totalAmount: number;
    status: BookingStatus;
    paymentId?: string;
    creativeUrl?: string | number;
    creativeApproved: boolean;
    proofOfDisplayUrl?: string | number;
    createdAt: string;
}

// Review Types
export interface Review {
    id: string;
    billboardId: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

// Message Types
export interface Message {
    id: string;
    bookingId: string;
    senderId: string;
    receiverId: string;
    text: string;
    attachmentUrl?: string;
    read: boolean;
    createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Filter Types
export interface BillboardFilter {
    location?: {
        latitude: number;
        longitude: number;
        radius: number; // in km
    };
    priceRange?: {
        min: number;
        max: number;
    };
    lighting?: LightingType;
    minWidth?: number;
    minHeight?: number;
    city?: string;
    state?: string;
    area?: string;
    searchQuery?: string;
    sortBy?: 'price' | 'distance' | 'rating';
}
