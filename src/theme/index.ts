export const colors = {
    // Primary palette
    primary: '#6200EE',
    primaryLight: '#BB86FC',
    primaryDark: '#3700B3',

    // Secondary palette
    secondary: '#03DAC6',
    secondaryLight: '#66FFF9',
    secondaryDark: '#00A896',

    // Semantic colors
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',

    // Neutral colors - Light theme
    light: {
        background: '#FFFFFF',
        surface: '#F5F5F5',
        card: '#FFFFFF',
        text: '#000000',
        textSecondary: '#666666',
        border: '#E0E0E0',
        disabled: '#BDBDBD',
        placeholder: '#9E9E9E',
    },

    // Neutral colors - Dark theme
    dark: {
        background: '#121212',
        surface: '#1E1E1E',
        card: '#2C2C2C',
        text: '#FFFFFF',
        textSecondary: '#B0B0B0',
        border: '#3A3A3A',
        disabled: '#4A4A4A',
        placeholder: '#707070',
    },
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const borderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 999,
};

export const typography = {
    h1: {
        fontSize: 32,
        fontWeight: '700' as const,
        lineHeight: 40,
    },
    h2: {
        fontSize: 28,
        fontWeight: '700' as const,
        lineHeight: 36,
    },
    h3: {
        fontSize: 24,
        fontWeight: '600' as const,
        lineHeight: 32,
    },
    h4: {
        fontSize: 20,
        fontWeight: '600' as const,
        lineHeight: 28,
    },
    h5: {
        fontSize: 18,
        fontWeight: '600' as const,
        lineHeight: 24,
    },
    body1: {
        fontSize: 16,
        fontWeight: '400' as const,
        lineHeight: 24,
    },
    body2: {
        fontSize: 14,
        fontWeight: '400' as const,
        lineHeight: 20,
    },
    caption: {
        fontSize: 12,
        fontWeight: '400' as const,
        lineHeight: 16,
    },
    button: {
        fontSize: 16,
        fontWeight: '600' as const,
        lineHeight: 24,
    },
};

export const shadows = {
    small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    large: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
};

export type Theme = {
    colors: typeof colors.light & {
        primary: string;
        secondary: string;
        success: string;
        warning: string;
        error: string;
        info: string;
    };
    spacing: typeof spacing;
    borderRadius: typeof borderRadius;
    typography: typeof typography;
    shadows: typeof shadows;
};

export const lightTheme: Theme = {
    colors: {
        ...colors.light,
        primary: colors.primary,
        secondary: colors.secondary,
        success: colors.success,
        warning: colors.warning,
        error: colors.error,
        info: colors.info,
    },
    spacing,
    borderRadius,
    typography,
    shadows,
};

export const darkTheme: Theme = {
    colors: {
        ...colors.dark,
        primary: colors.primaryLight,
        secondary: colors.secondary,
        success: colors.success,
        warning: colors.warning,
        error: colors.error,
        info: colors.info,
    },
    spacing,
    borderRadius,
    typography,
    shadows,
};
