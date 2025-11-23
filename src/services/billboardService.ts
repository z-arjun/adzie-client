import { Billboard, BillboardFilter, ApiResponse } from '../types';

// Mock billboard data
// Helper to generate random coordinates around a center
function generateRandomLocation(centerLat: number, centerLng: number, radiusKm: number) {
    const y0 = centerLat;
    const x0 = centerLng;
    const rd = radiusKm / 111.3; // about 111.3km per degree

    const u = Math.random();
    const v = Math.random();

    const w = rd * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const x = w * Math.cos(t);
    const y = w * Math.sin(t);

    return {
        latitude: y + y0,
        longitude: x + x0,
    };
}

// Pune Center
const PUNE_LAT = 18.5204;
const PUNE_LNG = 73.8567;

// Mock billboard data generation
const generateMockBillboards = (): Billboard[] => {
    const billboards: Billboard[] = [];
    const areas = ['Koregaon Park', 'Baner', 'Viman Nagar', 'FC Road', 'Hinjewadi', 'Kalyani Nagar', 'Aundh', 'Magarpatta', 'Hadapsar', 'Kothrud'];
    const types: ('digital' | 'static')[] = ['digital', 'static'];
    const images = [
        require('../assets/images/billboard1.png'),
        require('../assets/images/billboard3.png'),
        require('../assets/images/billboard4.png'),
        require('../assets/images/billboard5.png'),
        require('../assets/images/billboard6.png'),
        require('../assets/images/billboard7.png'),
        require('../assets/images/billboard8.png'),
        require('../assets/images/billboard9.png'),
        require('../assets/images/billboard10.png'),
        require('../assets/images/billboard11.png'),
        require('../assets/images/billboard12.png'),
    ];

    // Generate 200 billboards
    for (let i = 0; i < 60; i++) {
        const area = areas[Math.floor(Math.random() * areas.length)];
        const location = generateRandomLocation(PUNE_LAT, PUNE_LNG, 15); // 15km radius
        const type = types[Math.floor(Math.random() * types.length)];
        const isDigital = type === 'digital';

        billboards.push({
            id: `${i + 1}`,
            ownerId: Math.random() > 0.5 ? '1' : '2',
            title: `${isDigital ? 'Digital' : 'Static'} Hoarding at ${area}`,
            description: `High visibility ${type} billboard in ${area}. Great for brand awareness.`,
            location: {
                latitude: location.latitude,
                longitude: location.longitude,
                address: `${Math.floor(Math.random() * 100) + 1} Main Road, ${area}`,
                city: 'Pune',
                state: 'Maharashtra',
                zipCode: '411001',
            },
            type: type,
            dimensions: {
                width: isDigital ? 40 : 20,
                height: isDigital ? 20 : 10,
                unit: 'ft',
            },
            pricePerDay: isDigital ? 15000 + Math.floor(Math.random() * 10000) : 5000 + Math.floor(Math.random() * 5000),
            minBookingDays: isDigital ? 1 : 7,
            lighting: Math.random() > 0.3 ? 'both' : 'daylight',
            images: [images[Math.floor(Math.random() * images.length)]],
            status: 'active',
            viewsCount: Math.floor(Math.random() * 1000),
            rating: 3.5 + Math.random() * 1.5,
            reviewCount: Math.floor(Math.random() * 50),
            availableDates: generateAvailableDates(),
            createdAt: new Date().toISOString(),
            features: isDigital ? ['LED', 'High Res'] : ['Street View'],
            estimatedDailyImpressions: Math.floor(5000 + Math.random() * 45000), // 5k to 50k
        });
    }
    return billboards;
};

const mockBillboards: Billboard[] = generateMockBillboards();

// Helper function to generate available dates (next 60 days except some random dates)
function generateAvailableDates(): string[] {
    const dates: string[] = [];
    const today = new Date();

    for (let i = 1; i <= 60; i++) {
        // Skip some random dates to simulate bookings
        if (i % 7 === 0 || i % 11 === 0) continue;

        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date.toISOString().split('T')[0]);
    }

    return dates;
}

