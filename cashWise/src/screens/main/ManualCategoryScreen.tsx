import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useCategories } from "../../context/CategoriesContext";
import { Category } from "../../types/models";
import { SafeAreaView } from "react-native-safe-area-context";
import { t } from "../../config/i18n";
import { useProfile } from "../../context/ProfileContext";

const ManualCategoryScreen: React.FC = () => {
  const { categories, loading, addCategory, deleteCategory, updateCategory } =
    useCategories();
  const { profile } = useProfile();
  const language = profile?.language || "en";

  const [name, setName] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const expenseCategories = categories.filter((c) => c.type === "expense");
  const incomeCategories = categories.filter((c) => c.type === "income");

  const resetForm = () => {
    setName("");
    setType("expense");
    setEditingCategory(null);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert(t("missingName", language), t("enterCategoryName", language));
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: name.trim(),
          type,
        });
      } else {
        await addCategory({ name: name.trim(), type });
      }
      resetForm();
    } catch (e: any) {
      Alert.alert(
        t("error", language),
        e?.message ??
          (editingCategory
            ? t("failedToUpdateCategory", language)
            : t("failedToAddCategory", language)),
      );
    }
  };

  const startEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setType(cat.type === "income" ? "income" : "expense");
  };

  const confirmDelete = (cat: Category) => {
    Alert.alert(
      t("deleteCategory", language),
      t("deleteCategoryConfirm", language).replace("{name}", cat.name),
      [
        { text: t("cancel", language), style: "cancel" },
        {
          text: t("delete", language),
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCategory(cat.id);
              if (editingCategory?.id === cat.id) {
                resetForm();
              }
            } catch (e: any) {
              Alert.alert(
                t("error", language),
                e?.message ?? t("failedToDeleteCategory", language),
              );
            }
          },
        },
      ],
    );
  };

  const submitLabel = editingCategory
    ? t("saveChanges", language)
    : t("addCategory", language);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>{t("category", language)}</Text>

        <View style={styles.addContainer}>
          <Text style={styles.label}>
            {editingCategory
              ? t("editCategory", language)
              : t("newCategory", language)}
          </Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder={t("categoryPlaceholder", language)}
          />
          <View style={styles.typeRow}>
            <TouchableOpacity
              style={[
                styles.typeChip,
                type === "expense" && styles.typeChipSelected,
              ]}
              onPress={() => setType("expense")}
            >
              <Text
                style={[
                  styles.typeChipText,
                  type === "expense" && styles.typeChipTextSelected,
                ]}
              >
                {t("expense", language)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeChip,
                type === "income" && styles.typeChipSelected,
              ]}
              onPress={() => setType("income")}
            >
              <Text
                style={[
                  styles.typeChipText,
                  type === "income" && styles.typeChipTextSelected,
                ]}
              >
                {t("income", language)}
              </Text>
            </TouchableOpacity>
          </View>

          <Button
            title={loading ? `${submitLabel}...` : submitLabel}
            onPress={handleSubmit}
            disabled={loading}
          />

          {editingCategory && (
            <View style={{ marginTop: 8 }}>
              <Button title={t("cancelEdit", language)} onPress={resetForm} />
            </View>
          )}
        </View>

        <Text style={[styles.subtitle, { marginTop: 16 }]}>
          {t("expenseCategories", language)}
        </Text>
        <FlatList
          data={expenseCategories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.name}>{item.name}</Text>
              <View style={styles.rowButtons}>
                <Button
                  title={t("edit", language)}
                  onPress={() => startEdit(item)}
                />
                <Button
                  title={t("delete", language)}
                  color="red"
                  onPress={() => confirmDelete(item)}
                />
              </View>
            </View>
          )}
        />

        <Text style={[styles.subtitle, { marginTop: 16 }]}>
          {t("incomeCategories", language)}
        </Text>
        <FlatList
          data={incomeCategories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.name}>{item.name}</Text>
              <View style={styles.rowButtons}>
                <Button
                  title={t("edit", language)}
                  onPress={() => startEdit(item)}
                />
                <Button
                  title={t("delete", language)}
                  color="red"
                  onPress={() => confirmDelete(item)}
                />
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default ManualCategoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 12 },
  subtitle: { fontSize: 18, fontWeight: "500", marginBottom: 8 },
  addContainer: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 8,
  },
  typeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  typeChipSelected: {
    backgroundColor: "#333",
  },
  typeChipText: { fontSize: 14 },
  typeChipTextSelected: { color: "#fff" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  name: { fontSize: 16 },
  rowButtons: {
    flexDirection: "row",
    gap: 8,
  },
});
