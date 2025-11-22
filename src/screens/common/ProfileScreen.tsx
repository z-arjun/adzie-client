import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { lightTheme } from '../../theme';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';

const ProfileScreen = ({ navigation }: any) => {
    const { user } = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();

    const handleLogout = async () => {
        await dispatch(logout());
        // Navigation will be handled by the auth state change in App.tsx
    };

    const menuItems = [
        {
            id: '1',
            icon: 'account-circle',
            title: 'Edit Profile',
            subtitle: 'Update your personal information',
            route: 'EditProfile',
            color: '#3B82F6',
        },
        {
            id: '2',
            icon: 'bell',
            title: 'Notifications',
            subtitle: 'Manage notification preferences',
            route: 'Notifications',
            color: '#F59E0B',
        },
        {
            id: '3',
            icon: 'credit-card',
            title: 'Payment Methods',
            subtitle: 'Manage your payment options',
            route: 'PaymentMethods',
            color: '#10B981',
        },
        {
            id: '4',
            icon: 'shield-check',
            title: 'Privacy & Security',
            subtitle: 'Control your privacy settings',
            route: 'Privacy',
            color: '#8B5CF6',
        },
        {
            id: '5',
            icon: 'help-circle',
            title: 'Help & Support',
            subtitle: 'Get help or contact support',
            route: 'Support',
            color: '#EC4899',
        },
        {
            id: '6',
            icon: 'file-document',
            title: 'Terms & Conditions',
            subtitle: 'Read our terms and policies',
            route: 'Terms',
            color: '#6B7280',
        },
    ];

    const stats = [
        { label: 'Active Bookings', value: '3', icon: 'calendar-check', color: '#10B981' },
        { label: 'Total Spent', value: '₹7.5L', icon: 'currency-inr', color: '#3B82F6' },
        { label: 'Saved Boards', value: '12', icon: 'heart', color: '#EF4444' },
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.profileSection}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{ uri: user?.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg' }}
                                style={styles.avatar}
                            />
                            <TouchableOpacity style={styles.editAvatarButton}>
                                <MaterialCommunityIcons name="camera" size={16} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.userName}>{user?.fullName || 'John Doe'}</Text>
                            <Text style={styles.userEmail}>{user?.email || 'john.doe@example.com'}</Text>
                            <View style={styles.verifiedBadge}>
                                <MaterialCommunityIcons name="check-decagram" size={16} color="#10B981" />
                                <Text style={styles.verifiedText}>Verified Account</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    {stats.map((stat, index) => (
                        <View key={index} style={styles.statCard}>
                            <View style={[styles.statIconContainer, { backgroundColor: stat.color + '20' }]}>
                                <MaterialCommunityIcons name={stat.icon as any} size={24} color={stat.color} />
                            </View>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Account Type */}
                <View style={styles.accountTypeCard}>
                    <View style={styles.accountTypeLeft}>
                        <View style={styles.accountTypeIcon}>
                            <MaterialCommunityIcons name="star" size={24} color="#FFD700" />
                        </View>
                        <View>
                            <Text style={styles.accountTypeTitle}>Premium Advertiser</Text>
                            <Text style={styles.accountTypeSubtitle}>Enjoy exclusive benefits</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.upgradeButton}>
                        <Text style={styles.upgradeButtonText}>Upgrade</Text>
                    </TouchableOpacity>
                </View>

                {/* Menu Items */}
                <View style={styles.menuContainer}>
                    <Text style={styles.sectionTitle}>Settings</Text>
                    {menuItems.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.menuItem}
                            onPress={() => navigation.navigate(item.route)}>
                            <View style={[styles.menuIconContainer, { backgroundColor: item.color + '20' }]}>
                                <MaterialCommunityIcons name={item.icon as any} size={24} color={item.color} />
                            </View>
                            <View style={styles.menuContent}>
                                <Text style={styles.menuTitle}>{item.title}</Text>
                                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <MaterialCommunityIcons name="logout" size={24} color="#EF4444" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

                {/* Version */}
                <Text style={styles.versionText}>Version 1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        backgroundColor: '#fff',
        paddingTop: 10,
        paddingBottom: 25,
        paddingHorizontal: 20,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 16,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: lightTheme.colors.primary,
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: lightTheme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    profileInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    verifiedText: {
        fontSize: 13,
        color: '#10B981',
        fontWeight: '600',
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 20,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
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
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 11,
        color: '#666',
        textAlign: 'center',
    },
    accountTypeCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginBottom: 20,
        padding: 16,
        borderRadius: 16,
        ...lightTheme.shadows.small,
    },
    accountTypeLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    accountTypeIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF9E6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    accountTypeTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    accountTypeSubtitle: {
        fontSize: 13,
        color: '#666',
    },
    upgradeButton: {
        backgroundColor: lightTheme.colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    upgradeButtonText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600',
    },
    menuContainer: {
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 15,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        ...lightTheme.shadows.small,
    },
    menuIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuContent: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    menuSubtitle: {
        fontSize: 13,
        color: '#666',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 10,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#FEE2E2',
        gap: 8,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#EF4444',
    },
    versionText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#999',
        marginVertical: 20,
    },
});

export default ProfileScreen;
