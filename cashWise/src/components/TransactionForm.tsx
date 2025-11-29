import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Switch,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCategories } from '../store/CategoriesContext';
import { useTransactions } from '../store/TransactionsContext';
import { t } from '../utils/i18n';
import { useProfile } from '../store/ProfileContext';

const todayAsString = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = `${d.getMonth() + 1}`.padStart(2, '0');
  const dd = `${d.getDate()}`.padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

interface TransactionFormProps {
  initialDate?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  initialDate,
  onSuccess,
  onCancel,
}) => {
  const { addTransaction } = useTransactions();
  const { categories } = useCategories();
  const { profile } = useProfile();
  const language = profile?.language || 'en';
  const isDark = useColorScheme() === 'dark';

  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [date, setDate] = useState(initialDate ?? todayAsString());
  const [note, setNote] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const themeColor = isDark ? '#02C3BD' : '#007CBE';
  const textColor = isDark ? '#FFFFFF' : '#333333';
  const subTextColor = isDark ? '#CCCCCC' : '#666666';
  const inputBg = isDark ? '#333333' : '#F5F5F5';

  const filteredCategories = categories
    .filter((c) => c.type === type || c.type === 'both')
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleSave = async () => {
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert(t('pleaseEnterPositiveAmount', language));
      return;
    }

    if (!categoryId) {
      alert(t('pleaseSelectCategory', language));
      return;
    }

    if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      alert(t('invalidDateFormat', language));
      return;
    }

    try {
      setSubmitting(true);
      await addTransaction({
        type,
        amount: parsedAmount,
        categoryId,
        date,
        note: note.trim() || '',
      });
      onSuccess?.();
    } catch (e: any) {
      alert(e?.message ?? t('failedToSave', language));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.flexContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={subTextColor} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: textColor }]}>{t('newTransaction', language)}</Text>
            <View style={styles.headerRightPlaceholder} />
          </View>

          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Type Selector */}
            <View style={[styles.typeSelector, { backgroundColor: inputBg }]}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === 'expense' && { backgroundColor: '#ff6b6b' },
                ]}
                onPress={() => setType('expense')}
              >
                <Text
                  style={[
                    styles.typeText,
                    type === 'expense' ? { color: '#fff' } : { color: subTextColor },
                  ]}
                >
                  {t('expense', language)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === 'income' && { backgroundColor: '#1dd1a1' },
                ]}
                onPress={() => setType('income')}
              >
                <Text
                  style={[
                    styles.typeText,
                    type === 'income' ? { color: '#fff' } : { color: subTextColor },
                  ]}
                >
                  {t('income', language)}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Amount */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: subTextColor }]}>{t('amount', language)}</Text>
              <TextInput
                style={[styles.input, { color: textColor, backgroundColor: inputBg }]}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor={subTextColor}
              />
            </View>

            {/* Category */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: subTextColor }]}>{t('category', language)}</Text>
              <View style={styles.categoryContainer}>
                {filteredCategories.map((c) => {
                  const isSelected = categoryId === c.id;
                  const baseColor = c.color ?? (type === 'income' ? '#1dd1a1' : '#ff6b6b');
                  return (
                    <TouchableOpacity
                      key={c.id}
                      style={[
                        styles.categoryChip,
                        {
                          borderColor: isSelected ? baseColor : subTextColor + '40',
                          backgroundColor: isSelected ? baseColor + '20' : 'transparent'
                        },
                      ]}
                      onPress={() => setCategoryId(c.id)}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          { color: isSelected ? baseColor : textColor },
                        ]}
                      >
                        {c.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Note */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: subTextColor }]}>{t('note', language)}</Text>
              <TextInput
                style={[styles.input, { color: textColor, backgroundColor: inputBg, height: 80 }]}
                value={note}
                onChangeText={setNote}
                multiline
                placeholder={t('notePlaceholder', language)}
                placeholderTextColor={subTextColor}
                textAlignVertical="top"
              />
            </View>

            {/* Date */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: subTextColor }]}>{t('date', language)}</Text>
              <TextInput
                style={[styles.input, { color: textColor, backgroundColor: inputBg }]}
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={subTextColor}
              />
            </View>

            {/* Recurring (Placeholder) */}
            <View style={[styles.row, styles.section, { justifyContent: 'space-between', alignItems: 'center' }]}>
              <Text style={[styles.label, { color: textColor, marginBottom: 0 }]}>{t('recurringTransaction', language)}</Text>
              <Switch
                value={isRecurring}
                onValueChange={setIsRecurring}
                trackColor={{ false: '#767577', true: themeColor }}
                thumbColor={isRecurring ? '#fff' : '#f4f3f4'}
              />
            </View>
            {isRecurring && (
              <Text style={{ color: subTextColor, fontSize: 12, marginTop: -10, marginBottom: 20 }}>
                {t('featureComingSoon', language)}
              </Text>
            )}

            {/* Save Button */}
            <TouchableOpacity
              style={[
                styles.saveButton,
                { backgroundColor: themeColor, opacity: submitting ? 0.7 : 1 }
              ]}
              onPress={handleSave}
              disabled={submitting}
            >
              <Text style={styles.saveButtonText}>
                {submitting ? t('saving', language) : t('saveChanges', language)}
              </Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default TransactionForm;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  flexContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerRightPlaceholder: {
    width: 32,
  },
  container: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  typeText: {
    fontWeight: '600',
    fontSize: 14,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
  },
  saveButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
