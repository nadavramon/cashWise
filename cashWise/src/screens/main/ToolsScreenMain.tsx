import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Linking,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { signOut } from 'aws-amplify/auth';
import { useAuth } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ToolsStackParamList } from '../../navigation/ToolsStack';
import { useTransactions } from '../../context/TransactionsContext';
import { apiExportTransactions } from '../../api/exportsApi';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur'; // Optional: for glass effect, or fallback to View
import { t } from '../../config/i18n';
import { useProfile } from '../../context/ProfileContext';

type Props = NativeStackScreenProps<ToolsStackParamList, 'ToolsHome'>;

const ToolsScreenMain: React.FC<Props> = ({ navigation }) => {
  const { username, email, setUser } = useAuth();
  const { dateRange } = useTransactions();
  const { profile } = useProfile();
  const language = profile?.language || 'en';
  const [exporting, setExporting] = useState(false);
  const isDark = useColorScheme() === 'dark';

  // Theme Colors
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const subTextColor = isDark ? '#CCCCCC' : '#666666';
  const cardBg = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.8)';
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';

  const handleSignOut = async () => {
    Alert.alert(t('signOut', language), t('signOutConfirm', language), [
      { text: t('cancel', language), style: 'cancel' },
      {
        text: t('signOut', language),
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
            setUser(null);
          } catch (err: any) {
            console.error('SignOut error', err);
            Alert.alert(t('error', language), err.message || 'Failed to sign out.');
          }
        },
      },
    ]);
  };

  const handleExport = async () => {
    if (!dateRange) {
      Alert.alert(t('noRange', language), t('noRangeMessage', language));
      return;
    }

    try {
      setExporting(true);
      const url = await apiExportTransactions(
        dateRange.fromDate,
        dateRange.toDate,
      );
      if (url && (await Linking.canOpenURL(url))) {
        Linking.openURL(url);
      } else {
        Alert.alert(t('exportReady', language), t('downloadUrlCopied', language) + url);
      }
    } catch (err: any) {
      console.error('Export failed', err);
      Alert.alert(t('exportFailed', language), err?.message ?? t('exportFailedMessage', language));
    } finally {
      setExporting(false);
    }
  };

  // Reusable Grid Button Component
  const ToolCard = ({
    title,
    subtitle,
    icon,
    color,
    onPress,
    loading = false,
  }: {
    title: string;
    subtitle?: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    onPress: () => void;
    loading?: boolean;
  }) => (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: cardBg, borderColor: cardBorder },
      ]}
      onPress={onPress}
      disabled={loading}
    >
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        {loading ? (
          <ActivityIndicator color={color} size="small" />
        ) : (
          <Ionicons name={icon} size={24} color={color} />
        )}
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: textColor }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.cardSubtitle, { color: subTextColor }]}>
            {subtitle}
          </Text>
        )}
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={subTextColor}
        style={{ opacity: 0.5 }}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.pageTitle, { color: textColor }]}>{t('navTools', language)}</Text>
        </View>

        {/* User Info Card */}
        <View
          style={[
            styles.userCard,
            { backgroundColor: cardBg, borderColor: cardBorder },
          ]}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(username?.[0] || 'U').toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={[styles.username, { color: textColor }]}>
              {username || 'User'}
            </Text>
            <Text style={[styles.email, { color: subTextColor }]}>
              {email || 'No email'}
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionHeader, { color: subTextColor }]}>
          {t('general', language)}
        </Text>

        {/* Grid Layout */}
        <View style={styles.gridContainer}>
          {/* 1. Profile */}
          <View style={styles.gridItem}>
            <ToolCard
              title={t('toolsProfile', language)}
              subtitle={t('editDetails', language)}
              icon="person"
              color="#007CBE" // CashWise Blue
              onPress={() => navigation.navigate('Profile')}
            />
          </View>

          {/* 2. Categories */}
          <View style={styles.gridItem}>
            <ToolCard
              title={t('category', language)}
              subtitle={t('manageTags', language)}
              icon="pricetags"
              color="#9D4EDD" // CashWise Purple
              onPress={() => navigation.navigate('Categories')}
            />
          </View>

          {/* 3. Export Data */}
          <View style={styles.gridItem}>
            <ToolCard
              title={exporting ? t('saving', language) : t('exportCSV', language)}
              subtitle={t('getYourData', language)}
              icon="download"
              color="#F5C518" // CashWise Gold
              onPress={handleExport}
              loading={exporting}
            />
          </View>

          {/* 4. Sign Out */}
          <View style={styles.gridItem}>
            <ToolCard
              title={t('signOut', language)}
              subtitle={t('logOutSafely', language)}
              icon="log-out"
              color="#FF6B6B" // Danger Red
              onPress={handleSignOut}
            />
          </View>
        </View>

        <Text style={[styles.versionText, { color: subTextColor }]}>
          {t('version', language)} 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ToolsScreenMain;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '700',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007CBE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
  },
  email: {
    fontSize: 14,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12, // Gap between rows/columns (requires newer RN, use margins if older)
  },
  gridItem: {
    width: '48%', // Roughly half width minus gap
    marginBottom: 12,
  },
  card: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    minHeight: 140, // Ensure consistent height for grid look
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 32,
    opacity: 0.5,
  },
});