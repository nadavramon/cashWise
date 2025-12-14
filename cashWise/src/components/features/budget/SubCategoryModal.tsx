import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  useColorScheme,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import {
  RepoCategoryGroup,
  RepoCategoryItem,
} from "../../../data/categoryRepo";

interface SubCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  activeGroup: RepoCategoryGroup | null;
  onSelect: (item: RepoCategoryItem) => void;
  selectedSubCategory: RepoCategoryItem | null;
}

const SubCategoryModal: React.FC<SubCategoryModalProps> = ({
  visible,
  onClose,
  activeGroup,
  onSelect,
  selectedSubCategory,
}) => {
  const isDark = useColorScheme() === "dark";
  const tabBarHeight = useBottomTabBarHeight();
  const textColor = isDark ? "#FFFFFF" : "#333333";
  const subTextColor = isDark ? "#CCCCCC" : "#666666";
  const modalBg = isDark ? "#1E1E1E" : "#FFFFFF";
  const themeColor = isDark ? "#02C3BD" : "#007CBE";
  const itemBg = isDark ? "#333333" : "#F5F5F5";

  const { width } = Dimensions.get("window");
  const numColumns = 3;
  const gap = 12;
  const padding = 24;
  const availableWidth = width - padding * 2 - gap * (numColumns - 1);
  const itemSize = availableWidth / numColumns;

  if (!visible) return null;

  return (
    <View style={styles.customModalOverlay}>
      <TouchableOpacity
        style={styles.modalBackdrop}
        activeOpacity={1}
        onPress={onClose}
      />

      <View
        style={[
          styles.modalContent,
          {
            backgroundColor: modalBg,
            height: "45%",
            paddingBottom: tabBarHeight + 24, // Add tab bar height to padding
          },
        ]}
      >
        <View style={styles.modalHeader}>
          <Text style={[styles.modalTitle, { color: textColor }]}>
            Select Category
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={subTextColor} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={activeGroup?.items || []}
          keyExtractor={(item) => item.code}
          numColumns={numColumns}
          columnWrapperStyle={{ gap }}
          contentContainerStyle={{ gap, paddingBottom: 24 }}
          renderItem={({ item }) => {
            const isSelected = selectedSubCategory?.code === item.code;
            return (
              <TouchableOpacity
                style={[
                  styles.gridItem,
                  {
                    width: itemSize,
                    height: itemSize,
                    backgroundColor: isSelected ? themeColor + "20" : itemBg,
                    borderColor: isSelected ? themeColor : "transparent",
                    borderWidth: 2,
                  },
                ]}
                onPress={() => onSelect(item)}
              >
                <Ionicons
                  name={(item.icon as any) || "pricetag-outline"}
                  size={28}
                  color={isSelected ? themeColor : subTextColor}
                  style={{ marginBottom: 8 }}
                />
                <Text
                  style={[
                    styles.gridItemText,
                    { color: isSelected ? themeColor : textColor },
                  ]}
                  numberOfLines={2}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  customModalOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  gridItem: {
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  gridItemText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default SubCategoryModal;
