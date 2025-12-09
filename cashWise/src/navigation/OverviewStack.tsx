// src/navigation/OverviewStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OverviewScreen from '../screens/main/OverviewScreen';
import DailyTransactionsScreen from '../screens/main/DailyTransactionsScreen';
import { t } from '../config/i18n';
import { useProfile } from '../context/ProfileContext';

export type OverviewStackParamList = {
  OverviewMain: undefined;
  DailyTransactions: { date: string }; // matches your navigation.navigate('DailyTransactions', { date })
};

const Stack = createNativeStackNavigator<OverviewStackParamList>();

export const OverviewStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OverviewMain"
        component={OverviewScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DailyTransactions"
        component={DailyTransactionsScreen}
        options={{}}
      />
    </Stack.Navigator>
  );
};

export default OverviewStackNavigator;