import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import { useProfile } from '../store/ProfileContext';
import { I18nManager } from 'react-native';
import * as Updates from 'expo-updates';
import { t, isRTL } from '../utils/i18n';

const ProfileScreen: React.FC = () => {
  const { profile, loading, saveProfile } = useProfile();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [currency, setCurrency] = useState('ILS');
  const [defaultPreset, setDefaultPreset] = useState('THIS_MONTH');
  const [language, setLanguage] = useState('en');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setFirstName(profile.firstName ?? '');
    setLastName(profile.lastName ?? '');
    setCurrency(profile.currency ?? 'ILS');
    setDefaultPreset(profile.defaultDateRangePreset ?? 'THIS_MONTH');
    setLanguage(profile.language ?? 'en');
  }, [profile]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const patch = {
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        currency: currency.trim() || undefined,
        overviewDateRangePreset: defaultPreset as any,
        language: language.trim() || undefined,
      };

      await saveProfile(patch);

      // Handle RTL change
      const newIsRTL = isRTL(language);
      if (newIsRTL !== I18nManager.isRTL) {
        I18nManager.allowRTL(newIsRTL);
        I18nManager.forceRTL(newIsRTL);
        Alert.alert(
          t('saved', language),
          t('profileUpdated', language) + ' App will reload to apply language changes.',
          [
            {
              text: 'OK',
              onPress: async () => {
                try {
                  await Updates.reloadAsync();
                } catch (error) {
                  // Fallback for dev mode where reloadAsync might fail or not be available
                  console.warn('Reload not supported in this environment', error);
                }
              }
            }
          ]
        );
      } else {
        Alert.alert(t('saved', language), t('profileUpdated', language));
      }

    } catch (e: any) {
      Alert.alert(t('error', language), e?.message ?? t('failedToSave', language));
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('profileSettings', language)}</Text>

      {loading && !profile ? (
        <Text>{t('loading', language)}</Text>
      ) : (
        <>
          <Text style={styles.label}>{t('email', language)}</Text>
          <Text style={styles.readonly}>{profile?.email ?? '-'}</Text>

          <Text style={styles.label}>{t('firstName', language)}</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            textAlign={isRTL(language) ? 'right' : 'left'}
          />

          <Text style={styles.label}>{t('lastName', language)}</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            textAlign={isRTL(language) ? 'right' : 'left'}
          />

          <Text style={styles.label}>{t('currency', language)}</Text>
          <TextInput
            style={styles.input}
            value={currency}
            onChangeText={setCurrency}
            placeholder="e.g. ILS, USD, EUR"
            textAlign={isRTL(language) ? 'right' : 'left'}
          />

          <Text style={styles.label}>{t('defaultDateRange', language)}</Text>
          <TextInput
            style={styles.input}
            value={defaultPreset}
            onChangeText={setDefaultPreset}
            placeholder="THIS_MONTH / LAST_MONTH / THIS_WEEK"
            textAlign={isRTL(language) ? 'right' : 'left'}
          />

          <Text style={styles.label}>{t('language', language)}</Text>
          <View style={styles.languageRow}>
            <Button
              title="English"
              onPress={() => setLanguage('en')}
              color={language === 'en' ? '#007AFF' : '#8E8E93'}
            />
            <Button
              title="עברית"
              onPress={() => setLanguage('he')}
              color={language === 'he' ? '#007AFF' : '#8E8E93'}
            />
          </View>

          <View style={{ marginTop: 16 }}>
            <Button
              title={saving ? t('saving', language) : t('save', language)}
              onPress={handleSave}
              disabled={saving}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '500', marginTop: 12, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  readonly: { fontSize: 16, paddingVertical: 4 },
  languageRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
    marginBottom: 8,
  },
});
