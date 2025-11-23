import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import * as Font from 'expo-font';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/components/SplashScreen';

const App = () => {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        async function loadFonts() {
            try {
                await Font.loadAsync({
                    'Poppins-ExtraBold': require('./assets/fonts/Poppins-ExtraBold.ttf'),
                    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
                });
                setFontsLoaded(true);
                // Show splash screen for at least 1.5 seconds after fonts load
                await new Promise(resolve => setTimeout(resolve, 1500));
                setShowSplash(false);
            } catch (error) {
                console.error('Error loading fonts:', error);
                setFontsLoaded(true);
                setShowSplash(false);
            }
        }
        loadFonts();
    }, []);

    // Show simple loading screen before fonts are ready
    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, backgroundColor: '#6200EE' }} />
        );
    }

    // Show proper splash screen with logo after fonts are loaded
    if (showSplash) {
        return <SplashScreen />;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <Provider store={store}>
                    <AppNavigator />
                </Provider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
};

export default App;
