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
import { useBudget } from "../../context/BudgetContext";
import { getCurrencySymbol } from "../../utils/currency";
import {
  RepoCategoryGroup,
  RepoCategoryItem,
  CATEGORY_REPO,
} from "../../data/categoryRepo";
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
  const { transactions } = useTransactions();
  const { profile } = useProfile();
  const currencySymbol = getCurrencySymbol(profile?.currency);
  const language = profile?.language || "en";

  const {
    draft,
    cycleStartDate,
    cycleEndExclusive,
    setCategoryBudget,
    save,
  } = useBudget();
  const themeTextColor = isDark ? "#FFFFFF" : "#000000";

  const [mode, setMode] = useState<BudgetMode>("PLAN");

  // Mock budget state - synced with Context
  const [plannedBudgets, setPlannedBudgets] = useState<PlannedBudgetItem[]>([]);

  // Sync draft -> UI
  React.useEffect(() => {
    const newPlanned: PlannedBudgetItem[] = [];
    const cats = draft.categoryBudgets;

    Object.entries(cats).forEach(([catCode, amount]) => {
      // Find metadata from Repo
      for (const group of CATEGORY_REPO) {
        const item = group.items.find((i) => i.code === catCode);
        if (item) {
          newPlanned.push({
            id: catCode,
            groupId: group.id,
            subCategoryCode: item.code,
            subCategoryLabel: item.label,
            amount,
          });
          break;
        }
      }
    });

    setPlannedBudgets(newPlanned);
  }, [draft.categoryBudgets]);

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

  const handleSaveBudget = async (
    amountInput: string,
    subCategory: RepoCategoryItem,
  ) => {
    if (!activeGroup) return;

    const amount = parseFloat(amountInput);
    if (isNaN(amount) || amount <= 0) return;

    // 1. Update Context Draft
    setCategoryBudget(subCategory.code, amount);

    // 2. Persist immediately (or rely on a Save button later, but user asked for edit+save)
    await save();

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
                <Text style={{ color: subTextColor, marginBottom: 10 }}>
                  DEBUG STUB:
                </Text>
                <Text style={{ color: themeTextColor }}>Cycle Start: {cycleStartDate} </Text>
                <Text style={{ color: themeTextColor }}>Cycle End (excl): {cycleEndExclusive}</Text>
                <Text style={{ color: themeTextColor, marginTop: 10 }}>
                  Total Budget: {currencySymbol} {draft.totalBudget}
                </Text>

                <Text style={{ color: themeTextColor, marginTop: 10 }}>
                  Category Budgets: {Object.keys(draft.categoryBudgets).length} defined
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
