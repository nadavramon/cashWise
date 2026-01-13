import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ViewStyle,
} from "react-native";

export interface ModeOption<T extends string> {
  value: T;
  label: string;
}

interface ModeSwitcherProps<T extends string> {
  modes: ModeOption<T>[];
  currentMode: T;
  onModeChange: (mode: T) => void;
  themeColor: string;
  style?: ViewStyle;
  buttonStyle?: ViewStyle;
  fontSize?: number;
}

interface ModeButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
  themeColor: string;
  textColor: string;
  isDarkMode: boolean;
  buttonStyle?: ViewStyle;
  fontSize?: number;
}

const ModeButton: React.FC<ModeButtonProps> = ({
  label,
  active,
  onPress,
  themeColor,
  textColor,
  isDarkMode,
  buttonStyle,
  fontSize = 14,
}) => (
  <TouchableOpacity
    style={[
      styles.modeButton,
      { borderColor: isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)" },
      active && { backgroundColor: themeColor },
      buttonStyle,
    ]}
    onPress={onPress}
  >
    <Text
      style={[
        styles.modeText,
        { color: textColor, fontSize },
        active && { color: "#FFF", fontWeight: "600" },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

function ModeSwitcher<T extends string>({
  modes,
  currentMode,
  onModeChange,
  themeColor,
  style,
  buttonStyle,
  fontSize,
}: ModeSwitcherProps<T>) {
  const isDarkMode = useColorScheme() === "dark";
  const textColor = isDarkMode ? "#FFFFFF" : "#333333";

  return (
    <View style={[styles.modeContainer, style]}>
      {modes.map((mode) => (
        <ModeButton
          key={mode.value}
          label={mode.label}
          active={currentMode === mode.value}
          onPress={() => onModeChange(mode.value)}
          themeColor={themeColor}
          textColor={textColor}
          isDarkMode={isDarkMode}
          buttonStyle={buttonStyle}
          fontSize={fontSize}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  modeContainer: {
    flexDirection: "row",
    marginBottom: 24,
    gap: 8,
  },
  modeButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  modeText: {
    fontWeight: "600",
  },
});

export default ModeSwitcher;
