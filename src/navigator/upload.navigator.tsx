import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import UploadScreen, { SelectedMedia } from '../screens/upload';
import CaptionScreen from '../screens/upload/CaptionScreen';
import FilterScreen from '../screens/upload/FilterScreen';
import { AppRoutes } from './app-routes';

export type UploadStackParamList = {
  [AppRoutes.UPLOAD_TAB]: undefined;
  [AppRoutes.FILTER_SCREEN]: { medias: SelectedMedia[]; fromCamera?: boolean };
  [AppRoutes.CAPTION_SCREEN]: { medias: SelectedMedia[] };
};

const Stack = createNativeStackNavigator<UploadStackParamList>();

export const UploadStackNavigator = () => {
  return (
    <Stack.Navigator header="none" initialRouteName={AppRoutes.UPLOAD_TAB}>
      <Stack.Screen
        name={AppRoutes.UPLOAD_TAB}
        options={{
          headerShown: false,
        }}
        component={UploadScreen}
      />
      <Stack.Screen
        name={AppRoutes.FILTER_SCREEN}
        options={{
          headerShown: false,
        }}
        component={FilterScreen}
      />
      <Stack.Screen
        name={AppRoutes.CAPTION_SCREEN}
        options={{
          headerShown: false,
        }}
        component={CaptionScreen}
      />
    </Stack.Navigator>
  );
};
