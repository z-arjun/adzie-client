import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    SafeAreaView,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createBillboard } from '../../store/slices/billboardSlice';
import { lightTheme } from '../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AddListingScreen = ({ navigation }: any) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [price, setPrice] = useState('');
    const [lighting, setLighting] = useState<'daylight' | 'night' | 'both'>('both');

    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const { loading } = useAppSelector(state => state.billboard);

    const handleSubmit = async () => {
        if (!title || !description || !address || !city || !state || !width || !height || !price) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        if (!user) return;

        const newBillboard = {
            ownerId: user.id,
            title,
            description,
            location: {
                latitude: 40.7589, // Mock coordinates
                longitude: -73.9851,
                address,
                city,
                state,
            },
            dimensions: {
                width: parseFloat(width),
                height: parseFloat(height),
                unit: 'ft' as const,
            },
            pricePerDay: parseFloat(price),
            lighting,
            images: ['https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800'], // Mock image
            status: 'active' as const,
            availableDates: [],
        };

        const result = await dispatch(createBillboard(newBillboard));
        if (createBillboard.fulfilled.match(result)) {
            Alert.alert('Success', 'Billboard created successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } else {
            Alert.alert('Error', 'Failed to create billboard');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}>

                    {/* Basic Information Card */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <MaterialCommunityIcons name="information" size={20} color={lightTheme.colors.primary} />
                            <Text style={styles.cardTitle}>Basic Information</Text>
                        </View>

                        <Text style={styles.label}>Billboard Title *</Text>
                        <View style={styles.inputContainer}>
                            <MaterialCommunityIcons name="billboard" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="e.g., Prime Downtown Billboard"
                                placeholderTextColor="#999"
                                value={title}
                                onChangeText={setTitle}
                            />
                        </View>

                        <Text style={styles.label}>Description *</Text>
                        <View style={[styles.inputContainer, styles.textAreaContainer]}>
                            <MaterialCommunityIcons name="text" size={20} color="#666" style={styles.inputIconTop} />
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Describe your billboard location, visibility, and features..."
                                placeholderTextColor="#999"
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={4}
                            />
                        </View>
                    </View>

                    {/* Location Card */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <MaterialCommunityIcons name="map-marker" size={20} color={lightTheme.colors.primary} />
                            <Text style={styles.cardTitle}>Location</Text>
                        </View>

                        <Text style={styles.label}>Street Address *</Text>
                        <View style={styles.inputContainer}>
                            <MaterialCommunityIcons name="road" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="e.g., 123 Main Street"
                                placeholderTextColor="#999"
                                value={address}
                                onChangeText={setAddress}
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={styles.halfWidth}>
                                <Text style={styles.label}>City *</Text>
                                <View style={styles.inputContainer}>
                                    <MaterialCommunityIcons name="city" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="City"
                                        placeholderTextColor="#999"
                                        value={city}
                                        onChangeText={setCity}
                                    />
                                </View>
                            </View>
                            <View style={styles.halfWidth}>
                                <Text style={styles.label}>State *</Text>
                                <View style={styles.inputContainer}>
                                    <MaterialCommunityIcons name="flag" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="State"
                                        placeholderTextColor="#999"
                                        value={state}
                                        onChangeText={setState}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Specifications Card */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <MaterialCommunityIcons name="ruler" size={20} color={lightTheme.colors.primary} />
                            <Text style={styles.cardTitle}>Specifications</Text>
                        </View>

                        <Text style={styles.sectionSubtitle}>Dimensions (Feet)</Text>
                        <View style={styles.row}>
                            <View style={styles.halfWidth}>
                                <Text style={styles.label}>Width *</Text>
                                <View style={styles.inputContainer}>
                                    <MaterialCommunityIcons name="arrow-left-right" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="48"
                                        placeholderTextColor="#999"
                                        value={width}
                                        onChangeText={setWidth}
                                        keyboardType="decimal-pad"
                                    />
                                </View>
                            </View>
                            <View style={styles.halfWidth}>
                                <Text style={styles.label}>Height *</Text>
                                <View style={styles.inputContainer}>
                                    <MaterialCommunityIcons name="arrow-up-down" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="14"
                                        placeholderTextColor="#999"
                                        value={height}
                                        onChangeText={setHeight}
                                        keyboardType="decimal-pad"
                                    />
                                </View>
                            </View>
                        </View>

                        <Text style={styles.label}>Lighting Type *</Text>
                        <View style={styles.lightingContainer}>
                            {(['daylight', 'night', 'both'] as const).map(type => (
                                <TouchableOpacity
                                    key={type}
                                    style={[
                                        styles.lightingButton,
                                        lighting === type && styles.lightingButtonActive,
                                    ]}
                                    onPress={() => setLighting(type)}
                                    activeOpacity={0.7}>
                                    <MaterialCommunityIcons
                                        name={type === 'daylight' ? 'white-balance-sunny' : type === 'night' ? 'moon-waning-crescent' : 'rotate-orbit'}
                                        size={20}
                                        color={lighting === type ? lightTheme.colors.primary : '#666'}
                                    />
                                    <Text
                                        style={[
                                            styles.lightingText,
                                            lighting === type && styles.lightingTextActive,
                                        ]}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Pricing Card */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <MaterialCommunityIcons name="currency-usd" size={20} color={lightTheme.colors.primary} />
                            <Text style={styles.cardTitle}>Pricing</Text>
                        </View>

                        <Text style={styles.label}>Price per Day (₹) *</Text>
                        <View style={styles.inputContainer}>
                            <MaterialCommunityIcons name="cash" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="5000"
                                placeholderTextColor="#999"
                                value={price}
                                onChangeText={setPrice}
                                keyboardType="decimal-pad"
                            />
                        </View>

                        <View style={styles.pricingInfo}>
                            <MaterialCommunityIcons name="information-outline" size={16} color="#666" />
                            <Text style={styles.pricingInfoText}>
                                Set a competitive price based on location and size
                            </Text>
                        </View>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={loading}
                        activeOpacity={0.8}>
                        <MaterialCommunityIcons name="check-circle" size={20} color="#fff" />
                        <Text style={styles.submitButtonText}>
                            {loading ? 'Creating Billboard...' : 'Create Billboard'}
                        </Text>
                    </TouchableOpacity>

                    <View style={{ height: 20 }} />
                </ScrollView>
            </KeyboardAvoidingView>
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
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    sectionSubtitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: '#1A1A1A',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        marginBottom: 16,
        paddingHorizontal: 12,
    },
    textAreaContainer: {
        alignItems: 'flex-start',
    },
    inputIcon: {
        marginRight: 8,
    },
    inputIconTop: {
        marginRight: 8,
        marginTop: 12,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#1A1A1A',
        paddingVertical: 14,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
        paddingTop: 12,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    halfWidth: {
        flex: 1,
    },
    lightingContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    lightingButton: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        padding: 14,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E8E8E8',
        backgroundColor: '#F8F9FA',
        gap: 6,
    },
    lightingButtonActive: {
        borderColor: lightTheme.colors.primary,
        backgroundColor: '#F3E5F5',
    },
    lightingText: {
        fontSize: 13,
        color: '#666',
        fontWeight: '600',
    },
    lightingTextActive: {
        color: lightTheme.colors.primary,
        fontWeight: '700',
    },
    pricingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F2F5',
        padding: 12,
        borderRadius: 8,
        gap: 8,
        marginTop: 4,
    },
    pricingInfoText: {
        flex: 1,
        fontSize: 12,
        color: '#666',
        lineHeight: 16,
    },
    submitButton: {
        backgroundColor: lightTheme.colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        marginTop: 8,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
});

export default AddListingScreen;
