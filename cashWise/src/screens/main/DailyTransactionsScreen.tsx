// src/screens/DailyTransactionsScreen.tsx
import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  useColorScheme,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";

import type { OverviewStackParamList } from "../../navigation/OverviewStack";

import { useCategories } from "../../context/CategoriesContext";
import { useProfile } from "../../context/ProfileContext";
import TransactionForm from "../../components/features/transactions/TransactionForm";
import { Transaction } from "../../types/models";
import { apiListTransactions } from "../../api/transactionsApi";
import { t } from "../../config/i18n";

type DailyRoute = RouteProp<OverviewStackParamList, "DailyTransactions">;

const DailyTransactionsScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<OverviewStackParamList>>();
  const route = useRoute<DailyRoute>();
  const { date } = route.params;
  const isDarkMode = useColorScheme() === "dark";
  const themeColor = isDarkMode ? "#02C3BD" : "#007CBE";

  const [showAddModal, setShowAddModal] = React.useState(false);

  const { categories } = useCategories();
  const { profile } = useProfile();
  const language = profile?.language || "en";

  // Dynamic Title
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: isDarkMode ? "#000" : "#f2f2f7",
      },
      headerTintColor: themeColor,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setShowAddModal(true)}
          style={{ padding: 4 }}
        >
          <Text style={{ fontSize: 24, color: themeColor, fontWeight: "400" }}>
            +
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, date, isDarkMode, themeColor, language]);

  // Fetch transactions for this day locally since global context is paginated
  const [dayTransactions, setDayTransactions] = React.useState<Transaction[]>(
    [],
  );

  React.useEffect(() => {
    let mounted = true;
    const loadDay = async () => {
      try {
        const res = await apiListTransactions({
          fromDate: date,
          toDate: date,
        });
        if (mounted) {
          setDayTransactions(res.items);
        }
      } catch (e) {
        console.error("Failed to load daily transactions", e);
      }
    };
    loadDay();
    return () => {
      mounted = false;
    };
  }, [date]);

  const categoryNameById = useMemo(() => {
    const map: Record<string, string> = {};
    for (const c of categories) {
      map[c.id] = c.name;
    }
    return map;
  }, [categories]);

  const totalAmount = useMemo(() => {
    return dayTransactions.reduce((acc, t) => {
      if (!t.includeInStats) return acc;
      return acc + (t.type === "income" ? t.amount : -t.amount);
    }, 0);
  }, [dayTransactions]);

  const currency = profile?.currency || "₪";
  const formattedTotal = `${totalAmount >= 0 ? "" : "-"}${Math.abs(totalAmount).toFixed(2)} ${currency}`;

  const renderItem = ({ item }: { item: Transaction }) => {
    const catName =
      categoryNameById[item.categoryId] ?? t("uncategorized", language);

    return (
      <View style={styles.row}>
        <View style={styles.rowMain}>
          <Text style={styles.rowCategory}>{catName}</Text>
          {!!item.note && <Text style={styles.rowNote}>{item.note}</Text>}
        </View>
        <View style={styles.rowRight}>
          <Text
            style={[
              styles.rowAmount,
              item.type === "income" ? styles.incomeText : styles.expenseText,
            ]}
          >
            {item.type === "income" ? "+" : "-"}
            {item.amount.toFixed(2)}
          </Text>
          <Text style={styles.rowType}>
            {item.type === "income"
              ? t("income", language)
              : t("expense", language)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header area in Body */}
      <View style={styles.header}>
        <Text
          style={[styles.dateTitle, { color: isDarkMode ? "#fff" : "#000" }]}
        >
          {new Date(date).toLocaleDateString(
            language === "he" ? "he-IL" : "en-US",
            { weekday: "long" },
          )}
          , {new Date(date).getDate()}{" "}
          {new Date(date)
            .toLocaleDateString(language === "he" ? "he-IL" : "en-US", {
              month: "short",
            })
            .toUpperCase()}
        </Text>
        <Text
          style={[styles.totalAmount, { color: isDarkMode ? "#fff" : "#000" }]}
        >
          {formattedTotal}
        </Text>
      </View>

      {/* Totals card */}

      {/* List of transactions */}
      <FlatList
        data={dayTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      {/* Add Transaction Modal */}
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
            initialDate={date}
          />
        </View>
      </Modal>
    </View>
  );
};

export default DailyTransactionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
    paddingTop: 16,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: "700",
  },

  incomeText: {
    color: "#2ecc71",
  },
  expenseText: {
    color: "#e74c3c",
  },
  listContent: {
    paddingBottom: 16,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  rowMain: {
    flex: 1,
  },
  rowCategory: {
    fontSize: 14,
    fontWeight: "500",
  },
  rowNote: {
    fontSize: 12,
    color: "#666",
  },
  rowRight: {
    alignItems: "flex-end",
  },
  rowAmount: {
    fontSize: 14,
    fontWeight: "600",
  },
  rowType: {
    fontSize: 11,
    color: "#999",
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    opacity: 0.8,
  },
});
