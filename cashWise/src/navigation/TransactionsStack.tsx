import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TransactionsScreen from '../screens/TransactionsScreen';
import EditTransactionScreen from '../screens/EditTransactionScreen';

export type TransactionsStackParamList = {
  TransactionsList: undefined;
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
        options={{ title: 'Edit Transaction' }}
      />
    </Stack.Navigator>
  );
};

export default TransactionsStack;
