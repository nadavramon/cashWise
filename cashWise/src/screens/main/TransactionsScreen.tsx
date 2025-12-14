import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  Alert,
  Linking,
} from "react-native";
import { useCategories } from "../../context/CategoriesContext";
import { useTransactions } from "../../context/TransactionsContext";
import { useProfile } from "../../context/ProfileContext";
import { getCurrencySymbol } from "../../utils/currency";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TransactionsStackParamList } from "../../navigation/TransactionsStack";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiExportTransactions } from "../../api/exportsApi";
import { t } from "../../config/i18n";

type Props = NativeStackScreenProps<
  TransactionsStackParamList,
  "TransactionsList"
>;

const TransactionsScreen: React.FC<Props> = ({ navigation }) => {
  const { transactions, deleteTransaction, dateRange, setPresetRange } =
    useTransactions();
  const { categories } = useCategories();
  const { profile } = useProfile();
  const language = profile?.language || "en";

  const currencySymbol = getCurrencySymbol(profile?.currency);

  const categoryMap = new Map<string, string>();
  categories.forEach((c) => categoryMap.set(c.id, c.name));

  const confirmDelete = (tx: {
    id: string;
    date: string;
    amount: number;
    type: string;
  }) => {
    const typeLabel =
      tx.type === "income"
        ? language === "he"
          ? "הכנסה"
          : "income"
        : language === "he"
          ? "הוצאה"
          : "expense";
    const message = t("deleteTransactionMessage", language)
      .replace("{type}", typeLabel)
      .replace("{amount}", tx.amount.toFixed(2));

    Alert.alert(t("deleteTransactionTitle", language), message, [
      { text: t("cancel", language), style: "cancel" },
      {
        text: t("delete", language),
        style: "destructive",
        onPress: async () => {
          try {
            await deleteTransaction(tx.id, tx.date);
          } catch (e: any) {
            Alert.alert(
              t("error", language),
              e?.message ?? "Failed to delete transaction.",
            );
          }
        },
      },
    ]);
  };

  const handleExport = async () => {
    try {
      const url = await apiExportTransactions(
        dateRange.fromDate,
        dateRange.toDate,
      );
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(t("error", language), t("exportError", language));
      }
    } catch (error: any) {
      Alert.alert(
        t("exportFailed", language),
        error.message || "Unknown error",
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{t("transactionsTitle", language)}</Text>
          <Button
            title={t("add", language)}
            onPress={() => navigation.navigate("AddTransaction")}
          />
        </View>
        <View style={styles.filterRow}>
          <Button
            title={t("filterCurrentCycle", language) || "Current Cycle"}
            onPress={() => setPresetRange("CURRENT_CYCLE")}
          />
          <Button
            title={t("filterThisMonth", language)}
            onPress={() => setPresetRange("THIS_MONTH")}
          />
          <Button
            title={t("filterLastMonth", language)}
            onPress={() => setPresetRange("LAST_MONTH")}
          />
          <Button
            title={t("filterThisWeek", language)}
            onPress={() => setPresetRange("THIS_WEEK")}
          />
        </View>
        <View style={{ marginBottom: 12 }}>
          <Button title={t("exportCSV", language)} onPress={handleExport} />
        </View>

        {/* Optional: debug/show active range */}

        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const cat = categoryMap.get(item.categoryId);
            return (
              <View style={styles.row}>
                <View>
                  <Text style={styles.amount}>
                    {item.type === "expense" ? "-" : "+"}
                    {item.amount.toFixed(2)}
                    {currencySymbol}
                  </Text>
                  <Text style={styles.date}>{item.date}</Text>
                  <Text style={styles.category}>{cat ?? "Unknown"}</Text>
                </View>

                <View style={styles.rowButtons}>
                  <Button
                    title={t("edit", language)}
                    onPress={() =>
                      navigation.navigate("EditTransaction", {
                        id: item.id,
                        date: item.date,
                      })
                    }
                  />
                  <Button
                    title={t("delete", language)}
                    color="red"
                    onPress={() => confirmDelete(item)}
                  />
                </View>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default TransactionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  rowButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // works in RN 0.71+
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  amount: {
    fontSize: 18,
    fontWeight: "700",
  },
  date: {
    fontSize: 12,
    color: "#666",
  },
  category: {
    fontSize: 16,
  },
  note: {
    fontSize: 12,
    color: "#666",
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 8, // works on modern RN; remove if your version complains
  },
});
