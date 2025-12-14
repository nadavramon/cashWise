import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  useColorScheme,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useProfile } from "../../context/ProfileContext";
import { I18nManager } from "react-native";
import * as Updates from "expo-updates";
import { t, isRTL } from "../../config/i18n";
import { DateRangePresetApi } from "../../api/profileApi";

const ProfileScreen: React.FC = () => {
  const { profile, loading, saveProfile } = useProfile();
  const isDarkMode = useColorScheme() === "dark";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [currency, setCurrency] = useState("ILS");
  const [startDay, setStartDay] = useState("1");
  const [defaultPreset, setDefaultPreset] =
    useState<DateRangePresetApi>("CURRENT_CYCLE");
  const [language, setLanguage] = useState("en");
  const [saving, setSaving] = useState(false);

  // Theme Colors
  const textColor = isDarkMode ? "#FFFFFF" : "#333333";
  const subTextColor = isDarkMode ? "#CCCCCC" : "#666666";
  const inputBg = isDarkMode ? "#333333" : "#F5F5F5";
  const themeColor = isDarkMode ? "#02C3BD" : "#007CBE";

  useEffect(() => {
    if (!profile) return;
    setFirstName(profile.firstName ?? "");
    setLastName(profile.lastName ?? "");
    setCurrency(profile.currency ?? "ILS");
    setStartDay(String(profile.billingCycleStartDay ?? 1));
    setDefaultPreset(
      (profile.overviewDateRangePreset as DateRangePresetApi) ??
        "CURRENT_CYCLE",
    );
    setLanguage(profile.language ?? "en");
  }, [profile]);

  const handleSave = async () => {
    try {
      const day = parseInt(startDay, 10);
      if (isNaN(day) || day < 1 || day > 31) {
        Alert.alert(t("error", language), t("invalidStartDay", language));
        return;
      }

      setSaving(true);
      const patch = {
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        currency: currency.trim() || undefined,
        billingCycleStartDay: day,
        overviewDateRangePreset: defaultPreset, // Keep sending the current state, even if hidden
        language: language.trim() || undefined,
      };

      await saveProfile(patch);

      // Handle RTL change
      const newIsRTL = isRTL(language);
      if (newIsRTL !== I18nManager.isRTL) {
        I18nManager.allowRTL(newIsRTL);
        I18nManager.forceRTL(newIsRTL);
        Alert.alert(
          t("saved", language),
          t("profileUpdated", language) +
            " App will reload to apply language changes.",
          [
            {
              text: "OK",
              onPress: async () => {
                try {
                  await Updates.reloadAsync();
                } catch (error) {
                  // Fallback for dev mode where reloadAsync might fail or not be available
                  console.warn(
                    "Reload not supported in this environment",
                    error,
                  );
                }
              },
            },
          ],
        );
      } else {
        Alert.alert(t("saved", language), t("profileUpdated", language));
      }
    } catch (e: any) {
      Alert.alert(
        t("error", language),
        e?.message ?? t("failedToSave", language),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.title, { color: textColor }]}>
            {t("profileSettings", language)}
          </Text>

          {loading && !profile ? (
            <Text style={{ color: textColor }}>{t("loading", language)}</Text>
          ) : (
            <>
              <Text style={[styles.label, { color: subTextColor }]}>
                {t("email", language)}
              </Text>
              <Text style={[styles.readonly, { color: textColor }]}>
                {profile?.email ?? "-"}
              </Text>

              <Text style={[styles.label, { color: subTextColor }]}>
                {t("firstName", language)}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: textColor,
                    backgroundColor: inputBg,
                    borderColor: isDarkMode ? "#444" : "#ccc",
                  },
                ]}
                value={firstName}
                onChangeText={setFirstName}
                textAlign={isRTL(language) ? "right" : "left"}
              />

              <Text style={[styles.label, { color: subTextColor }]}>
                {t("lastName", language)}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: textColor,
                    backgroundColor: inputBg,
                    borderColor: isDarkMode ? "#444" : "#ccc",
                  },
                ]}
                value={lastName}
                onChangeText={setLastName}
                textAlign={isRTL(language) ? "right" : "left"}
              />

              <Text style={[styles.label, { color: subTextColor }]}>
                {t("currency", language)}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: textColor,
                    backgroundColor: inputBg,
                    borderColor: isDarkMode ? "#444" : "#ccc",
                  },
                ]}
                value={currency}
                onChangeText={setCurrency}
                placeholder="e.g. ILS, USD, EUR"
                placeholderTextColor={subTextColor}
                textAlign={isRTL(language) ? "right" : "left"}
              />

              <Text style={[styles.label, { color: subTextColor }]}>
                {t("billingCycleStartDay", language) ||
                  "Billing Cycle Start Day"}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: textColor,
                    backgroundColor: inputBg,
                    borderColor: isDarkMode ? "#444" : "#ccc",
                  },
                ]}
                value={startDay}
                onChangeText={(text) =>
                  setStartDay(text.replace(/[^0-9]/g, ""))
                }
                keyboardType="numeric"
                placeholder="1-31"
                placeholderTextColor={subTextColor}
                textAlign={isRTL(language) ? "right" : "left"}
                maxLength={2}
              />

              <Text style={[styles.label, { color: subTextColor }]}>
                {t("defaultDateRange", language)}
              </Text>
              <View style={styles.presetContainer}>
                {(
                  [
                    "CURRENT_CYCLE",
                    "LAST_CYCLE",
                    "THIS_MONTH",
                    "LAST_MONTH",
                  ] as DateRangePresetApi[]
                ).map((preset) => (
                  <TouchableOpacity
                    key={preset}
                    style={[
                      styles.presetButton,
                      defaultPreset === preset && {
                        backgroundColor: themeColor,
                        borderColor: themeColor,
                      },
                      { borderColor: isDarkMode ? "#444" : "#ccc" },
                    ]}
                    onPress={() => setDefaultPreset(preset)}
                  >
                    <Text
                      style={[
                        styles.presetText,
                        defaultPreset === preset
                          ? { color: "#fff" }
                          : { color: textColor },
                      ]}
                    >
                      {preset.replace("_", " ")}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.label, { color: subTextColor }]}>
                {t("language", language)}
              </Text>
              <View style={styles.languageRow}>
                <Button
                  title="English"
                  onPress={() => setLanguage("en")}
                  color={language === "en" ? "#007AFF" : "#8E8E93"}
                />
                <Button
                  title="עברית"
                  onPress={() => setLanguage("he")}
                  color={language === "he" ? "#007AFF" : "#8E8E93"}
                />
              </View>

              <View style={{ marginTop: 16, marginBottom: 40 }}>
                <Button
                  title={saving ? t("saving", language) : t("save", language)}
                  onPress={handleSave}
                  disabled={saving}
                />
              </View>
            </>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 12 },
  label: { fontSize: 14, fontWeight: "500", marginTop: 12, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  readonly: { fontSize: 16, paddingVertical: 4 },
  languageRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  presetContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
    marginBottom: 12,
  },
  presetButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  presetText: {
    fontSize: 14,
    fontWeight: "500",
    textTransform: "capitalize",
  },
});
