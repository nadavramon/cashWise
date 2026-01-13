import React from "react";
import { View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TransactionsStackParamList } from "../../navigation/TransactionsStack";
import TransactionForm from "../../components/features/transactions/TransactionForm";

type Props = NativeStackScreenProps<
  TransactionsStackParamList,
  "AddTransaction"
>;

const AddTransactionScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View className="flex-1 bg-[#f2f2f7] dark:bg-black">
      <TransactionForm
        onSuccess={() => navigation.goBack()}
        onCancel={() => navigation.goBack()}
      />
    </View>
  );
};

export default AddTransactionScreen;
