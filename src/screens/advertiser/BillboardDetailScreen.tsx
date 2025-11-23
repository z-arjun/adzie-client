import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Billboard } from '../../types';
import billboardService from '../../services/billboardService';
import { lightTheme } from '../../theme';

const { width, height } = Dimensions.get('window');

const BillboardDetailScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    // @ts-ignore
    const { billboardId } = route.params || {};

    const [selectedBillboard, setSelectedBillboard] = useState<Billboard | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadBillboard = async () => {
            if (!billboardId) return;
            setLoading(true);
            const response = await billboardService.getBillboardById(billboardId);
            if (response.success && response.data) {
                setSelectedBillboard(response.data);
            } else {
                setError(response.error || 'Unknown error');
            }
            setLoading(false);
        };

        loadBillboard();
    }, [billboardId]);

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={lightTheme.colors.primary} />
            </View>
        );
    }

    if (!selectedBillboard) {
        return (
            <View style={styles.centerContainer}>
                <MaterialCommunityIcons name="billboard" size={64} color={lightTheme.colors.textSecondary} />
                <Text style={styles.errorText}>{error || `Billboard not found`}</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.retryButton}>
                    <Text style={styles.retryButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero Image Section */}
                <View style={styles.imageSection}>
                    <Image
                        source={typeof selectedBillboard.images[selectedImageIndex] === 'string'
                            ? { uri: selectedBillboard.images[selectedImageIndex] }
                            : selectedBillboard.images[selectedImageIndex]}
                        style={styles.heroImage}
                        resizeMode="cover"
                    />

                    {/* Gradient Overlay */}
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.7)']}
                        style={styles.imageGradient}
                    />

                    {/* Back Button */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                    </TouchableOpacity>

                    {/* Type Badge */}
                    <View style={[
                        styles.typeBadgeHero,
                        selectedBillboard.type === 'digital' ? styles.digitalBadge : styles.staticBadge
                    ]}>
                        <MaterialCommunityIcons
                            name={selectedBillboard.type === 'digital' ? 'monitor' : 'billboard'}
                            size={14}
                            color="#fff"
                        />
                        <Text style={styles.typeBadgeText}>
                            {selectedBillboard.type === 'digital' ? 'Digital' : 'Static'}
                        </Text>
                    </View>

                    {/* Image Thumbnails */}
                    {selectedBillboard.images.length > 1 && (
                        <View style={styles.thumbnailContainer}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.thumbnailScrollContent}
                            >
                                {selectedBillboard.images.map((img: string | number, idx: number) => (
                                    <TouchableOpacity
                                        key={idx}
                                        onPress={() => setSelectedImageIndex(idx)}
                                        style={[
                                            styles.thumbnail,
                                            selectedImageIndex === idx && styles.thumbnailActive,
                                        ]}
                                    >
                                        <Image
                                            source={typeof img === 'string' ? { uri: img } : img}
                                            style={styles.thumbnailImage}
                                        />
                                        {selectedImageIndex === idx && (
                                            <View style={styles.thumbnailOverlay} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>

                {/* Content Section */}
                <View style={styles.contentSection}>
                    {/* Title & Rating */}
                    <View style={styles.titleSection}>
                        <Text style={styles.title}>{selectedBillboard.title}</Text>
                        <View style={styles.ratingContainer}>
                            <MaterialCommunityIcons name="star" size={18} color="#FFC107" />
                            <Text style={styles.ratingText}>{selectedBillboard.rating.toFixed(1)}</Text>
                            <Text style={styles.reviewCount}>({selectedBillboard.reviewCount})</Text>
                        </View>
                    </View>

                    {/* Location */}
                    <View style={styles.locationRow}>
                        <MaterialCommunityIcons name="map-marker" size={18} color={lightTheme.colors.primary} />
                        <Text style={styles.locationText}>{selectedBillboard.location.address}</Text>
                    </View>

                    {/* Stats Cards */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statCard}>
                            <View style={[styles.statIconContainer, { backgroundColor: '#E3F2FD' }]}>
                                <MaterialCommunityIcons name="eye" size={24} color="#2196F3" />
                            </View>
                            <Text style={styles.statValue}>
                                {selectedBillboard.estimatedDailyImpressions.toLocaleString()}
                            </Text>
                            <Text style={styles.statLabel}>Daily Impressions</Text>
                        </View>

                        <View style={styles.statCard}>
                            <View style={[styles.statIconContainer, { backgroundColor: '#F3E5F5' }]}>
                                <MaterialCommunityIcons name="resize" size={24} color="#9C27B0" />
                            </View>
                            <Text style={styles.statValue}>
                                {selectedBillboard.dimensions.width}×{selectedBillboard.dimensions.height}
                            </Text>
                            <Text style={styles.statLabel}>Size ({selectedBillboard.dimensions.unit})</Text>
                        </View>

                        <View style={styles.statCard}>
                            <View style={[styles.statIconContainer, { backgroundColor: '#FFF3E0' }]}>
                                <MaterialCommunityIcons name="lightbulb-on" size={24} color="#FF9800" />
                            </View>
                            <Text style={styles.statValue}>
                                {selectedBillboard.lighting === 'both' ? '24/7' :
                                    selectedBillboard.lighting === 'night' ? 'Night' : 'Day'}
                            </Text>
                            <Text style={styles.statLabel}>Lighting</Text>
                        </View>
                    </View>

                    {/* Features */}
                    {selectedBillboard.features && selectedBillboard.features.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>✨ Features</Text>
                            <View style={styles.featuresGrid}>
                                {selectedBillboard.features.map((feature: string, index: number) => (
                                    <View key={index} style={styles.featureChip}>
                                        <MaterialCommunityIcons name="check-circle" size={14} color={lightTheme.colors.primary} />
                                        <Text style={styles.featureText}>{feature}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Description */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📝 About This Billboard</Text>
                        <View style={styles.descriptionCard}>
                            <Text style={styles.descriptionText}>{selectedBillboard.description}</Text>
                        </View>
                    </View>

                    {/* Details */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📋 Details</Text>
                        <View style={styles.detailsCard}>
                            <View style={styles.detailRow}>
                                <View style={styles.detailIconWrapper}>
                                    <MaterialCommunityIcons name="calendar-range" size={20} color={lightTheme.colors.primary} />
                                </View>
                                <View style={styles.detailContent}>
                                    <Text style={styles.detailLabel}>Minimum Booking</Text>
                                    <Text style={styles.detailValue}>{selectedBillboard.minBookingDays} days</Text>
                                </View>
                            </View>

                            <View style={styles.detailDivider} />

                            <View style={styles.detailRow}>
                                <View style={styles.detailIconWrapper}>
                                    <MaterialCommunityIcons name="account-tie" size={20} color={lightTheme.colors.primary} />
                                </View>
                                <View style={styles.detailContent}>
                                    <Text style={styles.detailLabel}>Owner</Text>
                                    <Text style={styles.detailValue}>Premium Verified</Text>
                                </View>
                            </View>

                            <View style={styles.detailDivider} />

                            <View style={styles.detailRow}>
                                <View style={styles.detailIconWrapper}>
                                    <MaterialCommunityIcons name="chart-line" size={20} color={lightTheme.colors.primary} />
                                </View>
                                <View style={styles.detailContent}>
                                    <Text style={styles.detailLabel}>Total Views</Text>
                                    <Text style={styles.detailValue}>{selectedBillboard.viewsCount.toLocaleString()}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Spacing for fixed footer */}
                    <View style={{ height: 100 }} />
                </View>
            </ScrollView>

            {/* Fixed Bottom Bar */}
            <View style={styles.bottomBar}>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Price</Text>
                    <View style={styles.priceRow}>
                        <Text style={styles.price}>₹{selectedBillboard.pricePerDay}</Text>
                        <Text style={styles.perDay}>/day</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.bookButton}>
                    <LinearGradient
                        colors={[lightTheme.colors.primary, '#7C3AED']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.bookButtonGradient}
                    >
                        <Text style={styles.bookButtonText}>Book Now</Text>
                        <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
    imageSection: {
        position: 'relative',
    },
    heroImage: {
        width: width,
        height: height * 0.45,
        backgroundColor: '#E0E0E0',
    },
    imageGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    typeBadgeHero: {
        position: 'absolute',
        top: 50,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    digitalBadge: {
        backgroundColor: '#2196F3',
    },
    staticBadge: {
        backgroundColor: '#4CAF50',
    },
    typeBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
    },
    thumbnailContainer: {
        position: 'absolute',
        bottom: 16,
        left: 0,
        right: 0,
    },
    thumbnailScrollContent: {
        paddingHorizontal: 16,
        gap: 8,
    },
    thumbnail: {
        width: 60,
        height: 60,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    thumbnailActive: {
        borderColor: '#fff',
    },
    thumbnailImage: {
        width: '100%',
        height: '100%',
    },
    thumbnailOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(98, 0, 238, 0.3)',
    },
    contentSection: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -24,
        paddingTop: 24,
        paddingHorizontal: 20,
    },
    titleSection: {
        marginBottom: 12,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 8,
        lineHeight: 32,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    reviewCount: {
        fontSize: 14,
        color: '#666',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 20,
    },
    locationText: {
        fontSize: 14,
        color: '#666',
        flex: 1,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        ...lightTheme.shadows.small,
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
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 11,
        color: '#666',
        textAlign: 'center',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 12,
    },
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    featureChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    featureText: {
        fontSize: 13,
        color: '#1A1A1A',
        fontWeight: '500',
    },
    descriptionCard: {
        backgroundColor: '#F8F9FA',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    descriptionText: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 22,
    },
    detailsCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    detailIconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailContent: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    detailDivider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 16,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingBottom: 20,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        gap: 12,
        ...lightTheme.shadows.large,
    },
    priceContainer: {
        flex: 1,
    },
    priceLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    price: {
        fontSize: 24,
        fontWeight: '700',
        color: lightTheme.colors.primary,
    },
    perDay: {
        fontSize: 14,
        color: '#666',
    },
    bookButton: {
        flex: 1.2,
        borderRadius: 16,
        overflow: 'hidden',
    },
    bookButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 8,
    },
    bookButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 0.5,
    },
    errorText: {
        fontSize: 16,
        color: '#666',
        marginTop: 16,
        marginBottom: 24,
    },
    retryButton: {
        backgroundColor: lightTheme.colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    retryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});

export default BillboardDetailScreen;
