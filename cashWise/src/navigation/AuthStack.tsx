import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import ConfirmSignUpScreen from '../screens/auth/ConfirmSignUpScreen';

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ConfirmSignUp: { username: string };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{ title: 'Sign In' }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ title: 'Sign Up' }}
      />
      <Stack.Screen
        name="ConfirmSignUp"
        component={ConfirmSignUpScreen}
        options={{ title: 'Confirm Account' }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
