import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { AuthNavigator } from './auth.navigator';
import { AppNavigator } from './app.navigator';
import { AppRoutes } from './app-routes';

import { useRecoilValue } from 'recoil';
import { isLoginState } from '../recoil/auth/atoms';

export type RootStackParamList = {
  [AppRoutes.AUTH]: undefined;
  [AppRoutes.APP]: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

type RootStackNavigatorProps = React.ComponentProps<typeof Stack.Navigator>;

export const RootNavigator = (props: Partial<RootStackNavigatorProps>): React.ReactElement => {
  const isLogin = useRecoilValue(isLoginState);

  return (
    <Stack.Navigator {...props} headerMode="none">
      {isLogin ? (
        <Stack.Screen name={AppRoutes.APP} component={AppNavigator} />
      ) : (
        <Stack.Screen name={AppRoutes.AUTH} component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};
