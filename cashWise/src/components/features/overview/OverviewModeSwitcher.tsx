import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { t } from '../../../config/i18n';

export type OverviewMode = 'DASHBOARD' | 'SPENDING' | 'LIST';

interface OverviewModeSwitcherProps {
    currentMode: OverviewMode;
    onModeChange: (mode: OverviewMode) => void;
    themeColor: string;
    language?: string;
}

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
            { borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' },
            active && { backgroundColor: themeColor }
        ]}
        onPress={onPress}
    >
        <Text
            style={[
                styles.modeText,
                { color: textColor },
                active && { color: '#FFF', fontWeight: '600' },
            ]}
        >
            {label}
        </Text>
    </TouchableOpacity>
);

const OverviewModeSwitcher: React.FC<OverviewModeSwitcherProps> = ({
    currentMode,
    onModeChange,
    themeColor,
    language = 'en'
}) => {
    const isDarkMode = useColorScheme() === 'dark';
    const subTextColor = isDarkMode ? '#FFFFFF' : '#333333';

    return (
        <View style={styles.modeContainer}>
            <ModeButton
                label={t('modeDashboard', language)}
                active={currentMode === 'DASHBOARD'}
                onPress={() => onModeChange('DASHBOARD')}
                themeColor={themeColor}
                textColor={subTextColor}
                isDarkMode={isDarkMode}
            />
            <ModeButton
                label={t('modeSpending', language)}
                active={currentMode === 'SPENDING'}
                onPress={() => onModeChange('SPENDING')}
                themeColor={themeColor}
                textColor={subTextColor}
                isDarkMode={isDarkMode}
            />
            <ModeButton
                label={t('modeList', language)}
                active={currentMode === 'LIST'}
                onPress={() => onModeChange('LIST')}
                themeColor={themeColor}
                textColor={subTextColor}
                isDarkMode={isDarkMode}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    modeContainer: {
        flexDirection: 'row',
        marginBottom: 24,
        gap: 8,
    },
    modeButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    modeText: {
        fontSize: 14,
        fontWeight: '600',
    },
});

export default OverviewModeSwitcher;