class BillboardService {
    /**
     * Get all billboards with optional filters
     */
    async getBillboards(filter?: BillboardFilter): Promise<ApiResponse<Billboard[]>> {
        try {
            await new Promise(resolve => setTimeout(resolve, 800));

            let filtered = [...mockBillboards];

            // Apply filters
            if (filter) {
                if (filter.searchQuery) {
                    const query = filter.searchQuery.toLowerCase();
                    filtered = filtered.filter(
                        b => b.title.toLowerCase().includes(query) ||
                            b.location.city.toLowerCase().includes(query) ||
                            b.location.state.toLowerCase().includes(query) ||
                            b.location.address.toLowerCase().includes(query)
                    );
                }

                if (filter.location) {
                    const { latitude, longitude, radius } = filter.location;
                    filtered = filtered.filter(b => {
                        // Simple distance calculation (Haversine formula approximation)
                        const R = 6371; // Radius of the earth in km
                        const dLat = (b.location.latitude - latitude) * (Math.PI / 180);
                        const dLon = (b.location.longitude - longitude) * (Math.PI / 180);
                        const a =
                            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                            Math.cos(latitude * (Math.PI / 180)) * Math.cos(b.location.latitude * (Math.PI / 180)) *
                            Math.sin(dLon / 2) * Math.sin(dLon / 2);
                        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                        const distance = R * c; // Distance in km
                        return distance <= radius;
                    });
                }

                if (filter.city) {
                    filtered = filtered.filter(b => b.location.city.toLowerCase() === filter.city!.toLowerCase());
                }

                if (filter.state) {
                    filtered = filtered.filter(b => b.location.state.toLowerCase() === filter.state!.toLowerCase());
                }

                if (filter.priceRange) {
                    filtered = filtered.filter(
                        b => b.pricePerDay >= filter.priceRange!.min &&
                            b.pricePerDay <= filter.priceRange!.max
                    );
                }

                if (filter.lighting) {
                    filtered = filtered.filter(b => b.lighting === filter.lighting || b.lighting === 'both');
                }

                if (filter.minWidth) {
                    filtered = filtered.filter(b => b.dimensions.width >= filter.minWidth!);
                }

                if (filter.minHeight) {
                    filtered = filtered.filter(b => b.dimensions.height >= filter.minHeight!);
                }

                if (filter.area) {
                    const areaQuery = filter.area.toLowerCase();
                    filtered = filtered.filter(
                        b => b.location.address.toLowerCase().includes(areaQuery) ||
                            b.title.toLowerCase().includes(areaQuery)
                    );
                }

                // Sort
                if (filter.sortBy === 'price') {
                    filtered.sort((a, b) => a.pricePerDay - b.pricePerDay);
                } else if (filter.sortBy === 'rating') {
                    filtered.sort((a, b) => b.rating - a.rating);
                }
            }

            return {
                success: true,
                data: filtered,
            };
        } catch (error) {
            return {
                success: false,
                error: 'Failed to fetch billboards',
            };
        }
    }

    /**
     * Get billboard by ID
     */
    async getBillboardById(id: string): Promise<ApiResponse<Billboard>> {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            // Ensure we compare as strings to avoid type mismatches
            const billboard = mockBillboards.find(b => String(b.id) === String(id));

            if (!billboard) {
                return {
                    success: false,
                    error: 'Billboard not found',
                };
            }

            // Create a copy to avoid mutating read-only properties (if frozen by Redux)
            const updatedBillboard = { ...billboard, viewsCount: billboard.viewsCount + 1 };

            return {
                success: true,
                data: updatedBillboard,
            };
        } catch (error: any) {
            return {
                success: false,
                error: `Failed to fetch billboard: ${error?.message || error}`,
            };
        }
    }

    /**
     * Get billboards by owner ID
     */
    async getOwnerBillboards(ownerId: string): Promise<ApiResponse<Billboard[]>> {
        try {
            await new Promise(resolve => setTimeout(resolve, 600));

            const billboards = mockBillboards.filter(b => b.ownerId === ownerId);

            return {
                success: true,
                data: billboards,
            };
        } catch (error) {
            return {
                success: false,
                error: 'Failed to fetch owner billboards',
            };
        }
    }

    /**
     * Create new billboard
     */
    async createBillboard(billboard: Omit<Billboard, 'id' | 'createdAt' | 'viewsCount' | 'rating' | 'reviewCount'>): Promise<ApiResponse<Billboard>> {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const newBillboard: Billboard = {
                ...billboard,
                id: `${mockBillboards.length + 1}`,
                viewsCount: 0,
                rating: 0,
                reviewCount: 0,
                createdAt: new Date().toISOString(),
            };

            mockBillboards.push(newBillboard);

            return {
                success: true,
                data: newBillboard,
                message: 'Billboard created successfully',
            };
        } catch (error) {
            return {
                success: false,
                error: 'Failed to create billboard',
            };
        }
    }

    /**
     * Update billboard
     */
    async updateBillboard(id: string, updates: Partial<Billboard>): Promise<ApiResponse<Billboard>> {
        try {
            await new Promise(resolve => setTimeout(resolve, 800));

            const index = mockBillboards.findIndex(b => b.id === id);
            if (index === -1) {
                return {
                    success: false,
                    error: 'Billboard not found',
                };
            }

            mockBillboards[index] = { ...mockBillboards[index], ...updates };

            return {
                success: true,
                data: mockBillboards[index],
                message: 'Billboard updated successfully',
            };
        } catch (error) {
            return {
                success: false,
                error: 'Failed to update billboard',
            };
        }
    }

    /**
     * Delete billboard
     */
    async deleteBillboard(id: string): Promise<ApiResponse<void>> {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const index = mockBillboards.findIndex(b => b.id === id);
            if (index === -1) {
                return {
                    success: false,
                    error: 'Billboard not found',
                };
            }

            mockBillboards.splice(index, 1);

            return {
                success: true,
                message: 'Billboard deleted successfully',
            };
        } catch (error) {
            return {
                success: false,
                error: 'Failed to delete billboard',
            };
        }
    }
}

export default new BillboardService();
