import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { loadUser } from '../store/slices/authSlice';

// Import screens (we'll create these next)
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import AdvertiserHomeScreen from '../screens/advertiser/HomeScreen';
import MapSearchScreen from '../screens/advertiser/MapSearchScreen';
import BillboardDetailScreen from '../screens/advertiser/BillboardDetailScreen';
import LocationSelectionScreen from '../screens/advertiser/LocationSelectionScreen';
import BookingsScreen from '../screens/advertiser/BookingsScreen';
import ProfileScreen from '../screens/common/ProfileScreen';
import OwnerDashboardScreen from '../screens/owner/DashboardScreen';
import MyListingsScreen from '../screens/owner/MyListingsScreen';
import AddListingScreen from '../screens/owner/AddListingScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack
const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
);

// Advertiser Tab Navigator
const AdvertiserTabs = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: '#6200EE',
            tabBarIcon: ({ color, size }) => {
                let iconName: keyof typeof MaterialCommunityIcons.glyphMap = 'circle';

                if (route.name === 'Search') {
                    iconName = 'magnify';
                } else if (route.name === 'MyBookings') {
                    iconName = 'calendar-clock';
                } else if (route.name === 'Profile') {
                    iconName = 'account';
                }

                return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
            },
        })}>
        <Tab.Screen
            name="Search"
            component={AdvertiserHomeScreen}
            options={{ title: 'Find Billboards' }}
        />
        <Tab.Screen
            name="MyBookings"
            component={BookingsScreen}
            options={{ title: 'My Bookings' }}
        />
        <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: 'Profile' }}
        />
    </Tab.Navigator>
);

// Owner Tab Navigator
const OwnerTabs = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            headerShown: true,
            tabBarActiveTintColor: '#6200EE',
            tabBarIcon: ({ color, size }) => {
                let iconName: keyof typeof MaterialCommunityIcons.glyphMap = 'circle';

                if (route.name === 'Dashboard') {
                    iconName = 'view-dashboard';
                } else if (route.name === 'Listings') {
                    iconName = 'view-list';
                } else if (route.name === 'Profile') {
                    iconName = 'account';
                }

                return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
            },
        })}>
        <Tab.Screen
            name="Dashboard"
            component={OwnerDashboardScreen}
            options={{ title: 'Dashboard' }}
        />
        <Tab.Screen
            name="Listings"
            component={MyListingsScreen}
            options={{ title: 'My Billboards' }}
        />
        <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: 'Profile' }}
        />
    </Tab.Navigator>
);

// Main App Navigator
const AppNavigator = () => {
    const { isAuthenticated, user } = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();

    useEffect(() => {
        // Load user on app start
        dispatch(loadUser());
    }, [dispatch]);

    return (
        <NavigationContainer>
            {!isAuthenticated ? (
                <AuthStack />
            ) : user?.userType === 'owner' ? (
                <Stack.Navigator>
                    <Stack.Screen
                        name="OwnerMain"
                        component={OwnerTabs}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="AddListing"
                        component={AddListingScreen}
                        options={{ title: 'Add Billboard' }}
                    />
                </Stack.Navigator>
            ) : (
                <Stack.Navigator>
                    <Stack.Screen
                        name="LocationSelection"
                        component={LocationSelectionScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="AdvertiserMain"
                        component={AdvertiserTabs}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="BillboardDetail"
                        component={BillboardDetailScreen}
                        options={{ title: 'Billboard Details' }}
                    />
                    <Stack.Screen
                        name="MapSearch"
                        component={MapSearchScreen}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            )}
        </NavigationContainer>
    );
};

export default AppNavigator;
