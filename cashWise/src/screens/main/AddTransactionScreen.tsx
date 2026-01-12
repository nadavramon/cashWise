import React from "react";
import { View, StyleSheet, useColorScheme } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TransactionsStackParamList } from "../../navigation/TransactionsStack";
import TransactionForm from "../../components/features/transactions/TransactionForm";
import { CASHWISE_COLORS } from "../../config/themes";

type Props = NativeStackScreenProps<
  TransactionsStackParamList,
  "AddTransaction"
>;

const AddTransactionScreen: React.FC<Props> = ({ navigation }) => {
  const isDarkMode = useColorScheme() === "dark";
  const theme = isDarkMode ? "dark" : "light";

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: CASHWISE_COLORS[theme].background },
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
