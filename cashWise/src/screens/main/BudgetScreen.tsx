import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientBackground from "../../components/GradientBackground";
import { useTransactions } from "../../context/TransactionsContext";
import { useProfile } from "../../context/ProfileContext";
import { getCurrencySymbol } from "../../utils/currency";
import { RepoCategoryGroup, RepoCategoryItem } from "../../data/categoryRepo";
import { BudgetMode, PlannedBudgetItem } from "../../types/budget";
import { t } from "../../config/i18n";

// Feature Components
import BudgetModeSwitcher from "../../components/features/budget/BudgetModeSwitcher";
import BudgetCard from "../../components/features/budget/BudgetCard";
import CategorySection from "../../components/features/budget/CategorySection";
import AddBudgetModal from "../../components/features/budget/AddBudgetModal";
import SubCategoryModal from "../../components/features/budget/SubCategoryModal";
import OverviewHeader from "../../components/features/overview/OverviewHeader";

const BudgetScreen: React.FC = () => {
  const isDark = useColorScheme() === "dark";
  const { transactions, dateRange } = useTransactions();
  const { profile } = useProfile();
  const currencySymbol = getCurrencySymbol(profile?.currency);
  const language = profile?.language || "en";

  const [mode, setMode] = useState<BudgetMode>("PLAN");

  // Mock budget state
  const [plannedBudgets, setPlannedBudgets] = useState<PlannedBudgetItem[]>([]);

  // Modal State
  const [activeGroup, setActiveGroup] = useState<RepoCategoryGroup | null>(
    null,
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSubCategoryModal, setShowSubCategoryModal] = useState(false);

  // Form State
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<RepoCategoryItem | null>(null);

  // Theme Colors
  const textColor = isDark ? "#FFFFFF" : "#333333";
  const subTextColor = isDark ? "#CCCCCC" : "#666666";
  const themeColor = isDark ? "#02C3BD" : "#007CBE";

  // --- Data Calculations ---
  const { totalIncome } = useMemo(() => {
    let income = 0;
    transactions.forEach((tx) => {
      if (!tx.includeInStats) return;
      if (tx.type === "income") {
        income += tx.amount;
      }
    });
    return { totalIncome: income };
  }, [transactions]);

  // Calculate Total Planned Expenses
  const totalPlannedExpenses = useMemo(() => {
    return plannedBudgets.reduce((sum, item) => sum + item.amount, 0);
  }, [plannedBudgets]);

  const openAddModal = (group: RepoCategoryGroup) => {
    setActiveGroup(group);
    setSelectedSubCategory(null);
    setShowAddModal(true);
  };

  const handleSaveBudget = (
    amountInput: string,
    subCategory: RepoCategoryItem,
  ) => {
    if (!activeGroup) return;

    const amount = parseFloat(amountInput);
    if (isNaN(amount) || amount <= 0) return;

    const newItem: PlannedBudgetItem = {
      id: Date.now().toString(),
      groupId: activeGroup.id,
      subCategoryCode: subCategory.code,
      subCategoryLabel: subCategory.label,
      amount: amount,
    };

    setPlannedBudgets((prev) => [...prev, newItem]);
    setShowAddModal(false);
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <OverviewHeader
            title={t("budgetTitle", language)}
            themeColor={themeColor}
          />

          <BudgetModeSwitcher
            currentMode={mode}
            onModeChange={setMode}
            themeColor={themeColor}
            language={language}
          />

          <ScrollView contentContainerStyle={styles.contentContainer}>
            {mode === "PLAN" && (
              <View>
                <BudgetCard
                  plannedBudgets={plannedBudgets}
                  totalPlannedExpenses={totalPlannedExpenses}
                  totalIncome={totalIncome}
                  currencySymbol={currencySymbol}
                />

                <CategorySection
                  plannedBudgets={plannedBudgets}
                  currencySymbol={currencySymbol}
                  onAddCategory={openAddModal}
                />
              </View>
            )}

            {mode === "REMAINING" && (
              <View style={styles.placeholderContainer}>
                <Text style={{ color: subTextColor }}>
                  {t("remainingComingSoon", language)}
                </Text>
              </View>
            )}

            {mode === "INSIGHTS" && (
              <View style={styles.placeholderContainer}>
                <Text style={{ color: subTextColor }}>
                  {t("insightsComingSoon", language)}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>

        <AddBudgetModal
          visible={showAddModal}
          onClose={() => setShowAddModal(false)}
          activeGroup={activeGroup}
          currencySymbol={currencySymbol}
          onSave={handleSaveBudget}
          onOpenSubCategoryModal={() => setShowSubCategoryModal(true)}
          selectedSubCategory={selectedSubCategory}
        />

        <SubCategoryModal
          visible={showSubCategoryModal}
          onClose={() => setShowSubCategoryModal(false)}
          activeGroup={activeGroup}
          onSelect={(item) => {
            setSelectedSubCategory(item);
            setShowSubCategoryModal(false);
          }}
          selectedSubCategory={selectedSubCategory}
        />
      </SafeAreaView>
    </GradientBackground>
  );
};

export default BudgetScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },

  contentContainer: {
    paddingBottom: 40,
  },
  placeholderContainer: {
    alignItems: "center",
    marginTop: 40,
  },
});
