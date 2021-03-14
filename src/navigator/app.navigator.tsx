import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeNavigator } from './home.navigator';
import { ProfileNavigator } from './profile.navigator';
import { AppRoutes } from './app-routes';
import TabBarComponent from './TarBarComponent';
import { UploadStackNavigator } from './upload.navigator';
import PostViewScreen from '../screens/PostViewScreen';
import ExploreScreen from '../screens/ExploreScreen';

export type MainTabParamList = {
  [AppRoutes.HOME_TAB]: undefined;
  [AppRoutes.NOTIFICATION_TAB]: undefined;
  [AppRoutes.PROFILE_TAB]: undefined;
  [AppRoutes.EXPLORE_TAB]: undefined;
};

export type AppStackParamList = {
  [AppRoutes.MAIN_TAB]: undefined;
  [AppRoutes.MESSAGE_SCREEN]: undefined;
  [AppRoutes.CONVERSATION_SCREEN]: undefined;
  [AppRoutes.PROFILE_VIEW_SCREEN]: { userId: string };
  [AppRoutes.POST_VIEW_SCREEN]: { postId: string };
  [AppRoutes.UPLOAD_STACK]: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const Stack = createStackNavigator<AppStackParamList>();

export const MainNavigator = () => (
  <Tab.Navigator lazy={true} tabBarOptions={{ showLabel: false }} tabBar={(props) => <TabBarComponent {...props} />}>
    <Tab.Screen name={AppRoutes.HOME_TAB} component={HomeNavigator} />
    <Tab.Screen name={AppRoutes.EXPLORE_TAB} component={ExploreScreen} />
    <Tab.Screen name={AppRoutes.NOTIFICATION_TAB} component={ProfileNavigator} />
    <Tab.Screen name={AppRoutes.PROFILE_TAB} component={ProfileNavigator} />
  </Tab.Navigator>
);

export const AppNavigator = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen options={{ headerShown: false }} name={AppRoutes.MAIN_TAB} component={MainNavigator} />
      <Stack.Screen options={{ headerShown: false }} name={AppRoutes.MESSAGE_SCREEN} component={MainNavigator} />
      <Stack.Screen options={{ headerShown: false }} name={AppRoutes.CONVERSATION_SCREEN} component={MainNavigator} />
      <Stack.Screen options={{ headerShown: false }} name={AppRoutes.PROFILE_VIEW_SCREEN} component={MainNavigator} />
      <Stack.Screen options={{ headerShown: false }} name={AppRoutes.POST_VIEW_SCREEN} component={PostViewScreen} />
      <Stack.Screen name={AppRoutes.UPLOAD_STACK} component={UploadStackNavigator} />
    </Stack.Navigator>
  );
};
