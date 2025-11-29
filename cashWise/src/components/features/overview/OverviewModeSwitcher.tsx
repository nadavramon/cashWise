import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';

export type OverviewMode = 'DASHBOARD' | 'SPENDING' | 'LIST';

interface OverviewModeSwitcherProps {
    currentMode: OverviewMode;
    onModeChange: (mode: OverviewMode) => void;
    themeColor: string;
}

const OverviewModeSwitcher: React.FC<OverviewModeSwitcherProps> = ({
    currentMode,
    onModeChange,
    themeColor
}) => {
    const isDarkMode = useColorScheme() === 'dark';
    const textColor = isDarkMode ? '#FFFFFF' : '#333333';

    return (
        <View style={styles.modeRow}>
            <ModeButton
                label="Dashboard"
                active={currentMode === 'DASHBOARD'}
                onPress={() => onModeChange('DASHBOARD')}
                themeColor={themeColor}
                textColor={textColor}
                isDarkMode={isDarkMode}
            />
            <ModeButton
                label="Spending"
                active={currentMode === 'SPENDING'}
                onPress={() => onModeChange('SPENDING')}
                themeColor={themeColor}
                textColor={textColor}
                isDarkMode={isDarkMode}
            />
            <ModeButton
                label="List"
                active={currentMode === 'LIST'}
                onPress={() => onModeChange('LIST')}
                themeColor={themeColor}
                textColor={textColor}
                isDarkMode={isDarkMode}
            />
        </View>
    );
};

interface ModeButtonProps {
    label: string;
    active: boolean;
    onPress: () => void;
    themeColor: string;
    textColor: string;
    isDarkMode: boolean;
}

const ModeButton: React.FC<ModeButtonProps> = ({ label, active, onPress, themeColor, textColor, isDarkMode }) => (
    <TouchableOpacity
        style={[
            styles.modeButton,
            { borderColor: isDarkMode ? '#444' : '#ccc' },
            active && { backgroundColor: themeColor + '20', borderColor: themeColor }
        ]}
        onPress={onPress}
    >
        <Text
            style={[
                styles.modeButtonText,
                { color: textColor },
                active && { color: themeColor, fontWeight: '600' },
            ]}
        >
            {label}
        </Text>
    </TouchableOpacity>
);

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

export default OverviewModeSwitcher;
