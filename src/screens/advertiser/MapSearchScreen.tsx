import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    TextInput,
    SafeAreaView,
} from 'react-native';
import MapView, { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchBillboards } from '../../store/slices/billboardSlice';
import { Billboard } from '../../types';
import { lightTheme } from '../../theme';

const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = 300;
const CARD_WIDTH = width * 0.82;

const MapSearchScreen = ({ navigation }: any) => {
    const dispatch = useAppDispatch();
    const { billboards, loading } = useAppSelector(state => state.billboard);
    const mapRef = useRef<MapView>(null);
    const flatListRef = useRef<FlatList>(null);

    // Default region (Pune, India)
    const [region, setRegion] = useState<Region>({
        latitude: 18.5204,
        longitude: 73.8567,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const [selectedBillboardId, setSelectedBillboardId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('All');

    const filters = ['All', 'Digital', 'Static', 'Premium', 'Budget'];

    useEffect(() => {
        dispatch(fetchBillboards());
    }, [dispatch]);

    const handleMarkerPress = (billboard: Billboard) => {
        setSelectedBillboardId(billboard.id);
        const index = billboards.findIndex(b => b.id === billboard.id);
        if (index !== -1 && flatListRef.current) {
            flatListRef.current.scrollToIndex({ index, animated: true });
        }

        // Animate map to marker
        mapRef.current?.animateToRegion({
            latitude: billboard.location.latitude,
            longitude: billboard.location.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
        }, 500);
    };

    const handleSearchArea = () => {
        const radius = (region.latitudeDelta * 111) / 2;
        dispatch(fetchBillboards({
            location: {
                latitude: region.latitude,
                longitude: region.longitude,
                radius: Math.max(radius, 1),
            }
        }));
    };

    const handleMyLocation = () => {
        // In a real app, you'd use location services
        mapRef.current?.animateToRegion({
            latitude: 18.5204,
            longitude: 73.8567,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
        }, 1000);
    };

    const renderBillboardItem = ({ item }: { item: Billboard }) => (
        <TouchableOpacity
            style={[
                styles.card,
                selectedBillboardId === item.id && styles.cardSelected
            ]}
            activeOpacity={0.9}
            onPress={() => {
                setSelectedBillboardId(item.id);
                handleMarkerPress(item);
            }}
        >
            <Image source={typeof item.images[0] === 'string' ? { uri: item.images[0] } : item.images[0]} style={styles.cardImage} />
            <View style={styles.cardOverlay}>
                <View style={styles.cardBadge}>
                    <Text style={styles.cardBadgeText}>{item.type.toUpperCase()}</Text>
                </View>
            </View>
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                    <View style={styles.ratingBadge}>
                        <MaterialCommunityIcons name="star" size={14} color="#FFD700" />
                        <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                    </View>
                </View>
                <View style={styles.locationRow}>
                    <MaterialCommunityIcons name="map-marker" size={14} color="#666" />
                    <Text style={styles.cardLocation} numberOfLines={1}>
                        {item.location.address}
                    </Text>
                </View>

                {/* Insights Row */}
                <View style={styles.insightsRow}>
                    <View style={styles.insightItem}>
                        <MaterialCommunityIcons name="eye-outline" size={16} color={lightTheme.colors.primary} />
                        <Text style={styles.insightValue}>2.5K</Text>
                        <Text style={styles.insightLabel}>daily views</Text>
                    </View>
                    <View style={styles.insightDivider} />
                    <View style={styles.insightItem}>
                        <MaterialCommunityIcons name="calendar-check" size={16} color="#10B981" />
                        <Text style={styles.insightValue}>Available</Text>
                        <Text style={styles.insightLabel}>from {new Date(Date.now() + 86400000 * 3).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
                    </View>
                    <View style={styles.insightDivider} />
                    <View style={styles.insightItem}>
                        <MaterialCommunityIcons name="ruler" size={16} color="#F59E0B" />
                        <Text style={styles.insightValue}>{item.dimensions.width}×{item.dimensions.height}</Text>
                        <Text style={styles.insightLabel}>ft</Text>
                    </View>
                </View>

                <View style={styles.cardFooter}>
                    <View>
                        <Text style={styles.cardPrice}>₹{item.pricePerDay.toLocaleString()}</Text>
                        <Text style={styles.perDay}>per day</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.viewButton}
                        onPress={() => navigation.navigate('BillboardDetail', { billboardId: item.id })}
                    >
                        <Text style={styles.viewButtonText}>View</Text>
                        <MaterialCommunityIcons name="arrow-right" size={16} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    const CustomMarker = ({ billboard, isSelected }: { billboard: Billboard; isSelected: boolean }) => (
        <View style={[styles.markerContainer, isSelected && styles.markerSelected]}>
            <View style={styles.markerContent}>
                <Text style={styles.markerPrice}>₹{(billboard.pricePerDay / 1000).toFixed(0)}K</Text>
            </View>
            <View style={styles.markerArrow} />
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Map Section */}
                <View style={styles.mapContainer}>
                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        initialRegion={region}
                        onRegionChangeComplete={setRegion}
                        provider={PROVIDER_GOOGLE}
                        showsUserLocation
                        showsMyLocationButton={false}
                    >
                        {billboards.map(billboard => (
                            <Marker
                                key={billboard.id}
                                coordinate={{
                                    latitude: billboard.location.latitude,
                                    longitude: billboard.location.longitude,
                                }}
                                onPress={() => handleMarkerPress(billboard)}
                            >
                                <CustomMarker
                                    billboard={billboard}
                                    isSelected={selectedBillboardId === billboard.id}
                                />
                            </Marker>
                        ))}
                    </MapView>

                    {/* Floating Back Button - Top Left */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#1A1A1A" />
                    </TouchableOpacity>

                    {/* Filter Chips */}
                    <View style={styles.filterChipsContainer}>
                        <FlatList
                            data={filters}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item}
                            contentContainerStyle={styles.filterChipsList}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.filterChip,
                                        selectedFilter === item && styles.filterChipActive
                                    ]}
                                    onPress={() => setSelectedFilter(item)}
                                >
                                    <Text style={[
                                        styles.filterChipText,
                                        selectedFilter === item && styles.filterChipTextActive
                                    ]}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>

                    {/* Search Area Button - Top Center */}
                    <TouchableOpacity
                        style={styles.searchAreaButton}
                        onPress={handleSearchArea}
                    >
                        <MaterialCommunityIcons name="refresh" size={18} color={lightTheme.colors.primary} />
                        <Text style={styles.searchAreaText}>Search this area</Text>
                    </TouchableOpacity>

                    {/* GPS Button - Bottom Right */}
                    <TouchableOpacity
                        style={styles.gpsButton}
                        onPress={handleMyLocation}
                    >
                        <MaterialCommunityIcons name="crosshairs-gps" size={24} color={lightTheme.colors.primary} />
                    </TouchableOpacity>

                    {/* Results Count Badge */}
                    <View style={styles.resultsBadge}>
                        <MaterialCommunityIcons name="billboard" size={16} color="#fff" />
                        <Text style={styles.resultsText}>{billboards.length} billboards</Text>
                    </View>
                </View>

                {/* List Section */}
                <View style={styles.listContainer}>
                    <View style={styles.listHeader}>
                        <View style={styles.dragHandle} />
                        <Text style={styles.listTitle}>Available Billboards</Text>
                    </View>

                    {loading ? (
                        <View style={styles.centerContainer}>
                            <ActivityIndicator size="large" color={lightTheme.colors.primary} />
                        </View>
                    ) : billboards.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <MaterialCommunityIcons name="map-marker-off" size={64} color="#DDD" />
                            <Text style={styles.emptyText}>No billboards found</Text>
                            <Text style={styles.emptySubtext}>Try adjusting your search area</Text>
                        </View>
                    ) : (
                        <FlatList
                            ref={flatListRef}
                            data={billboards}
                            renderItem={renderBillboardItem}
                            keyExtractor={item => item.id}
                            contentContainerStyle={styles.listContent}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            snapToInterval={CARD_WIDTH + 15}
                            decelerationRate="fast"
                            pagingEnabled={false}
                        />
                    )}
                </View>
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
    mapContainer: {
        // flex: 1,
        height: height * 0.45,
        position: 'relative',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    backButton: {
        position: 'absolute',
        top: 15,
        left: 20,
        width: 44,
        height: 44,
        backgroundColor: '#fff',
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        ...lightTheme.shadows.medium,
        zIndex: 10,
    },
    filterChipsContainer: {
        position: 'absolute',
        top: 15,
        left: 75,
        right: 0,
        zIndex: 9,
    },
    filterChipsList: {
        paddingHorizontal: 0,
        gap: 10,
    },
    filterChip: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 22,
        marginRight: 10,
        ...lightTheme.shadows.medium,
    },
    filterChipActive: {
        backgroundColor: lightTheme.colors.primary,
        ...lightTheme.shadows.large,
    },
    filterChipText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    filterChipTextActive: {
        color: '#fff',
    },
    actionButton: {
        width: 48,
        height: 48,
        backgroundColor: '#fff',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        ...lightTheme.shadows.medium,
    },
    searchAreaButton: {
        position: 'absolute',
        top: 75,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 22,
        paddingVertical: 12,
        borderRadius: 25,
        gap: 8,
        ...lightTheme.shadows.large,
        zIndex: 8,
    },
    searchAreaText: {
        color: '#1A1A1A',
        fontSize: 14,
        fontWeight: '700',
    },
    gpsButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 48,
        height: 48,
        backgroundColor: '#fff',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        ...lightTheme.shadows.medium,
        zIndex: 8,
    },
    resultsBadge: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.75)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        gap: 6,
        zIndex: 8,
    },
    resultsText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    markerContainer: {
        alignItems: 'center',
    },
    markerContent: {
        backgroundColor: lightTheme.colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    markerSelected: {
        transform: [{ scale: 1.2 }],
    },
    markerPrice: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    markerArrow: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderTopWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: lightTheme.colors.primary,
        marginTop: -2,
    },
    listContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 16,
        // paddingBottom: 20,
        // ...lightTheme.shadows.large,
        height: height * 0.45,
    },
    listHeader: {
        alignItems: 'center',
        marginBottom: 15,
    },
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#DDD',
        borderRadius: 2,
        marginBottom: 12,
    },
    listTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    listContent: {
        paddingHorizontal: 20,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#999',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#BBB',
        marginTop: 4,
    },
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        backgroundColor: '#fff',
        borderRadius: 16,
        marginRight: 15,
        overflow: 'hidden',
        ...lightTheme.shadows.medium,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    cardSelected: {
        borderColor: lightTheme.colors.primary,
        transform: [{ scale: 1.02 }],
    },
    cardImage: {
        width: '100%',
        height: 110,
        backgroundColor: '#F0F2F5',
    },
    cardOverlay: {
        position: 'absolute',
        top: 8,
        left: 8,
    },
    cardBadge: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    cardBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },
    cardContent: {
        padding: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 6,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A1A',
        flex: 1,
        marginRight: 8,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF9E6',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 8,
        gap: 3,
    },
    ratingText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#FFB800',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 8,
    },
    cardLocation: {
        fontSize: 12,
        color: '#666',
        flex: 1,
    },
    insightsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 10,
        marginBottom: 10,
    },
    insightItem: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    insightValue: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    insightLabel: {
        fontSize: 10,
        color: '#999',
        textAlign: 'center',
    },
    insightDivider: {
        width: 1,
        height: 35,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 6,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    cardPrice: {
        fontSize: 18,
        fontWeight: '700',
        color: lightTheme.colors.primary,
    },
    perDay: {
        fontSize: 11,
        color: '#999',
        marginTop: 2,
    },
    viewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: lightTheme.colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 4,
    },
    viewButtonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
});

export default MapSearchScreen;
