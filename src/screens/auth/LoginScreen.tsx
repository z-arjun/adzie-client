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
import { login, clearError } from '../../store/slices/authSlice';
import { lightTheme } from '../../theme';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from '../../components/Logo';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector(state => state.auth);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const result = await dispatch(login({ email, password }));
        if (login.rejected.match(result)) {
            Alert.alert('Login Failed', result.payload as string);
        }
    };

    React.useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

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
                    {/* Custom Logo */}
                    <View style={styles.brandContainer}>
                        <Logo size="large" />
                    </View>
                </View>

                {/* Form Section */}
                <View style={styles.formContainer}>
                    <View style={styles.formCard}>
                        <Text style={styles.welcomeText}>Welcome Back</Text>
                        <Text style={styles.subtitleText}>Sign in to continue</Text>

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

                        {/* Forgot Password */}
                        <TouchableOpacity style={styles.forgotPassword}>
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        {error && <Text style={styles.errorText}>{error}</Text>}

                        {/* Login Button */}
                        <TouchableOpacity
                            style={[styles.loginButton, loading && styles.buttonDisabled]}
                            onPress={handleLogin}
                            disabled={loading}
                            activeOpacity={0.8}>
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Text style={styles.loginButtonText}>Sign In</Text>
                                    <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
                                </>
                            )}
                        </TouchableOpacity>

                        {/* Demo Credentials */}
                        <View style={styles.demoSection}>
                            <View style={styles.divider}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>Quick Access</Text>
                                <View style={styles.dividerLine} />
                            </View>

                            <View style={styles.demoCardsContainer}>
                                <TouchableOpacity
                                    style={styles.demoCard}
                                    onPress={() => {
                                        setEmail('advertiser@example.com');
                                        setPassword('password123');
                                    }}>
                                    <View style={[styles.demoIcon, { backgroundColor: '#3B82F620' }]}>
                                        <MaterialCommunityIcons name="bullhorn" size={20} color="#3B82F6" />
                                    </View>
                                    <Text style={styles.demoCardTitle}>Advertiser</Text>
                                    <Text style={styles.demoCardSubtitle}>Demo Login</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.demoCard}
                                    onPress={() => {
                                        setEmail('owner@example.com');
                                        setPassword('password123');
                                    }}>
                                    <View style={[styles.demoIcon, { backgroundColor: '#10B98120' }]}>
                                        <MaterialCommunityIcons name="account-tie" size={20} color="#10B981" />
                                    </View>
                                    <Text style={styles.demoCardTitle}>Owner</Text>
                                    <Text style={styles.demoCardSubtitle}>Demo Login</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Sign Up Link */}
                        <View style={styles.signupContainer}>
                            <Text style={styles.signupText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                                <Text style={styles.signupLink}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView >
        </KeyboardAvoidingView >
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
        height: height * 0.3,
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
        marginBottom: 32,
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
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: lightTheme.colors.primary,
        fontWeight: '600',
    },
    errorText: {
        fontSize: 14,
        color: '#EF4444',
        marginBottom: 16,
        textAlign: 'center',
    },
    loginButton: {
        backgroundColor: lightTheme.colors.primary,
        borderRadius: 16,
        paddingVertical: 18,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        shadowColor: lightTheme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    loginButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 0.5,
    },
    demoSection: {
        marginTop: 32,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        fontSize: 13,
        color: '#999',
        paddingHorizontal: 12,
        fontWeight: '500',
    },
    demoCardsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    demoCard: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    demoIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    demoCardTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    demoCardSubtitle: {
        fontSize: 11,
        color: '#666',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
        marginBottom: 8,
    },
    signupText: {
        fontSize: 14,
        color: '#666',
    },
    signupLink: {
        fontSize: 14,
        color: lightTheme.colors.primary,
        fontWeight: '700',
    },
});

export default LoginScreen;
