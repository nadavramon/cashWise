import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TransactionsStackParamList } from '../../navigation/TransactionsStack';
import { useTransactions } from '../../context/TransactionsContext';
import { useCategories } from '../../context/CategoriesContext';
import { Transaction } from '../../types/models';
import { t } from '../../config/i18n';
import { useProfile } from '../../context/ProfileContext';

type Props = NativeStackScreenProps<
  TransactionsStackParamList,
  'EditTransaction'
>;

const EditTransactionScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id, date } = route.params;
  const { transactions, updateTransaction } = useTransactions();
  const { categories } = useCategories();
  const { profile } = useProfile();
  const language = profile?.language || 'en';

  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [includeInStats, setIncludeInStats] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const transaction: Transaction | undefined = useMemo(
    () => transactions.find((t) => t.id === id && t.date === date),
    [transactions, id, date],
  );

  useEffect(() => {
    if (!transaction) return;

    setType(transaction.type === 'income' ? 'income' : 'expense');
    setAmount(String(transaction.amount));
    setCategoryId(transaction.categoryId);
    setNote(transaction.note ?? '');
    setIncludeInStats(transaction.includeInStats);
  }, [transaction]);

  const filteredCategories = useMemo(() => {
    return categories
      .filter((c) => c.type === type || c.type === 'both')
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [categories, type]);

  const handleSave = async () => {
    if (!transaction) return;

    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert(t('invalidAmount', language), t('pleaseEnterPositiveAmount', language));
      return;
    }

    if (!categoryId) {
      Alert.alert(t('missingCategory', language), t('pleaseSelectCategory', language));
      return;
    }

    try {
      setSubmitting(true);

      await updateTransaction(transaction.id, transaction.date, {
        type,
        amount: parsedAmount,
        categoryId,
        note: note.trim(),
        includeInStats,
      });

      navigation.goBack();
    } catch (e: any) {
      Alert.alert(
        t('error', language),
        e?.message ?? t('failedToUpdate', language),
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!transaction) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {t('transactionNotFound', language)}
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.label}>Type</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.chip, type === 'expense' && styles.chipSelected]}
              onPress={() => setType('expense')}
            >
              <Text
                style={[
                  styles.chipText,
                  type === 'expense' && styles.chipTextSelected,
                ]}
              >
                {t('expense', language)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.chip, type === 'income' && styles.chipSelected]}
              onPress={() => setType('income')}
            >
              <Text
                style={[
                  styles.chipText,
                  type === 'income' && styles.chipTextSelected,
                ]}
              >
                {t('income', language)}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>{t('amount', language)}</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="e.g. 120.50"
          />

          <Text style={styles.label}>{t('date', language)}</Text>
          <Text style={styles.readonlyValue}>{transaction.date}</Text>

          <Text style={styles.label}>{t('category', language)}</Text>
          <View style={styles.categoryContainer}>
            {filteredCategories.map((c) => {
              const baseColor = c.color ?? (c.type === 'income' ? '#0a7f42' : '#b00020');
              const isSelected = categoryId === c.id;
              return (
                <TouchableOpacity
                  key={c.id}
                  style={[
                    styles.categoryChip,
                    { borderColor: baseColor },
                    isSelected && [{ backgroundColor: baseColor + '20' }],
                  ]}
                  onPress={() => setCategoryId(c.id)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      isSelected && { color: baseColor, fontWeight: '600' },
                    ]}
                  >
                    {c.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>{t('note', language)} (optional)</Text>
          <TextInput
            style={[styles.input, { height: 60 }]}
            value={note}
            onChangeText={setNote}
            multiline
          />

          <View style={[styles.row, { marginTop: 16, alignItems: 'center' }]}>
            <Text style={styles.label}>{t('includeInStats', language)}</Text>
            <Button
              title={includeInStats ? t('yes', language) : t('no', language)}
              onPress={() => setIncludeInStats((prev) => !prev)}
            />
          </View>

          <View style={{ marginTop: 24 }}>
            <Button
              title={submitting ? t('saving', language) : t('saveChanges', language)}
              onPress={handleSave}
              disabled={submitting}
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default EditTransactionScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  center: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#b00020',
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipSelected: {
    backgroundColor: '#333',
  },
  chipText: {
    fontSize: 14,
  },
  chipTextSelected: {
    color: '#fff',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 6,
  },
  categoryChipSelected: {
    backgroundColor: '#333',
  },
  categoryChipText: {
    fontSize: 14,
  },
  categoryChipTextSelected: {
    color: '#fff',
  },
  readonlyValue: {
    fontSize: 16,
    paddingVertical: 6,
  },
});
