import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { AppRoutes } from './app-routes';
import NotificationScreen from '../screens/notificationScreen';

export type ProfileStackParamList = {
  [AppRoutes.NOTIFICATION_TAB]: undefined;
  [AppRoutes.NOTIFICATION_VIEW_SCREEN]: undefined;

};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const NotificationNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      title: 'Profile',
      headerShown: false,
    }}>
    <Stack.Screen name={AppRoutes.NOTIFICATION_VIEW_SCREEN} component={NotificationScreen} />

  </Stack.Navigator>
);
