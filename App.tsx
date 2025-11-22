import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        async function loadFonts() {
            try {
                await Font.loadAsync({
                    'Poppins-ExtraBold': require('./assets/fonts/Poppins-ExtraBold.ttf'),
                    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
                });
                setFontsLoaded(true);
            } catch (error) {
                console.error('Error loading fonts:', error);
                setFontsLoaded(true); // Continue anyway
            }
        }
        loadFonts();
    }, []);

    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#7C3AED" />
            </View>
        );
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

