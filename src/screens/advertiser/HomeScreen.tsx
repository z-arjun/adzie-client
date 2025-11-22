import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    TextInput,
    SafeAreaView,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchBillboards } from '../../store/slices/billboardSlice';
import { Billboard } from '../../types';
import { lightTheme } from '../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AdvertiserHomeScreen = ({ navigation, route }: any) => {
    const dispatch = useAppDispatch();
    const { billboards, loading } = useAppSelector(state => state.billboard);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const { params } = route;
    const city = params?.city;
    const area = params?.area;

    useEffect(() => {
        if (area) {
            dispatch(fetchBillboards({ city: 'Pune', area, searchQuery }));
        } else if (city) {
            dispatch(fetchBillboards({ city, searchQuery }));
        } else {
            dispatch(fetchBillboards({ city: 'Pune', searchQuery }));
        }
    }, [dispatch, searchQuery, city, area]);

    const categories = ['All', 'Digital', 'Static', 'Hoarding', 'Gantry', 'Unipole'];

    const filteredBillboards = selectedCategory === 'All'
        ? billboards
        : billboards.filter(b => b.type.toLowerCase() === selectedCategory.toLowerCase() || b.title.toLowerCase().includes(selectedCategory.toLowerCase()));

    const featuredBillboards = billboards.slice(0, 5); // Mock featured

    const renderCategoryItem = ({ item }: { item: string }) => (
        <TouchableOpacity
            style={[styles.categoryItem, selectedCategory === item && styles.categoryItemActive]}
            onPress={() => setSelectedCategory(item)}>
            <Text style={[styles.categoryText, selectedCategory === item && styles.categoryTextActive]}>
                {item}
            </Text>
        </TouchableOpacity>
    );

    const renderFeaturedItem = ({ item }: { item: Billboard }) => (
        <TouchableOpacity
            style={styles.featuredCard}
            onPress={() => navigation.navigate('BillboardDetail', { billboardId: item.id })}>
            <Image source={typeof item.images[0] === 'string' ? { uri: item.images[0] } : item.images[0]} style={styles.featuredImage} />
            <View style={styles.featuredGradient}>
                <View style={styles.featuredBadge}>
                    <MaterialCommunityIcons name="star" size={12} color="#FFD700" />
                    <Text style={styles.featuredBadgeText}>FEATURED</Text>
                </View>
                <View>
                    <Text style={styles.featuredTitle} numberOfLines={1}>{item.title}</Text>
                    <View style={styles.featuredFooter}>
                        <Text style={styles.featuredPrice}>₹{item.pricePerDay.toLocaleString()}/day</Text>
                        <View style={styles.featuredRating}>
                            <MaterialCommunityIcons name="star" size={14} color="#FFD700" />
                            <Text style={styles.featuredRatingText}>{item.rating.toFixed(1)}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );


    const renderBillboard = ({ item }: { item: Billboard }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('BillboardDetail', { billboardId: item.id })}>
            <Image source={typeof item.images[0] === 'string' ? { uri: item.images[0] } : item.images[0]} style={styles.image} />
            <View style={styles.cardContent}>
                <View>
                    <View style={styles.cardHeader}>
                        <View style={styles.typeTag}>
                            <Text style={styles.typeText}>{item.type.toUpperCase()}</Text>
                        </View>
                        <View style={styles.impressionsBadge}>
                            <MaterialCommunityIcons name="eye-outline" size={12} color="#666" />
                            <Text style={styles.impressionsText}>{(item.estimatedDailyImpressions / 1000).toFixed(1)}K</Text>
                        </View>
                    </View>
                    <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                    <Text style={styles.location} numberOfLines={1}>
                        <MaterialCommunityIcons name="map-marker" size={12} color="#666" />
                        {' '}{item.location.address}
                    </Text>
                </View>
                <View style={styles.cardFooter}>
                    <View>
                        <Text style={styles.price}>₹{item.pricePerDay.toLocaleString()}</Text>
                        <Text style={styles.perDay}>per day</Text>
                    </View>
                    <View style={styles.ratingContainer}>
                        <MaterialCommunityIcons name="star" size={14} color="#FFD700" />
                        <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                        <Text style={styles.reviewCount}>({item.reviewCount})</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerLabel}>Location</Text>
                        <TouchableOpacity style={styles.locationSelector} onPress={() => navigation.navigate('LocationSelection')}>
                            <MaterialCommunityIcons name="map-marker" size={20} color={lightTheme.colors.primary} />
                            <Text style={styles.headerLocation}>{area ? `${area}, Pune` : (city || 'Pune')}</Text>
                            <MaterialCommunityIcons name="chevron-down" size={20} color={lightTheme.colors.textSecondary} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.profileButton}>
                        <Image
                            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                            style={styles.profileImage}
                        />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <MaterialCommunityIcons name="magnify" size={24} color={lightTheme.colors.textSecondary} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search billboards..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor={lightTheme.colors.textSecondary}
                        />
                    </View>
                    <TouchableOpacity style={styles.filterButton}>
                        <MaterialCommunityIcons name="tune" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={filteredBillboards}
                    renderItem={renderBillboard}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <>
                            {/* Categories */}
                            <FlatList
                                data={categories}
                                renderItem={renderCategoryItem}
                                keyExtractor={item => item}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.categoriesList}
                            />

                            {/* Featured Section */}
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Featured</Text>
                                <TouchableOpacity>
                                    <Text style={styles.seeAll}>See All</Text>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={featuredBillboards}
                                renderItem={renderFeaturedItem}
                                keyExtractor={item => item.id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.featuredList}
                                snapToInterval={300}
                                decelerationRate="fast"
                            />

                            <Text style={styles.sectionTitle}>Nearby Billboards</Text>
                        </>
                    }
                    ListEmptyComponent={
                        loading ? (
                            <ActivityIndicator size="large" color={lightTheme.colors.primary} style={{ marginTop: 50 }} />
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No billboards found</Text>
                            </View>
                        )
                    }
                />

                <TouchableOpacity
                    style={styles.mapButton}
                    onPress={() => navigation.navigate('MapSearch')}>
                    <MaterialCommunityIcons name="map" size={24} color="#fff" />
                    <Text style={styles.mapButtonText}>Map</Text>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#fff',
    },
    headerLabel: {
        fontSize: 12,
        color: lightTheme.colors.textSecondary,
        marginBottom: 2,
    },
    locationSelector: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerLocation: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
        marginHorizontal: 4,
    },
    profileButton: {
        padding: 2,
        borderWidth: 2,
        borderColor: lightTheme.colors.primary,
        borderRadius: 20,
    },
    profileImage: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingBottom: 15,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F2F5',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 15,
        color: '#1A1A1A',
    },
    filterButton: {
        width: 48,
        height: 48,
        backgroundColor: lightTheme.colors.primary,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingBottom: 80,
    },
    categoriesList: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    categoryItem: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#fff',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    categoryItemActive: {
        backgroundColor: lightTheme.colors.primary,
        borderColor: lightTheme.colors.primary,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    categoryTextActive: {
        color: '#fff',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 15,
        marginTop: 5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        marginLeft: 20,
        marginBottom: 10,
    },
    seeAll: {
        fontSize: 14,
        color: lightTheme.colors.primary,
        fontWeight: '600',
    },
    featuredList: {
        paddingHorizontal: 20,
        paddingBottom: 25,
    },
    featuredCard: {
        width: 280,
        height: 180,
        borderRadius: 16,
        marginRight: 15,
        overflow: 'hidden',
        backgroundColor: '#000',
        ...lightTheme.shadows.medium,
    },
    featuredImage: {
        width: '100%',
        height: '100%',
        opacity: 0.8,
    },
    featuredGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 15,
        paddingTop: 40,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    featuredBadge: {
        position: 'absolute',
        top: 15,
        left: 15,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    featuredBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },
    featuredTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 6,
    },
    featuredFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    featuredPrice: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    featuredRating: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    featuredRatingText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginBottom: 15,
        borderRadius: 16,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    image: {
        width: 110,
        height: 110,
        borderRadius: 12,
        backgroundColor: '#F0F2F5',
    },
    cardContent: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
        paddingVertical: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    typeTag: {
        backgroundColor: '#F0F2F5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    typeText: {
        fontSize: 10,
        color: '#666',
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    impressionsBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F2F5',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 6,
        gap: 3,
    },
    impressionsText: {
        fontSize: 10,
        color: '#666',
        fontWeight: '600',
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 5,
        lineHeight: 20,
    },
    location: {
        fontSize: 12,
        color: '#666',
        lineHeight: 16,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 4,
    },
    price: {
        fontSize: 18,
        fontWeight: '700',
        color: lightTheme.colors.primary,
        lineHeight: 22,
    },
    perDay: {
        fontSize: 11,
        color: '#999',
        fontWeight: '400',
        marginTop: 2,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF9E6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 3,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFB800',
    },
    reviewCount: {
        fontSize: 11,
        color: '#999',
        marginLeft: 2,
    },
    mapButton: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        backgroundColor: '#1A1A1A',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 30,
        gap: 8,
        ...lightTheme.shadows.large,
    },
    mapButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 50,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },
});

export default AdvertiserHomeScreen;
