// State managment and memoization
import React, { useState, useMemo, FC } from "react";
// Core UI building blocks
import {
  View,
  useWindowDimensions,
  Modal,
} from "react-native";

// Safe rendering and screen navigation
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

// Access to user profile and billing cycle data
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useProfile } from "../../context/ProfileContext";
import {
  OverviewCycleProvider,
  useOverviewCycle,
} from "../../context/CycleContext";
import TransactionForm from "../../components/features/transactions/TransactionForm";
import type { OverviewStackParamList } from "../../navigation/OverviewStack";
import { t as translate } from "../../config/i18n";
import { useTheme } from "../../hooks/useTheme";

//Reusable UI primitives
import {
  NavigationHeader,
  ModeSwitcher,
  ModeOption,
  Body,
  ButtonText,
  ScalePressable,
} from "../../components/ui";
import { screenStyles } from "../../styles/screenStyles";

// The 3 main view modes
import DashboardView from "../../components/features/overview/DashboardView";
import SpendingView from "../../components/features/overview/SpendingView";
import TransactionList from "../../components/features/overview/TransactionList";

export type OverviewMode = "DASHBOARD" | "SPENDING" | "LIST";

type Nav = NativeStackNavigationProp<OverviewStackParamList, "OverviewMain">;

const OverviewContent: FC = () => {
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
  const { colors } = useTheme();

  const [mode, setMode] = useState<OverviewMode>("DASHBOARD");
  const [showAddModal, setShowAddModal] = useState(false);

  // Mode options for the switcher
  const overviewModes: ModeOption<OverviewMode>[] = [
    { value: "DASHBOARD", label: translate("modeDashboard", language) },
    { value: "SPENDING", label: translate("modeSpending", language) },
    { value: "LIST", label: translate("modeList", language) },
  ];

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

  const handleDayPress = (date: string) => {
    navigation.navigate("DailyTransactions", { date });
  };

  const handleModeChange = (nextMode: OverviewMode) => {
    if (nextMode === mode) return;
    setMode(nextMode);
  };

  // Render the appropriate content based on mode
  const renderModeContent = () => {
    if (cycleLoading && transactions.length === 0) {
      return (
        <View className="p-5">
          <Body className="text-center" color={colors.textPrimary}>
            Loading...
          </Body>
        </View>
      );
    }

    if (mode === "DASHBOARD") {
      return <DashboardView onDayPress={handleDayPress} themeColor={colors.primary} />;
    }

    if (mode === "SPENDING") {
      return (
        <SpendingView
          themeColor={colors.primary}
          onAddTransaction={() => setShowAddModal(true)}
        />
      );
    }

    return <TransactionList />;
  };

  return (
    <SafeAreaView style={screenStyles.safeArea}>
      <View style={screenStyles.container}>
        <View>
          <NavigationHeader
            title={translate("overviewTitle", language)}
            dateRange={{
              fromDate: billingCycle.label.split(" - ")[0],
              toDate: billingCycle.label.split(" - ")[1],
            }}
            themeColor={colors.primary}
            onPrev={() => setOffset(offset + 1)}
            onNext={() => setOffset(offset - 1)}
            showArrows={true}
          />
        </View>

        <View>
          <ModeSwitcher
            modes={overviewModes}
            currentMode={mode}
            onModeChange={handleModeChange}
            themeColor={colors.primary}
          />
        </View>

        {/* Content Area */}
        <View className="flex-1 overflow-hidden">
          {renderModeContent()}
        </View>

        {/* Conditional Add Button */}
        {(mode === "SPENDING" || mode === "LIST") &&
          (transactions.length === 0 ? (
            <View className="absolute inset-0 justify-center items-center z-10">
              <ScalePressable onPress={() => setShowAddModal(true)}>
                <View className="bg-white dark:bg-gray-800 py-4 px-8 rounded-full shadow-lg">
                  <ButtonText color={colors.textPrimary}>
                    + {translate("addTransaction", language)}
                  </ButtonText>
                </View>
              </ScalePressable>
            </View>
          ) : (
            <ScalePressable
              onPress={() => setShowAddModal(true)}
              className="absolute bottom-6 right-6 z-20"
            >
              <View
                className="w-14 h-14 rounded-full justify-center items-center shadow-lg"
                style={{ backgroundColor: colors.primary }}
              >
                <ButtonText
                  color="#fff"
                  style={{ fontSize: 32, marginTop: -4 }}
                >
                  +
                </ButtonText>
              </View>
            </ScalePressable>
          ))}

        <Modal
          visible={showAddModal}
          animationType="slide"
          onRequestClose={() => setShowAddModal(false)}
          presentationStyle="pageSheet"
        >
          <View
            className="flex-1"
            style={{ backgroundColor: colors.background }}
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

const OverviewScreen: FC = () => {
  return (
    <OverviewCycleProvider>
      <OverviewContent />
    </OverviewCycleProvider>
  );
};

export default OverviewScreen;
