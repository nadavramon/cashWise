import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TransactionsScreen from "../screens/main/TransactionsScreen";
import AddTransactionScreen from "../screens/main/AddTransactionScreen";
import EditTransactionScreen from "../screens/main/EditTransactionScreen";

export type TransactionsStackParamList = {
  TransactionsList: undefined;
  AddTransaction: undefined;
  EditTransaction: {
    id: string;
    date: string; // 'YYYY-MM-DD'
  };
};

const Stack = createNativeStackNavigator<TransactionsStackParamList>();

const TransactionsStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TransactionsList"
        component={TransactionsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditTransaction"
        component={EditTransactionScreen}
        options={{ title: "Edit Transaction" }}
      />
      <Stack.Screen
        name="AddTransaction"
        component={AddTransactionScreen}
        options={{ title: "New Transaction", presentation: "modal" }}
      />
    </Stack.Navigator>
  );
};

export default TransactionsStack;
