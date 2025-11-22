import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { lightTheme } from '../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PUNE_AREAS = [
    { id: '1', name: 'Koregaon Park', icon: 'tree' },
    { id: '2', name: 'Baner', icon: 'office-building' },
    { id: '3', name: 'Viman Nagar', icon: 'airplane' },
    { id: '4', name: 'FC Road', icon: 'shopping' },
    { id: '5', name: 'Hinjewadi', icon: 'domain' },
    { id: '6', name: 'Kalyani Nagar', icon: 'home-city' },
    { id: '7', name: 'Aundh', icon: 'city' },
    { id: '8', name: 'Magarpatta', icon: 'office-building-marker' },
    { id: '9', name: 'Hadapsar', icon: 'factory' },
    { id: '10', name: 'Kothrud', icon: 'home-group' },
];

const LocationSelectionScreen = () => {
    const navigation = useNavigation();

    const handleAreaSelect = (area: string) => {
        // Navigate to the main advertiser tabs, passing the selected area to the Search screen
        navigation.navigate('AdvertiserMain', {
            screen: 'Search',
            params: { area, city: 'Pune' }, // Default city to Pune
        });
    };

    const renderAreaItem = ({ item }: { item: typeof PUNE_AREAS[0] }) => (
        <TouchableOpacity
            style={styles.cityCard}
            onPress={() => handleAreaSelect(item.name)}>
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={item.icon as any} size={32} color={lightTheme.colors.primary} />
            </View>
            <Text style={styles.cityName}>{item.name}</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color={lightTheme.colors.textSecondary} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Select Area in Pune</Text>
                <Text style={styles.subtitle}>Choose a locality to find billboards</Text>
            </View>

            <FlatList
                data={PUNE_AREAS}
                renderItem={renderAreaItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            <TouchableOpacity style={styles.currentLocationButton} onPress={() => handleAreaSelect('')}>
                <MaterialCommunityIcons name="crosshairs-gps" size={24} color="#fff" />
                <Text style={styles.currentLocationText}>Show All Pune Billboards</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: lightTheme.colors.background,
    },
    header: {
        padding: lightTheme.spacing.xl,
        alignItems: 'center',
    },
    title: {
        ...lightTheme.typography.h4,
        textAlign: 'center',
        marginBottom: lightTheme.spacing.xs,
        color: lightTheme.colors.text,
    },
    subtitle: {
        ...lightTheme.typography.body1,
        color: lightTheme.colors.textSecondary,
        textAlign: 'center',
    },
    listContent: {
        padding: lightTheme.spacing.md,
    },
    cityCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: lightTheme.colors.surface,
        padding: lightTheme.spacing.md,
        borderRadius: lightTheme.borderRadius.md,
        marginBottom: lightTheme.spacing.md,
        ...lightTheme.shadows.small,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: lightTheme.spacing.md,
    },
    cityName: {
        ...lightTheme.typography.h5,
        flex: 1,
        color: lightTheme.colors.text,
    },
    currentLocationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: lightTheme.colors.primary,
        margin: lightTheme.spacing.lg,
        padding: lightTheme.spacing.md,
        borderRadius: lightTheme.borderRadius.md,
        ...lightTheme.shadows.medium,
    },
    currentLocationText: {
        ...lightTheme.typography.button,
        color: '#fff',
        marginLeft: lightTheme.spacing.sm,
    },
});

export default LocationSelectionScreen;
