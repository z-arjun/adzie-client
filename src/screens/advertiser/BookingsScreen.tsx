import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { lightTheme } from '../../theme';

interface Booking {
    id: string;
    billboardTitle: string;
    billboardImage: string | number;
    location: string;
    startDate: string;
    endDate: string;
    totalAmount: number;
    status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
}

const BookingsScreen = ({ navigation }: any) => {
    const [selectedTab, setSelectedTab] = useState<'active' | 'past'>('active');

    // Mock data
    const mockBookings: Booking[] = [
        {
            id: '1',
            billboardTitle: 'Digital Hoarding at Baner',
            billboardImage: require('../../assets/images/booking1.png'),
            location: 'Baner, Pune',
            startDate: '2024-01-15',
            endDate: '2024-01-30',
            totalAmount: 225000,
            status: 'active',
        },
        {
            id: '2',
            billboardTitle: 'Static Billboard at Koregaon Park',
            billboardImage: require('../../assets/images/booking2.png'),
            location: 'Koregaon Park, Pune',
            startDate: '2024-02-01',
            endDate: '2024-02-14',
            totalAmount: 98000,
            status: 'confirmed',
        },
        {
            id: '3',
            billboardTitle: 'Digital Display at Hinjewadi',
            billboardImage: require('../../assets/images/booking3.png'),
            location: 'Hinjewadi, Pune',
            startDate: '2023-12-01',
            endDate: '2023-12-31',
            totalAmount: 450000,
            status: 'completed',
        },
    ];

    const activeBookings = mockBookings.filter(b => ['active', 'confirmed', 'pending'].includes(b.status));
    const pastBookings = mockBookings.filter(b => ['completed', 'cancelled'].includes(b.status));

    const displayedBookings = selectedTab === 'active' ? activeBookings : pastBookings;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return '#10B981';
            case 'confirmed': return '#3B82F6';
            case 'pending': return '#F59E0B';
            case 'completed': return '#6B7280';
            case 'cancelled': return '#EF4444';
            default: return '#6B7280';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active': return 'play-circle';
            case 'confirmed': return 'check-circle';
            case 'pending': return 'clock-outline';
            case 'completed': return 'check-all';
            case 'cancelled': return 'close-circle';
            default: return 'information';
        }
    };

    const renderBookingCard = ({ item }: { item: Booking }) => (
        <TouchableOpacity
            style={styles.bookingCard}
            onPress={() => navigation.navigate('BookingDetail', { bookingId: item.id })}>
            <Image source={typeof item.billboardImage === 'string' ? { uri: item.billboardImage } : item.billboardImage} style={styles.bookingImage} />
            <View style={styles.bookingContent}>
                <View style={styles.bookingHeader}>
                    <Text style={styles.bookingTitle} numberOfLines={1}>{item.billboardTitle}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                        <MaterialCommunityIcons
                            name={getStatusIcon(item.status) as any}
                            size={14}
                            color={getStatusColor(item.status)}
                        />
                        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                            {item.status.toUpperCase()}
                        </Text>
                    </View>
                </View>

                <Text style={styles.location}>📍 {item.location}</Text>

                <View style={styles.dateRow}>
                    <View style={styles.dateItem}>
                        <MaterialCommunityIcons name="calendar-start" size={16} color="#666" />
                        <Text style={styles.dateText}>{new Date(item.startDate).toLocaleDateString()}</Text>
                    </View>
                    <MaterialCommunityIcons name="arrow-right" size={16} color="#999" />
                    <View style={styles.dateItem}>
                        <MaterialCommunityIcons name="calendar-end" size={16} color="#666" />
                        <Text style={styles.dateText}>{new Date(item.endDate).toLocaleDateString()}</Text>
                    </View>
                </View>

                <View style={styles.bookingFooter}>
                    <Text style={styles.amount}>₹{item.totalAmount.toLocaleString()}</Text>
                    <TouchableOpacity style={styles.detailsButton}>
                        <Text style={styles.detailsButtonText}>View Details</Text>
                        <MaterialCommunityIcons name="chevron-right" size={18} color={lightTheme.colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>My Bookings</Text>
                    <TouchableOpacity style={styles.filterButton}>
                        <MaterialCommunityIcons name="filter-variant" size={24} color="#1A1A1A" />
                    </TouchableOpacity>
                </View>

                {/* Stats Cards */}
                <View style={styles.statsWrapper}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.statsContainer}>
                        <View style={styles.statCard}>
                            <View style={[styles.statIconContainer, { backgroundColor: '#10B98120' }]}>
                                <MaterialCommunityIcons name="play-circle" size={24} color="#10B981" />
                            </View>
                            <Text style={styles.statValue}>{activeBookings.length}</Text>
                            <Text style={styles.statLabel}>Active</Text>
                        </View>
                        <View style={styles.statCard}>
                            <View style={[styles.statIconContainer, { backgroundColor: '#3B82F620' }]}>
                                <MaterialCommunityIcons name="check-circle" size={24} color="#3B82F6" />
                            </View>
                            <Text style={styles.statValue}>{mockBookings.filter(b => b.status === 'confirmed').length}</Text>
                            <Text style={styles.statLabel}>Confirmed</Text>
                        </View>
                        <View style={styles.statCard}>
                            <View style={[styles.statIconContainer, { backgroundColor: '#6B728020' }]}>
                                <MaterialCommunityIcons name="check-all" size={24} color="#6B7280" />
                            </View>
                            <Text style={styles.statValue}>{pastBookings.length}</Text>
                            <Text style={styles.statLabel}>Completed</Text>
                        </View>
                    </ScrollView>
                </View>

                {/* Tabs */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, selectedTab === 'active' && styles.tabActive]}
                        onPress={() => setSelectedTab('active')}>
                        <Text style={[styles.tabText, selectedTab === 'active' && styles.tabTextActive]}>
                            Active ({activeBookings.length})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, selectedTab === 'past' && styles.tabActive]}
                        onPress={() => setSelectedTab('past')}>
                        <Text style={[styles.tabText, selectedTab === 'past' && styles.tabTextActive]}>
                            Past ({pastBookings.length})
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Bookings List */}
                <FlatList
                    data={displayedBookings}
                    renderItem={renderBookingCard}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <MaterialCommunityIcons name="calendar-blank" size={64} color="#E0E0E0" />
                            <Text style={styles.emptyText}>No {selectedTab} bookings</Text>
                            <Text style={styles.emptySubtext}>Your bookings will appear here</Text>
                        </View>
                    }
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 15,
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    filterButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F0F2F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsWrapper: {
        backgroundColor: '#fff',
        paddingBottom: 15,
    },
    statsContainer: {
        paddingHorizontal: 20,
    },
    statCard: {
        width: 110,
        padding: 15,
        backgroundColor: '#F8F9FA',
        borderRadius: 16,
        marginRight: 12,
        alignItems: 'center',
    },
    statIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 10,
        gap: 10,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    tabActive: {
        backgroundColor: lightTheme.colors.primary,
    },
    tabText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#666',
    },
    tabTextActive: {
        color: '#fff',
    },
    listContent: {
        padding: 20,
        paddingTop: 10,
    },
    bookingCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 15,
        overflow: 'hidden',
        ...lightTheme.shadows.small,
    },
    bookingImage: {
        width: '100%',
        height: 140,
        backgroundColor: '#F0F2F5',
    },
    bookingContent: {
        padding: 15,
    },
    bookingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    bookingTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        marginRight: 10,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
    },
    location: {
        fontSize: 13,
        color: '#666',
        marginBottom: 12,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        gap: 8,
    },
    dateItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dateText: {
        fontSize: 13,
        color: '#666',
    },
    bookingFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F2F5',
    },
    amount: {
        fontSize: 18,
        fontWeight: '700',
        color: lightTheme.colors.primary,
    },
    detailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    detailsButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: lightTheme.colors.primary,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
    },
});

export default BookingsScreen;
