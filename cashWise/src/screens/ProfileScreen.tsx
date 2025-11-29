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
        defaultDateRangePreset: defaultPreset,
        language: language.trim() || undefined,
      };
      console.log('Saving profile patch', patch);
      await saveProfile(patch);
      Alert.alert('Saved', 'Profile updated.');
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile & Settings</Text>

      {loading && !profile ? (
        <Text>Loading profile...</Text>
      ) : (
        <>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.readonly}>{profile?.email ?? '-'}</Text>

          <Text style={styles.label}>First name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
          />

          <Text style={styles.label}>Last name</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
          />

          <Text style={styles.label}>Currency</Text>
          <TextInput
            style={styles.input}
            value={currency}
            onChangeText={setCurrency}
            placeholder="e.g. ILS, USD, EUR"
          />

          <Text style={styles.label}>Default date range preset</Text>
          <TextInput
            style={styles.input}
            value={defaultPreset}
            onChangeText={setDefaultPreset}
            placeholder="THIS_MONTH / LAST_MONTH / THIS_WEEK"
          />

          <Text style={styles.label}>Language</Text>
          <TextInput
            style={styles.input}
            value={language}
            onChangeText={setLanguage}
            placeholder="en / he etc."
          />

          <View style={{ marginTop: 16 }}>
            <Button
              title={saving ? 'Saving...' : 'Save'}
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
});
