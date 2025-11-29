import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { BudgetMode } from '../../../types/budget';

interface BudgetModeSwitcherProps {
    currentMode: BudgetMode;
    onModeChange: (mode: BudgetMode) => void;
    themeColor: string;
}

const BudgetModeSwitcher: React.FC<BudgetModeSwitcherProps> = ({
    currentMode,
    onModeChange,
    themeColor
}) => {
    const isDark = useColorScheme() === 'dark';
    const subTextColor = isDark ? '#CCCCCC' : '#666666';

    return (
        <View style={styles.modeRow}>
            {(['PLAN', 'REMAINING', 'INSIGHTS'] as BudgetMode[]).map((m) => (
                <TouchableOpacity
                    key={m}
                    style={[
                        styles.modeButton,
                        currentMode === m && { backgroundColor: themeColor },
                        { borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }
                    ]}
                    onPress={() => onModeChange(m)}
                >
                    <Text
                        style={[
                            styles.modeButtonText,
                            { color: currentMode === m ? '#FFF' : subTextColor },
                        ]}
                    >
                        {m.charAt(0) + m.slice(1).toLowerCase()}
                    </Text>
                </TouchableOpacity>
            ))}
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
