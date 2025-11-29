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

const ToolsStack: React.FC = () => {
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
        options={{ title: 'Profile' }}
      />
      <Stack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ManualCategory"
        component={ManualCategoryScreen}
        options={{ title: 'Add Manual Category' }}
      />
    </Stack.Navigator>
  );
};

export default ToolsStack;
