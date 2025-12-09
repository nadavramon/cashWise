import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ToolsScreenMain from '../screens/main/ToolsScreenMain';
import ProfileScreen from '../screens/main/ProfileScreen';
import CategoriesScreen from '../screens/main/CategoriesScreen';
import ManualCategoryScreen from '../screens/main/ManualCategoryScreen';

export type ToolsStackParamList = {
  ToolsHome: undefined;
  Profile: undefined;
  Categories: undefined;
  ManualCategory: undefined;
};

const Stack = createNativeStackNavigator<ToolsStackParamList>();

import { t } from '../config/i18n';
import { useProfile } from '../context/ProfileContext';

const ToolsStack: React.FC = () => {
  const { profile } = useProfile();
  const language = profile?.language || 'en';

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ToolsHome"
        component={ToolsScreenMain}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerBackTitle: '' }}
      />
      <Stack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ManualCategory"
        component={ManualCategoryScreen}
        options={{ title: t('toolsManualCategory', language) }}
      />
    </Stack.Navigator>
  );
};

export default ToolsStack;
