import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";

import { Ionicons } from "@expo/vector-icons"; // or similar icon lib

interface OverviewHeaderProps {
  title?: string;
  dateRange?: { fromDate: string; toDate: string };
  themeColor: string;
  onPrev?: () => void;
  onNext?: () => void;
  showArrows?: boolean;
}

const OverviewHeader: React.FC<OverviewHeaderProps> = ({
  title,
  dateRange,
  themeColor,
  onPrev,
  onNext,
  showArrows,
}) => {
  const isDarkMode = useColorScheme() === "dark";
  const textColor = isDarkMode ? "#FFFFFF" : "#333333";
  const subTextColor = isDarkMode ? "#CCCCCC" : "#666666";

  return (
    <View style={styles.headerRow}>
      <View style={styles.titleContainer}>
        {title && (
          <Text style={[styles.headerTitle, { color: textColor }]}>
            {title}
          </Text>
        )}
        <View style={styles.dateRow}>
          {showArrows && onPrev && (
            <TouchableOpacity onPress={onPrev} style={styles.arrowButton}>
              <Ionicons name="chevron-back" size={20} color={subTextColor} />
            </TouchableOpacity>
          )}

          {dateRange && (
            <Text
              style={[
                styles.headerSubtitle,
                { color: subTextColor, marginHorizontal: 8 },
              ]}
            >
              {dateRange.fromDate} → {dateRange.toDate}
            </Text>
          )}

          {showArrows && onNext && (
            <TouchableOpacity onPress={onNext} style={styles.arrowButton}>
              <Ionicons name="chevron-forward" size={20} color={subTextColor} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  titleContainer: {
    alignItems: "center",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "center",
  },
  headerSubtitle: { fontSize: 13 },
  arrowButton: {
    padding: 4,
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default OverviewHeader;
