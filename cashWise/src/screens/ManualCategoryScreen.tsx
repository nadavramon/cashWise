import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useCategories } from '../store/CategoriesContext';
import { Category } from '../types/models';
import { SafeAreaView } from 'react-native-safe-area-context';

const ManualCategoryScreen: React.FC = () => {
  const { categories, loading, addCategory, deleteCategory, updateCategory } =
    useCategories();

  const [name, setName] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const expenseCategories = categories.filter((c) => c.type === 'expense');
  const incomeCategories = categories.filter((c) => c.type === 'income');

  const resetForm = () => {
    setName('');
    setType('expense');
    setEditingCategory(null);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Missing name', 'Please enter a category name.');
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
        'Error',
        e?.message ??
        (editingCategory
          ? 'Failed to update category.'
          : 'Failed to add category.'),
      );
    }
  };

  const startEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setType(cat.type === 'income' ? 'income' : 'expense');
  };

  const confirmDelete = (cat: Category) => {
    Alert.alert(
      'Delete category',
      `Are you sure you want to delete "${cat.name}"? Existing transactions will still reference it.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCategory(cat.id);
              if (editingCategory?.id === cat.id) {
                resetForm();
              }
            } catch (e: any) {
              Alert.alert('Error', e?.message ?? 'Failed to delete category.');
            }
          },
        },
      ],
    );
  };

  const submitLabel = editingCategory ? 'Save changes' : 'Add Category';

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Categories</Text>

        <View style={styles.addContainer}>
          <Text style={styles.label}>
            {editingCategory ? 'Edit category' : 'New category'}
          </Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Groceries"
          />
          <View style={styles.typeRow}>
            <TouchableOpacity
              style={[
                styles.typeChip,
                type === 'expense' && styles.typeChipSelected,
              ]}
              onPress={() => setType('expense')}
            >
              <Text
                style={[
                  styles.typeChipText,
                  type === 'expense' && styles.typeChipTextSelected,
                ]}
              >
                Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeChip,
                type === 'income' && styles.typeChipSelected,
              ]}
              onPress={() => setType('income')}
            >
              <Text
                style={[
                  styles.typeChipText,
                  type === 'income' && styles.typeChipTextSelected,
                ]}
              >
                Income
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
              <Button title="Cancel edit" onPress={resetForm} />
            </View>
          )}
        </View>

        <Text style={[styles.subtitle, { marginTop: 16 }]}>Expense Categories</Text>
        <FlatList
          data={expenseCategories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.name}>{item.name}</Text>
              <View style={styles.rowButtons}>
                <Button title="Edit" onPress={() => startEdit(item)} />
                <Button
                  title="Delete"
                  color="red"
                  onPress={() => confirmDelete(item)}
                />
              </View>
            </View>
          )}
        />

        <Text style={[styles.subtitle, { marginTop: 16 }]}>Income Categories</Text>
        <FlatList
          data={incomeCategories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.name}>{item.name}</Text>
              <View style={styles.rowButtons}>
                <Button title="Edit" onPress={() => startEdit(item)} />
                <Button
                  title="Delete"
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
  title: { fontSize: 22, fontWeight: '600', marginBottom: 12 },
  subtitle: { fontSize: 18, fontWeight: '500', marginBottom: 8 },
  addContainer: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 8,
  },
  typeRow: {
    flexDirection: 'row',
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
    backgroundColor: '#333',
  },
  typeChipText: { fontSize: 14 },
  typeChipTextSelected: { color: '#fff' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  name: { fontSize: 16 },
  rowButtons: {
    flexDirection: 'row',
    gap: 8,
  },
});
