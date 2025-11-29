import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ToolsScreenMain from '../screens/ToolsScreenMain';
import ProfileScreen from '../screens/ProfileScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import ManualCategoryScreen from '../screens/ManualCategoryScreen';

export type ToolsStackParamList = {
  ToolsHome: undefined;
  Profile: undefined;
  Categories: undefined;
  ManualCategory: undefined;
};

const Stack = createNativeStackNavigator<ToolsStackParamList>();

import { t } from '../utils/i18n';
import { useProfile } from '../store/ProfileContext';

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
        options={{ title: t('toolsProfile', language) }}
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
