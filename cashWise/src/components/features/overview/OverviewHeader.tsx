import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';

interface OverviewHeaderProps {
    title?: string;
    dateRange?: { fromDate: string; toDate: string };
    themeColor: string;
}

const OverviewHeader: React.FC<OverviewHeaderProps> = ({ title, dateRange, themeColor }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const textColor = isDarkMode ? '#FFFFFF' : '#333333';
    const subTextColor = isDarkMode ? '#CCCCCC' : '#666666';

    return (
        <View style={styles.headerRow}>
            <View style={styles.titleContainer}>
                {title && (
                    <Text style={[styles.headerTitle, { color: textColor }]}>{title}</Text>
                )}
                {dateRange && (
                    <Text style={[styles.headerSubtitle, { color: subTextColor }]}>
                        {dateRange.fromDate} → {dateRange.toDate}
                    </Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    titleContainer: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 4,
        textAlign: 'center',
    },
    headerSubtitle: { fontSize: 13 },
    addButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
});

export default OverviewHeader;
