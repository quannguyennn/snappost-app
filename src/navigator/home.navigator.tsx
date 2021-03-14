import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { AppRoutes } from './app-routes';
import { CompositeNavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './root.navigator';
import { MainTabParamList } from './app.navigator';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/home.screen';

export type HomeStackParamList = {
  [AppRoutes.HOME]: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export type HomeStackNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList, AppRoutes.APP>,
  CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList, AppRoutes.HOME_TAB>,
    StackNavigationProp<HomeStackParamList>
  >
>;

export type HomeScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList, AppRoutes.APP>,
  CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList, AppRoutes.HOME_TAB>,
    StackNavigationProp<HomeStackParamList, AppRoutes.HOME>
  >
>;

export const HomeNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen name={AppRoutes.HOME} component={HomeScreen} />
  </Stack.Navigator>
);
