import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { BudgetMode } from '../../../types/budget';
import { t } from '../../../config/i18n';

interface BudgetModeSwitcherProps {
    currentMode: BudgetMode;
    onModeChange: (mode: BudgetMode) => void;
    themeColor: string;
    language?: string;
}

const BudgetModeSwitcher: React.FC<BudgetModeSwitcherProps> = ({
    currentMode,
    onModeChange,
    themeColor,
    language = 'en'
}) => {
    const isDark = useColorScheme() === 'dark';
    const subTextColor = isDark ? '#CCCCCC' : '#666666';

    return (
        <View style={styles.modeRow}>
            <TouchableOpacity
                style={[
                    styles.modeButton,
                    currentMode === 'PLAN' && { backgroundColor: themeColor },
                    { borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }
                ]}
                onPress={() => onModeChange('PLAN')}
            >
                <Text style={[styles.modeButtonText, { color: currentMode === 'PLAN' ? '#FFF' : subTextColor }]}>
                    {t('modePlan', language)}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.modeButton,
                    currentMode === 'REMAINING' && { backgroundColor: themeColor },
                    { borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }
                ]}
                onPress={() => onModeChange('REMAINING')}
            >
                <Text style={[styles.modeButtonText, { color: currentMode === 'REMAINING' ? '#FFF' : subTextColor }]}>
                    {t('modeRemaining', language)}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.modeButton,
                    currentMode === 'INSIGHTS' && { backgroundColor: themeColor },
                    { borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }
                ]}
                onPress={() => onModeChange('INSIGHTS')}
            >
                <Text style={[styles.modeButtonText, { color: currentMode === 'INSIGHTS' ? '#FFF' : subTextColor }]}>
                    {t('modeInsights', language)}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    modeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 16,
        gap: 8,
    },
    modeButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 20,
    },
    modeButtonText: {
        fontSize: 18,
        fontWeight: '600',
    },
});

export default BudgetModeSwitcher;
