import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Booking } from '../types';
import { lightTheme } from '../theme';

interface BookingTimelineProps {
    booking: Booking;
}

const BookingTimeline: React.FC<BookingTimelineProps> = ({ booking }) => {
    const steps = [
        {
            id: 'confirmed',
            label: 'Booking Confirmed',
            isActive: booking.status !== 'cancelled',
            date: booking.createdAt,
        },
        {
            id: 'payment',
            label: 'Payment',
            isActive: !!booking.paymentId && booking.status !== 'cancelled',
            date: booking.paymentId ? 'Paid' : null,
        },
        {
            id: 'installation',
            label: 'Installation',
            isActive: booking.creativeApproved && booking.status !== 'cancelled',
            date: booking.startDate,
        },
        {
            id: 'end',
            label: 'End Date',
            isActive: booking.status === 'completed' || (new Date(booking.endDate) < new Date()),
            date: booking.endDate,
        },
    ];

    return (
        <View style={styles.container}>
            {steps.map((step, index) => (
                <View key={step.id} style={styles.stepContainer}>
                    {/* Line connector */}
                    {index < steps.length - 1 && (
                        <View
                            style={[
                                styles.line,
                                steps[index + 1].isActive && styles.lineActive,
                            ]}
                        />
                    )}

                    {/* Step Indicator */}
                    <View
                        style={[
                            styles.indicator,
                            step.isActive && styles.indicatorActive,
                        ]}>
                        {step.isActive && <Text style={styles.checkmark}>✓</Text>}
                    </View>

                    {/* Step Label */}
                    <View style={styles.labelContainer}>
                        <Text
                            style={[
                                styles.label,
                                step.isActive && styles.labelActive,
                            ]}>
                            {step.label}
                        </Text>
                        {step.date && (
                            <Text style={styles.date}>
                                {step.date === 'Paid' ? 'Paid' : new Date(step.date).toLocaleDateString()}
                            </Text>
                        )}
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: lightTheme.spacing.md,
        paddingHorizontal: lightTheme.spacing.xs,
    },
    stepContainer: {
        alignItems: 'center',
        flex: 1,
        position: 'relative',
    },
    line: {
        position: 'absolute',
        top: 12,
        left: '50%',
        right: -50, // Extend to next step
        height: 2,
        backgroundColor: lightTheme.colors.border,
        zIndex: -1,
        width: '100%',
    },
    lineActive: {
        backgroundColor: lightTheme.colors.success,
    },
    indicator: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: lightTheme.colors.border,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: lightTheme.spacing.xs,
        borderWidth: 2,
        borderColor: lightTheme.colors.background,
    },
    indicatorActive: {
        backgroundColor: lightTheme.colors.success,
    },
    checkmark: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    labelContainer: {
        alignItems: 'center',
    },
    label: {
        ...lightTheme.typography.caption,
        color: lightTheme.colors.textSecondary,
        textAlign: 'center',
        fontSize: 10,
    },
    labelActive: {
        color: lightTheme.colors.text,
        fontWeight: '600',
    },
    date: {
        ...lightTheme.typography.caption,
        color: lightTheme.colors.textSecondary,
        fontSize: 9,
        marginTop: 2,
    },
});

export default BookingTimeline;
