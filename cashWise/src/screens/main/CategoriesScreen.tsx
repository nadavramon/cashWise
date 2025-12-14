import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context"; // Import SafeAreaView

import { useCategories } from "../../context/CategoriesContext";
import { CATEGORY_REPO, RepoCategoryItem } from "../../data/categoryRepo";
import { Category } from "../../types/models";

const isItemAlreadyAdded = (
  categories: Category[],
  item: RepoCategoryItem,
): boolean => {
  return categories.some(
    (c) =>
      c.name.toLowerCase() === item.label.toLowerCase() &&
      (c.type === item.type || c.type === "both"),
  );
};

const CategoriesScreen: React.FC = () => {
  const navigation = useNavigation();
  const { categories, loading, addCategoryFromRepo } = useCategories();
  const isDark = useColorScheme() === "dark";

  const handleAddManual = () => {
    navigation.navigate("ManualCategory" as never);
  };

  const handleRepoItemPress = async (
    groupId: string,
    item: RepoCategoryItem,
  ) => {
    try {
      await addCategoryFromRepo(groupId, item);
    } catch (e) {
      console.warn("Failed to add repo category", e);
    }
  };

  // Dynamic Styles
  const textColor = isDark ? "#FFFFFF" : "#000000";
  const subTextColor = isDark ? "#CCCCCC" : "#555555";
  const buttonBg = isDark ? "#333333" : "#f5f5f5";
  const buttonBorder = isDark ? "#555555" : "#cccccc";
  const backButtonColor = isDark ? "#FFFFFF" : "#007AFF";

  return (
    // Changed View to SafeAreaView to respect notch/home indicator
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={[styles.backText, { color: backButtonColor }]}>
            {"<"} Tools
          </Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: textColor }]}>Categories</Text>
      </View>

      <View style={styles.manualWrapper}>
        <TouchableOpacity
          style={[
            styles.manualButton,
            { backgroundColor: buttonBg, borderColor: buttonBorder },
          ]}
          onPress={handleAddManual}
        >
          <Text style={[styles.manualButtonText, { color: textColor }]}>
            + Add category manually
          </Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={textColor} />
          <Text style={[styles.loadingText, { color: subTextColor }]}>
            Loading categories…
          </Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {CATEGORY_REPO.map((group) => (
          <View key={group.id} style={styles.groupContainer}>
            <View style={styles.groupHeaderRow}>
              <View
                style={[styles.groupColorDot, { backgroundColor: group.color }]}
              />
              <Text style={[styles.groupTitle, { color: textColor }]}>
                {group.title}
              </Text>
            </View>

            <View style={styles.itemsRow}>
              {group.items.map((item) => {
                const added = isItemAlreadyAdded(categories, item);

                return (
                  <TouchableOpacity
                    key={item.code}
                    style={[
                      styles.itemChip,
                      { borderColor: group.color },
                      added && [
                        styles.itemChipAdded,
                        { backgroundColor: group.color + "20" },
                      ],
                    ]}
                    onPress={() => handleRepoItemPress(group.id, item)}
                    disabled={added}
                  >
                    <Text
                      style={[
                        styles.itemLabel,
                        { color: textColor },
                        added && styles.itemLabelAdded,
                      ]}
                    >
                      {item.label}
                      {added ? " ✓" : ""}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CategoriesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  backButton: {
    paddingRight: 12,
    paddingVertical: 4,
  },
  backText: {
    fontSize: 14,
    // color removed here, handled inline
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
  },
  manualWrapper: {
    marginBottom: 12,
  },
  manualButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  manualButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  groupContainer: {
    marginBottom: 16,
  },
  groupHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  groupColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  itemsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  itemChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 4,
  },
  itemChipAdded: {},
  itemLabel: {
    fontSize: 13,
  },
  itemLabelAdded: {
    fontWeight: "600",
  },
});
