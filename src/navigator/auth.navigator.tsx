import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { AppRoutes } from './app-routes';
import { CompositeNavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './root.navigator';
import LoginScreen from '../screens/auth/login.screen';

export type AuthStackParamList = {
  [AppRoutes.LOGIN]: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export type AuthStackNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList, AppRoutes.AUTH>,
  StackNavigationProp<AuthStackParamList>
>;

export type AuthLoginScreenProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList, AppRoutes.AUTH>,
  StackNavigationProp<AuthStackParamList, AppRoutes.LOGIN>
>;

export const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={AppRoutes.LOGIN}
        options={{
          title: 'Login',
          headerShown: false,
        }}
        component={LoginScreen}
      />
    </Stack.Navigator>
  );
};
