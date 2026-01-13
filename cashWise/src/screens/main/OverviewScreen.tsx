// src/screens/OverviewScreen.tsx
import React, { useState, useMemo, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  useWindowDimensions,
  useColorScheme,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { useTransactions } from '../store/TransactionsContext'; // Replaced by useCycle
import { useProfile } from "../../context/ProfileContext";

import {
  OverviewCycleProvider,
  useOverviewCycle,
} from "../../context/CycleContext";
import TransactionForm from "../../components/features/transactions/TransactionForm";
import type { OverviewStackParamList } from "../../navigation/OverviewStack";
import { t as translate } from "../../config/i18n";

// UI Components
import {
  NavigationHeader,
  ModeSwitcher,
  ModeOption,
} from "../../components/ui";

// Feature Components
import DashboardView from "../../components/features/overview/DashboardView";
import SpendingView from "../../components/features/overview/SpendingView";
import TransactionList from "../../components/features/overview/TransactionList";

export type OverviewMode = "DASHBOARD" | "SPENDING" | "LIST";

type Nav = NativeStackNavigationProp<OverviewStackParamList, "OverviewMain">;

const OverviewContent: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { width } = useWindowDimensions();
  const {
    transactions,
    start,
    endExclusive,
    offset,
    setOffset,
    loading: cycleLoading,
  } = useOverviewCycle();

  const { profile } = useProfile();

  const language = profile?.language || "en";

  // --- THEME & COLORS SETUP ---
  const isDarkMode = useColorScheme() === "dark";
  const themeColor = isDarkMode ? "#02C3BD" : "#007CBE";
  const textColor = isDarkMode ? "#FFFFFF" : "#333333";

  const [mode, setMode] = useState<OverviewMode>("DASHBOARD");
  const [showAddModal, setShowAddModal] = useState(false);

  // Mode options for the switcher
  const overviewModes: ModeOption<OverviewMode>[] = [
    { value: "DASHBOARD", label: translate("modeDashboard", language) },
    { value: "SPENDING", label: translate("modeSpending", language) },
    { value: "LIST", label: translate("modeList", language) },
  ];

  const translateX = useRef(new Animated.Value(0)).current;
  const modeOrder: Record<OverviewMode, number> = {
    DASHBOARD: 0,
    SPENDING: 1,
    LIST: 2,
  };

  // Billing Cycle Label for Header
  const billingCycle = useMemo(() => {
    // start/endExclusive are strings 'YYYY-MM-DD'
    if (!start || !endExclusive) return { label: "" };

    const startDate = new Date(start);
    const endDate = new Date(endExclusive);
    // Display end is exclusive - 1 day
    endDate.setDate(endDate.getDate() - 1);

    const label = `${startDate.getDate()}/${(startDate.getMonth() + 1).toString().padStart(2, "0")} - ${endDate.getDate()}/${(endDate.getMonth() + 1).toString().padStart(2, "0")}`;

    return { label };
  }, [start, endExclusive]);

  // const cycleBudget = 0; // TODO: Fetch from profile or settings // Removed as no longer used

  // const formatAmount = (amount: number) => { // Removed as no longer used
  //   return `${currencySymbol}${amount.toFixed(2)}`;
  // };

  const handleDayPress = (date: string) => {
    navigation.navigate("DailyTransactions", { date });
  };

  const handleModeChange = (nextMode: OverviewMode) => {
    if (nextMode === mode) return;
    const direction = modeOrder[nextMode] > modeOrder[mode] ? 1 : -1;
    translateX.setValue(direction * width);
    setMode(nextMode);
    Animated.timing(translateX, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const renderModeContent = () => {
    if (cycleLoading && transactions.length === 0) {
      // Can add a loading spinner here
      return (
        <View style={{ padding: 20 }}>
          <Text style={{ color: textColor, textAlign: "center" }}>
            Loading...
          </Text>
        </View>
      );
    }

    if (mode === "DASHBOARD") {
      return (
        <DashboardView onDayPress={handleDayPress} themeColor={themeColor} />
      );
    }

    if (mode === "SPENDING") {
      return <SpendingView themeColor={themeColor} />;
    }

    return <TransactionList />;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: textColor }]}>
          {translate("overviewTitle", language)}
        </Text>
        <NavigationHeader
          dateRange={{
            fromDate: billingCycle.label.split(" - ")[0],
            toDate: billingCycle.label.split(" - ")[1],
          }}
          themeColor={themeColor}
          title={undefined}
          onPrev={() => setOffset(offset + 1)}
          onNext={() => setOffset(offset - 1)}
          showArrows={true}
        />

        <ModeSwitcher
          modes={overviewModes}
          currentMode={mode}
          onModeChange={handleModeChange}
          themeColor={themeColor}
        />

        <View style={styles.modeContentWrapper}>
          <Animated.View
            style={[styles.modeContentInner, { transform: [{ translateX }] }]}
          >
            {renderModeContent()}
          </Animated.View>
        </View>

        {/* Conditional Add Button */}
        {(mode === "SPENDING" || mode === "LIST") &&
          (transactions.length === 0 ? (
            <View style={styles.emptyStateContainer} pointerEvents="box-none">
              <TouchableOpacity
                style={styles.bigAddButton}
                onPress={() => setShowAddModal(true)}
              >
                <Text style={styles.bigAddButtonText}>
                  + {translate("addTransaction", language)}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.fab, { backgroundColor: themeColor }]}
              onPress={() => setShowAddModal(true)}
            >
              <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
          ))}

        <Modal
          visible={showAddModal}
          animationType="slide"
          onRequestClose={() => setShowAddModal(false)}
          presentationStyle="pageSheet"
        >
          <View
            style={{
              flex: 1,
              backgroundColor: isDarkMode ? "#1a1a1a" : "#f2f2f7",
            }}
          >
            <TransactionForm
              onSuccess={() => setShowAddModal(false)}
              onCancel={() => setShowAddModal(false)}
            />
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const OverviewScreen: React.FC = () => {
  return (
    <OverviewCycleProvider>
      <OverviewContent />
    </OverviewCycleProvider>
  );
};

export default OverviewScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 16 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  modeContentWrapper: {
    flex: 1,
    overflow: "hidden",
  },
  modeContentInner: {
    flex: 1,
    width: "100%",
  },
  emptyStateContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  bigAddButton: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 8,
  },
  bigAddButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    zIndex: 20,
  },
  fabText: {
    fontSize: 32,
    color: "#fff",
    marginTop: -4,
  },
});
