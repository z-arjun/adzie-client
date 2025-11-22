import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { register } from '../../store/slices/authSlice';
import { lightTheme } from '../../theme';
import Logo from '../../components/Logo';

const { width, height } = Dimensions.get('window');

const SignupScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [userType, setUserType] = useState<'advertiser' | 'owner'>('advertiser');
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useAppDispatch();
    const { loading } = useAppSelector(state => state.auth);

    const handleSignup = async () => {
        if (!email || !password || !fullName || !phone) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const result = await dispatch(register({ email, password, fullName, userType, phone }));
        if (register.fulfilled.match(result)) {
            Alert.alert('Success', 'Account created successfully!');
        } else {
            Alert.alert('Registration Failed', result.payload as string);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={false}>

                {/* Top Section with Logo */}
                <View style={styles.topSection}>
                    <View style={styles.brandContainer}>
                        <Logo size="medium" />
                    </View>
                </View>

                {/* Form Section */}
                <View style={styles.formContainer}>
                    <View style={styles.formCard}>
                        <Text style={styles.welcomeText}>Create Account</Text>
                        <Text style={styles.subtitleText}>Join the billboard marketplace</Text>

                        {/* User Type Selection */}
                        <View style={styles.userTypeSection}>
                            <Text style={styles.sectionLabel}>I am a/an:</Text>
                            <View style={styles.userTypeContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.userTypeCard,
                                        userType === 'advertiser' && styles.userTypeCardActive,
                                    ]}
                                    onPress={() => setUserType('advertiser')}
                                    activeOpacity={0.8}>
                                    <View style={[
                                        styles.userTypeIcon,
                                        { backgroundColor: userType === 'advertiser' ? '#3B82F620' : '#F8F9FA' }
                                    ]}>
                                        <MaterialCommunityIcons
                                            name="bullhorn"
                                            size={24}
                                            color={userType === 'advertiser' ? '#3B82F6' : '#666'}
                                        />
                                    </View>
                                    <Text style={[
                                        styles.userTypeText,
                                        userType === 'advertiser' && styles.userTypeTextActive,
                                    ]}>
                                        Advertiser
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.userTypeCard,
                                        userType === 'owner' && styles.userTypeCardActive,
                                    ]}
                                    onPress={() => setUserType('owner')}
                                    activeOpacity={0.8}>
                                    <View style={[
                                        styles.userTypeIcon,
                                        { backgroundColor: userType === 'owner' ? '#10B98120' : '#F8F9FA' }
                                    ]}>
                                        <MaterialCommunityIcons
                                            name="account-tie"
                                            size={24}
                                            color={userType === 'owner' ? '#10B981' : '#666'}
                                        />
                                    </View>
                                    <Text style={[
                                        styles.userTypeText,
                                        userType === 'owner' && styles.userTypeTextActive,
                                    ]}>
                                        Owner
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Full Name Input */}
                        <View style={styles.inputWrapper}>
                            <MaterialCommunityIcons
                                name="account-outline"
                                size={20}
                                color="#666"
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Full Name"
                                placeholderTextColor="#999"
                                value={fullName}
                                onChangeText={setFullName}
                                editable={!loading}
                            />
                        </View>

                        {/* Email Input */}
                        <View style={styles.inputWrapper}>
                            <MaterialCommunityIcons
                                name="email-outline"
                                size={20}
                                color="#666"
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Email Address"
                                placeholderTextColor="#999"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                editable={!loading}
                            />
                        </View>

                        {/* Phone Input */}
                        <View style={styles.inputWrapper}>
                            <MaterialCommunityIcons
                                name="phone-outline"
                                size={20}
                                color="#666"
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Phone Number"
                                placeholderTextColor="#999"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                                editable={!loading}
                            />
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputWrapper}>
                            <MaterialCommunityIcons
                                name="lock-outline"
                                size={20}
                                color="#666"
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor="#999"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                editable={!loading}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}>
                                <MaterialCommunityIcons
                                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                                    size={20}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Sign Up Button */}
                        <TouchableOpacity
                            style={[styles.signupButton, loading && styles.buttonDisabled]}
                            onPress={handleSignup}
                            disabled={loading}
                            activeOpacity={0.8}>
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Text style={styles.signupButtonText}>Create Account</Text>
                                    <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
                                </>
                            )}
                        </TouchableOpacity>

                        {/* Login Link */}
                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.loginLink}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollContent: {
        flexGrow: 1,
    },
    topSection: {
        height: height * 0.25,
        backgroundColor: lightTheme.colors.primary,
        position: 'relative',
        overflow: 'hidden',
    },
    brandContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 40,
    },
    formContainer: {
        flex: 1,
        marginTop: -40,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    formCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    subtitleText: {
        fontSize: 15,
        color: '#666',
        marginBottom: 24,
    },
    userTypeSection: {
        marginBottom: 24,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 12,
    },
    userTypeContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    userTypeCard: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E5E7EB',
    },
    userTypeCardActive: {
        borderColor: lightTheme.colors.primary,
        backgroundColor: '#F3E5F5',
    },
    userTypeIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    userTypeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    userTypeTextActive: {
        color: lightTheme.colors.primary,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 16,
        marginBottom: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        paddingVertical: 16,
        fontSize: 15,
        color: '#1A1A1A',
    },
    eyeIcon: {
        padding: 8,
    },
    signupButton: {
        backgroundColor: lightTheme.colors.primary,
        borderRadius: 16,
        paddingVertical: 18,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginTop: 8,
        shadowColor: lightTheme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    signupButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 0.5,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
        marginBottom: 8,
    },
    loginText: {
        fontSize: 14,
        color: '#666',
    },
    loginLink: {
        fontSize: 14,
        color: lightTheme.colors.primary,
        fontWeight: '700',
    },
});

export default SignupScreen;
