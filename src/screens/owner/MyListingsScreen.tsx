import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    RefreshControl,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchOwnerBillboards } from '../../store/slices/billboardSlice';
import { Billboard } from '../../types';
import { lightTheme } from '../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MyListingsScreen = ({ navigation }: any) => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const { ownerBillboards, loading } = useAppSelector(state => state.billboard);
    const [refreshing, setRefreshing] = useState(false);

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

    const renderListing = ({ item }: { item: Billboard }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('AddListing')}>
            <Image
                source={typeof item.images[0] === 'string' ? { uri: item.images[0] } : item.images[0]}
                style={styles.image}
            />
            <View style={styles.imageOverlay}>
                <View style={[styles.statusBadge, item.status === 'active' && styles.statusBadgeActive]}>
                    <Text style={[styles.statusText, item.status === 'active' && styles.statusTextActive]}>
                        {item.status.toUpperCase()}
                    </Text>
                </View>
            </View>

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                    <View style={styles.ratingBadge}>
                        <MaterialCommunityIcons name="star" size={12} color="#FFD700" />
                        <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                    </View>
                </View>

                <Text style={styles.location} numberOfLines={1}>
                    <MaterialCommunityIcons name="map-marker" size={12} color="#666" />
                    {' '}{item.location.city}, {item.location.state}
                </Text>

                <View style={styles.metrics}>
                    <View style={styles.metricItem}>
                        <MaterialCommunityIcons name="eye-outline" size={14} color="#666" />
                        <Text style={styles.metricText}>{item.viewsCount} views</Text>
                    </View>
                    <View style={styles.metricItem}>
                        <MaterialCommunityIcons name="chart-line" size={14} color="#666" />
                        <Text style={styles.metricText}>{(item.estimatedDailyImpressions / 1000).toFixed(1)}K</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <View>
                        <Text style={styles.price}>₹{item.pricePerDay.toLocaleString()}</Text>
                        <Text style={styles.perDay}>per day</Text>
                    </View>
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.actionButton}>
                            <MaterialCommunityIcons name="pencil" size={18} color={lightTheme.colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <MaterialCommunityIcons name="share-variant" size={18} color="#666" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading && ownerBillboards.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={lightTheme.colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <FlatList
                    data={ownerBillboards}
                    renderItem={renderListing}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <MaterialCommunityIcons name="billboard" size={80} color="#E0E0E0" />
                            <Text style={styles.emptyText}>No listings yet</Text>
                            <Text style={styles.emptySubtext}>
                                Create your first billboard listing to start earning
                            </Text>
                        </View>
                    }
                />

                {/* Floating Action Button */}
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => navigation.navigate('AddListing')}
                    activeOpacity={0.8}>
                    <MaterialCommunityIcons name="plus" size={28} color="#fff" />
                </TouchableOpacity>
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
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
    },
    list: {
        padding: 20,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 200,
        backgroundColor: '#F0F2F5',
    },
    imageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.9)',
    },
    statusBadgeActive: {
        backgroundColor: 'rgba(76, 175, 80, 0.9)',
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#666',
        letterSpacing: 0.5,
    },
    statusTextActive: {
        color: '#fff',
    },
    content: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        marginRight: 8,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF9E6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    ratingText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#FFB800',
    },
    location: {
        fontSize: 13,
        color: '#666',
        marginBottom: 12,
        lineHeight: 18,
    },
    metrics: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    metricItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F2F5',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 6,
    },
    metricText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F2F5',
    },
    price: {
        fontSize: 20,
        fontWeight: '700',
        color: lightTheme.colors.primary,
        lineHeight: 24,
    },
    perDay: {
        fontSize: 12,
        color: '#999',
        fontWeight: '400',
        marginTop: 2,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F0F2F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: lightTheme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 20,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: '600',
        color: lightTheme.colors.textSecondary,
        marginTop: 20,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: lightTheme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default MyListingsScreen;

