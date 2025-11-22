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
import { Billboard } from '../../types';
import billboardService from '../../services/billboardService';
import { lightTheme } from '../../theme';

const { width } = Dimensions.get('window');

const BillboardDetailScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    // @ts-ignore - params might be undefined in strict mode but we expect it
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
                <Text style={styles.errorText}>{error || `Billboard not found (ID: ${billboardId})`}</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.retryButton}>
                    <Text style={styles.retryButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Image Gallery */}
            <View style={styles.imageGallery}>
                <Image
                    source={typeof selectedBillboard.images[selectedImageIndex] === 'string' ? { uri: selectedBillboard.images[selectedImageIndex] } : selectedBillboard.images[selectedImageIndex]}
                    style={styles.mainImage}
                />
                <View style={styles.imageThumbnails}>
                    {selectedBillboard.images.map((img: string | number, idx: number) => (
                        <TouchableOpacity
                            key={idx}
                            onPress={() => setSelectedImageIndex(idx)}
                            style={[
                                styles.thumbnail,
                                selectedImageIndex === idx && styles.thumbnailActive,
                            ]}>
                            <Image source={typeof img === 'string' ? { uri: img } : img} style={styles.thumbnailImage} />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Details */}
            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <Text style={styles.title}>{selectedBillboard.title}</Text>
                    <View style={[styles.typeBadge, selectedBillboard.type === 'digital' ? styles.digitalBadge : styles.staticBadge]}>
                        <Text style={styles.typeText}>{selectedBillboard.type === 'digital' ? 'Digital' : 'Static'}</Text>
                    </View>
                </View>

                <View style={styles.ratingRow}>
                    <Text style={styles.ratingText}>
                        ⭐ {selectedBillboard.rating.toFixed(1)}
                    </Text>
                    <Text style={styles.reviewCount}>
                        ({selectedBillboard.reviewCount} reviews)
                    </Text>
                    <Text style={styles.views}>👁 {selectedBillboard.viewsCount} views</Text>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                            {selectedBillboard.estimatedDailyImpressions.toLocaleString()}
                        </Text>
                        <Text style={styles.statLabel}>Daily Impressions</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                            {selectedBillboard.dimensions.width}x{selectedBillboard.dimensions.height}
                        </Text>
                        <Text style={styles.statLabel}>Size ({selectedBillboard.dimensions.unit})</Text>
                    </View>
                </View>

                <View style={styles.priceRow}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                            <Text style={styles.price}>₹{selectedBillboard.pricePerDay}</Text>
                            <Text style={styles.perDay}>/day</Text>
                        </View>
                        <Text style={styles.minBooking}>Min. {selectedBillboard.minBookingDays} days</Text>
                    </View>
                </View>

                {/* Features */}
                {selectedBillboard.features && selectedBillboard.features.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>✨ Features</Text>
                        <View style={styles.featuresContainer}>
                            {selectedBillboard.features.map((feature: string, index: number) => (
                                <View key={index} style={styles.featureChip}>
                                    <Text style={styles.featureText}>{feature}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📍 Location</Text>
                    <Text style={styles.sectionText}>{selectedBillboard.location.address}</Text>
                    <Text style={styles.sectionText}>
                        {selectedBillboard.location.city}, {selectedBillboard.location.state} {selectedBillboard.location.zipCode}
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📏 Dimensions</Text>
                    <Text style={styles.sectionText}>
                        {selectedBillboard.dimensions.width} x {selectedBillboard.dimensions.height}{' '}
                        {selectedBillboard.dimensions.unit}
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>💡 Lighting</Text>
                    <Text style={styles.sectionText}>
                        {selectedBillboard.lighting === 'both'
                            ? 'Day & Night Illumination'
                            : selectedBillboard.lighting === 'night'
                                ? 'Night Illumination Only'
                                : 'Daylight Only'}
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📝 Description</Text>
                    <Text style={styles.sectionText}>{selectedBillboard.description}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>👤 Owner Info</Text>
                    <Text style={styles.sectionText}>Managed by: Owner #{selectedBillboard.ownerId}</Text>
                    <Text style={styles.sectionText}>Response Rate: 98%</Text>
                </View>

                <TouchableOpacity style={styles.bookButton}>
                    <Text style={styles.bookButtonText}>Book This Billboard</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: lightTheme.colors.background,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageGallery: {
        backgroundColor: lightTheme.colors.surface,
    },
    mainImage: {
        width: width,
        height: 220,
        backgroundColor: lightTheme.colors.surface,
    },
    imageThumbnails: {
        flexDirection: 'row',
        padding: lightTheme.spacing.sm,
        gap: lightTheme.spacing.xs,
    },
    thumbnail: {
        borderWidth: 2,
        borderColor: 'transparent',
        borderRadius: lightTheme.borderRadius.sm,
        overflow: 'hidden',
    },
    thumbnailActive: {
        borderColor: lightTheme.colors.primary,
    },
    thumbnailImage: {
        width: 50,
        height: 50,
    },
    content: {
        padding: lightTheme.spacing.md,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: lightTheme.spacing.xs,
    },
    title: {
        ...lightTheme.typography.h4,
        flex: 1,
        marginRight: lightTheme.spacing.sm,
    },
    typeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: lightTheme.colors.surface,
        borderWidth: 1,
    },
    digitalBadge: {
        borderColor: '#2196F3',
        backgroundColor: '#E3F2FD',
    },
    staticBadge: {
        borderColor: '#4CAF50',
        backgroundColor: '#E8F5E9',
    },
    typeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: lightTheme.spacing.sm,
        gap: lightTheme.spacing.sm,
    },
    ratingText: {
        ...lightTheme.typography.body2,
        fontWeight: '600',
    },
    reviewCount: {
        ...lightTheme.typography.caption,
        color: lightTheme.colors.textSecondary,
    },
    views: {
        ...lightTheme.typography.caption,
        color: lightTheme.colors.textSecondary,
        marginLeft: 'auto',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: lightTheme.spacing.md,
        paddingVertical: lightTheme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: lightTheme.colors.border,
    },
    price: {
        ...lightTheme.typography.h3,
        color: lightTheme.colors.primary,
    },
    perDay: {
        ...lightTheme.typography.body2,
        color: lightTheme.colors.textSecondary,
        marginLeft: 4,
    },
    minBooking: {
        ...lightTheme.typography.caption,
        color: lightTheme.colors.textSecondary,
        marginTop: 2,
    },
    section: {
        marginBottom: lightTheme.spacing.md,
    },
    sectionTitle: {
        ...lightTheme.typography.h5,
        fontSize: 16,
        marginBottom: lightTheme.spacing.xs,
    },
    sectionText: {
        ...lightTheme.typography.body2,
        color: lightTheme.colors.textSecondary,
        lineHeight: 20,
    },
    featuresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 4,
    },
    featureChip: {
        backgroundColor: lightTheme.colors.surface,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: lightTheme.colors.border,
    },
    featureText: {
        fontSize: 12,
        color: lightTheme.colors.text,
    },
    bookButton: {
        backgroundColor: lightTheme.colors.primary,
        padding: lightTheme.spacing.sm,
        borderRadius: lightTheme.borderRadius.md,
        alignItems: 'center',
        marginTop: lightTheme.spacing.sm,
        ...lightTheme.shadows.medium,
    },
    bookButtonText: {
        ...lightTheme.typography.button,
        color: '#fff',
    },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: lightTheme.colors.surface,
        padding: lightTheme.spacing.md,
        borderRadius: lightTheme.borderRadius.md,
        marginBottom: lightTheme.spacing.md,
        alignItems: 'center',
        justifyContent: 'space-around',
        ...lightTheme.shadows.small,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        ...lightTheme.typography.h5,
        color: lightTheme.colors.primary,
        marginBottom: 4,
    },
    statLabel: {
        ...lightTheme.typography.caption,
        color: lightTheme.colors.textSecondary,
    },
    statDivider: {
        width: 1,
        height: '80%',
        backgroundColor: lightTheme.colors.border,
    },
    errorText: {
        ...lightTheme.typography.body1,
        color: lightTheme.colors.error,
        marginBottom: lightTheme.spacing.md,
    },
    retryButton: {
        padding: lightTheme.spacing.sm,
        backgroundColor: lightTheme.colors.primary,
        borderRadius: lightTheme.borderRadius.md,
    },
    retryButtonText: {
        ...lightTheme.typography.button,
        color: '#fff',
    },
});

export default BillboardDetailScreen;
