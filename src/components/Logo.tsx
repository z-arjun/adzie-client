import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface LogoProps {
    size?: 'small' | 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({ size = 'large' }) => {
    const fontSize = size === 'small' ? 32 : size === 'medium' ? 48 : 72;

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Text style={[styles.logoPart1, { fontSize }]}>
                    ad
                </Text>
                <Text style={[styles.logoPart2, { fontSize }]}>
                    zie
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    logoPart1: {
        fontFamily: 'Poppins-Bold',
        color: '#FFFFFF',
        letterSpacing: 1,
        textTransform: 'lowercase',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    logoPart2: {
        fontFamily: 'Poppins-ExtraBold',
        color: '#FFFFFF',
        letterSpacing: 2,
        textTransform: 'lowercase',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
});

export default Logo;
