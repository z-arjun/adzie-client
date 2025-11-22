import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    Image,
    ScrollView,
    RefreshControl,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchOwnerBillboards } from '../../store/slices/billboardSlice';
import { lightTheme } from '../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Billboard } from '../../types';

const OwnerDashboardScreen = ({ navigation }: any) => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const { ownerBillboards, loading } = useAppSelector(state => state.billboard);
    const [refreshing, setRefreshing] = React.useState(false);

    useEffect(() => {
        if (user) {
            dispatch(fetchOwnerBillboards(user.id));
        }
    }, [dispatch, user]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        if (user) {
            dispatch(fetchOwnerBillboards(user.id)).finally(() => setRefreshing(false));
        }
    }, [dispatch, user]);

    // Calculate statistics
    const totalViews = ownerBillboards.reduce((sum, b) => sum + b.viewsCount, 0);
    const totalListings = ownerBillboards.length;
    const activeListings = ownerBillboards.filter(b => b.status === 'active').length;
    const totalImpressions = ownerBillboards.reduce((sum, b) => sum + b.estimatedDailyImpressions, 0);

    // Quick actions data
    const quickActions = [
        { id: '1', icon: 'plus-circle', title: 'Add Billboard', color: '#6200EE', screen: 'AddListing' },
        { id: '2', icon: 'clipboard-list', title: 'My Listings', color: '#03DAC6', screen: 'MyListings' },
        { id: '3', icon: 'chart-line', title: 'Analytics', color: '#FF9800', screen: null },
        { id: '4', icon: 'cog', title: 'Settings', color: '#2196F3', screen: null },
    ];

    const renderQuickAction = ({ item }: any) => (
        <TouchableOpacity
            style={[styles.quickActionCard, { backgroundColor: item.color + '15' }]}
            onPress={() => item.screen && navigation.navigate(item.screen)}
            activeOpacity={0.7}>
            <View style={[styles.quickActionIcon, { backgroundColor: item.color }]}>
                <MaterialCommunityIcons name={item.icon} size={24} color="#fff" />
            </View>
            <Text style={styles.quickActionTitle}>{item.title}</Text>
        </TouchableOpacity>
    );

    const renderRecentListing = ({ item }: { item: Billboard }) => (
        <TouchableOpacity
            style={styles.recentListingCard}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('MyListings')}>
            <Image
                source={typeof item.images[0] === 'string' ? { uri: item.images[0] } : item.images[0]}
                style={styles.recentListingImage}
            />
            <View style={styles.recentListingContent}>
                <View style={styles.recentListingLeft}>
                    <Text style={styles.recentListingTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.recentListingLocation} numberOfLines={1}>
                        <MaterialCommunityIcons name="map-marker" size={12} color="#666" />
                        {' '}{item.location.city}, {item.location.state}
                    </Text>
                    <View style={styles.recentListingStats}>
                        <View style={styles.statBadge}>
                            <MaterialCommunityIcons name="eye-outline" size={12} color="#666" />
                            <Text style={styles.statBadgeText}>{item.viewsCount}</Text>
                        </View>
                        <View style={styles.statBadge}>
                            <MaterialCommunityIcons name="star" size={12} color="#FFD700" />
                            <Text style={styles.statBadgeText}>{item.rating.toFixed(1)}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.recentListingRight}>
                    <Text style={styles.recentListingPrice} numberOfLines={1}>₹{item.pricePerDay.toLocaleString()}</Text>
                    <Text style={styles.recentListingPerDay}>per day</Text>
                    <View style={[styles.statusBadge, item.status === 'active' && styles.statusBadgeActive]}>
                        <Text style={[styles.statusBadgeText, item.status === 'active' && styles.statusBadgeTextActive]}>
                            {item.status.toUpperCase()}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.welcomeText}>Welcome back,</Text>
                        <Text style={styles.userName}>{user?.fullName || 'Owner'}</Text>
                    </View>
                    <TouchableOpacity style={styles.profileButton}>
                        <Image
                            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                            style={styles.profileImage}
                        />
                    </TouchableOpacity>
                </View>

                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <View style={[styles.statIcon, { backgroundColor: '#6200EE15' }]}>
                            <MaterialCommunityIcons name="billboard" size={24} color="#6200EE" />
                        </View>
                        <Text style={styles.statValue}>{totalListings}</Text>
                        <Text style={styles.statLabel}>Total Listings</Text>
                    </View>
                    <View style={styles.statCard}>
                        <View style={[styles.statIcon, { backgroundColor: '#4CAF5015' }]}>
                            <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" />
                        </View>
                        <Text style={styles.statValue}>{activeListings}</Text>
                        <Text style={styles.statLabel}>Active</Text>
                    </View>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <View style={[styles.statIcon, { backgroundColor: '#FF980015' }]}>
                            <MaterialCommunityIcons name="eye" size={24} color="#FF9800" />
                        </View>
                        <Text style={styles.statValue}>{(totalViews / 1000).toFixed(1)}K</Text>
                        <Text style={styles.statLabel}>Total Views</Text>
                    </View>
                    <View style={styles.statCard}>
                        <View style={[styles.statIcon, { backgroundColor: '#2196F315' }]}>
                            <MaterialCommunityIcons name="chart-line" size={24} color="#2196F3" />
                        </View>
                        <Text style={styles.statValue}>{(totalImpressions / 1000).toFixed(1)}K</Text>
                        <Text style={styles.statLabel}>Impressions</Text>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                </View>
                <FlatList
                    data={quickActions}
                    renderItem={renderQuickAction}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    scrollEnabled={false}
                    contentContainerStyle={styles.quickActionsList}
                />

                {/* Recent Listings */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Recent Listings</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('MyListings')}>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>

                {loading && ownerBillboards.length === 0 ? (
                    <ActivityIndicator size="large" color={lightTheme.colors.primary} style={{ marginTop: 20 }} />
                ) : ownerBillboards.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="billboard" size={64} color="#E0E0E0" />
                        <Text style={styles.emptyText}>No listings yet</Text>
                        <Text style={styles.emptySubtext}>Create your first billboard to get started!</Text>
                        <TouchableOpacity
                            style={styles.emptyButton}
                            onPress={() => navigation.navigate('AddListing')}>
                            <Text style={styles.emptyButtonText}>Add Billboard</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={ownerBillboards.slice(0, 3)}
                        renderItem={renderRecentListing}
                        keyExtractor={item => item.id}
                        scrollEnabled={false}
                        contentContainerStyle={styles.recentListingsList}
                    />
                )}
            </ScrollView>
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
        paddingTop: 15,
        paddingBottom: 20,
        backgroundColor: '#fff',
    },
    welcomeText: {
        fontSize: 14,
        color: lightTheme.colors.textSecondary,
        marginBottom: 4,
    },
    userName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    profileButton: {
        padding: 2,
        borderWidth: 2,
        borderColor: lightTheme.colors.primary,
        borderRadius: 20,
    },
    profileImage: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 15,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    statIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: lightTheme.colors.textSecondary,
        textAlign: 'center',
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    seeAll: {
        fontSize: 14,
        color: lightTheme.colors.primary,
        fontWeight: '600',
    },
    quickActionsList: {
        paddingHorizontal: 14,
        marginBottom: 10,
    },
    quickActionCard: {
        flex: 1,
        margin: 6,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    quickActionIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    quickActionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1A1A1A',
        textAlign: 'center',
    },
    recentListingsList: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    recentListingCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    recentListingImage: {
        width: 100,
        height: 100,
        borderRadius: 12,
        backgroundColor: '#F0F2F5',
    },
    recentListingContent: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    recentListingLeft: {
        flex: 1,
        marginRight: 12,
    },
    recentListingTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    recentListingLocation: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
    },
    recentListingStats: {
        flexDirection: 'row',
        gap: 8,
    },
    statBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F2F5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    statBadgeText: {
        fontSize: 11,
        color: '#666',
        fontWeight: '600',
    },
    recentListingRight: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    recentListingPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: lightTheme.colors.primary,
    },
    recentListingPerDay: {
        fontSize: 10,
        color: '#999',
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: '#E0E0E0',
        marginTop: 6,
    },
    statusBadgeActive: {
        backgroundColor: '#C8E6C9',
    },
    statusBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#666',
    },
    statusBadgeTextActive: {
        color: '#2E7D32',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: lightTheme.colors.textSecondary,
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: lightTheme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: 20,
    },
    emptyButton: {
        backgroundColor: lightTheme.colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    emptyButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
});

export default OwnerDashboardScreen;
