import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Logo from './Logo';

const SplashScreen: React.FC = () => {
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    return (
        <View style={styles.container}>
            <Animated.View style={{ opacity: fadeAnim }}>
                <Logo size="large" />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#6200EE',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SplashScreen;
