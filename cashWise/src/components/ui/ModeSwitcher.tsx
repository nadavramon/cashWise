import React, { FC } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";

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
  borderColor: string;
  buttonStyle?: ViewStyle;
  fontSize?: number;
}



const ModeButton: FC<ModeButtonProps> = ({
  label,
  active,
  onPress,
  themeColor,
  textColor,
  borderColor,
  buttonStyle,
  fontSize = 14,
}) => (
  <TouchableOpacity
    style={[
      styles.modeButton,
      { borderColor },
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
  const { colors } = useTheme();
  const textColor = colors.textPrimary;

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
          borderColor={colors.border}
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
