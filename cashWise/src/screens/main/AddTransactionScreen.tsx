import React from "react";
import { View, StyleSheet, useColorScheme } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TransactionsStackParamList } from "../../navigation/TransactionsStack";
import TransactionForm from "../../components/features/transactions/TransactionForm";

type Props = NativeStackScreenProps<
  TransactionsStackParamList,
  "AddTransaction"
>;

const AddTransactionScreen: React.FC<Props> = ({ navigation }) => {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#000" : "#f2f2f7" },
      ]}
    >
      <TransactionForm
        onSuccess={() => navigation.goBack()}
        onCancel={() => navigation.goBack()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AddTransactionScreen;
