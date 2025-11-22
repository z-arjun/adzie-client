import { Booking, ApiResponse } from '../types';

// Mock bookings data
const mockBookings: Booking[] = [
    {
        id: '1',
        billboardId: '1',
        advertiserId: '2',
        startDate: '2024-03-15',
        endDate: '2024-03-22',
        totalAmount: 3500,
        status: 'confirmed',
        paymentId: 'pay_123456',
        creativeApproved: true,
        creativeUrl: require('../assets/images/booking1.png'),
        proofOfDisplayUrl: require('../assets/images/booking2.png'),
        createdAt: '2024-03-01T10:00:00Z',
    },
    {
        id: '2',
        billboardId: '2',
        advertiserId: '2',
        startDate: '2024-03-20',
        endDate: '2024-03-27',
        totalAmount: 2450,
        status: 'pending',
        creativeApproved: false,
        createdAt: '2024-03-05T14:30:00Z',
    },
];

class BookingService {
    /**
     * Create a new booking
     */
    async createBooking(
        billboardId: string,
        advertiserId: string,
        startDate: string,
        endDate: string,
        totalAmount: number,
    ): Promise<ApiResponse<Booking>> {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const newBooking: Booking = {
                id: `${mockBookings.length + 1}`,
                billboardId,
                advertiserId,
                startDate,
                endDate,
                totalAmount,
                status: 'pending',
                creativeApproved: false,
                createdAt: new Date().toISOString(),
            };

            mockBookings.push(newBooking);

            return {
                success: true,
                data: newBooking,
                message: 'Booking created successfully',
            };
        } catch (error) {
            return {
                success: false,
                error: 'Failed to create booking',
            };
        }
    }

    /**
     * Get bookings for an advertiser
     */
    async getAdvertiserBookings(advertiserId: string): Promise<ApiResponse<Booking[]>> {
        try {
            await new Promise(resolve => setTimeout(resolve, 600));

            const bookings = mockBookings.filter(b => b.advertiserId === advertiserId);

            return {
                success: true,
                data: bookings,
            };
        } catch (error) {
            return {
                success: false,
                error: 'Failed to fetch bookings',
            };
        }
    }

    /**
     * Get bookings for a billboard (owner view)
     */
    async getBillboardBookings(billboardId: string): Promise<ApiResponse<Booking[]>> {
        try {
            await new Promise(resolve => setTimeout(resolve, 600));

            const bookings = mockBookings.filter(b => b.billboardId === billboardId);

            return {
                success: true,
                data: bookings,
            };
        } catch (error) {
            return {
                success: false,
                error: 'Failed to fetch bookings',
            };
        }
    }

    /**
     * Update booking status
     */
    async updateBookingStatus(
        bookingId: string,
        status: 'confirmed' | 'cancelled',
    ): Promise<ApiResponse<Booking>> {
        try {
            await new Promise(resolve => setTimeout(resolve, 800));

            const booking = mockBookings.find(b => b.id === bookingId);
            if (!booking) {
                return {
                    success: false,
                    error: 'Booking not found',
                };
            }

            booking.status = status;

            return {
                success: true,
                data: booking,
                message: `Booking ${status} successfully`,
            };
        } catch (error) {
            return {
                success: false,
                error: 'Failed to update booking',
            };
        }
    }

    /**
     * Upload creative for booking
     */
    async uploadCreative(bookingId: string, creativeUrl: string): Promise<ApiResponse<Booking>> {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const booking = mockBookings.find(b => b.id === bookingId);
            if (!booking) {
                return {
                    success: false,
                    error: 'Booking not found',
                };
            }

            booking.creativeUrl = creativeUrl;
            booking.creativeApproved = false;

            return {
                success: true,
                data: booking,
                message: 'Creative uploaded successfully',
            };
        } catch (error) {
            return {
                success: false,
                error: 'Failed to upload creative',
            };
        }
    }

    /**
     * Approve/reject creative
     */
    async approveCreative(bookingId: string, approved: boolean): Promise<ApiResponse<Booking>> {
        try {
            await new Promise(resolve => setTimeout(resolve, 600));

            const booking = mockBookings.find(b => b.id === bookingId);
            if (!booking) {
                return {
                    success: false,
                    error: 'Booking not found',
                };
            }

            booking.creativeApproved = approved;

            return {
                success: true,
                data: booking,
                message: approved ? 'Creative approved' : 'Creative rejected',
            };
        } catch (error) {
            return {
                success: false,
                error: 'Failed to update creative status',
            };
        }
    }

    /**
     * Upload proof of display
     */
    async uploadProof(bookingId: string, proofUrl: string): Promise<ApiResponse<Booking>> {
        try {
            await new Promise(resolve => setTimeout(resolve, 800));

            const booking = mockBookings.find(b => b.id === bookingId);
            if (!booking) {
                return {
                    success: false,
                    error: 'Booking not found',
                };
            }

            booking.proofOfDisplayUrl = proofUrl;
            booking.status = 'completed';

            return {
                success: true,
                data: booking,
                message: 'Proof uploaded successfully',
            };
        } catch (error) {
            return {
                success: false,
                error: 'Failed to upload proof',
            };
        }
    }
}

export default new BookingService();
