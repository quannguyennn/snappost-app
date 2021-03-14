import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { AuthNavigator } from './auth.navigator';
import { AppNavigator } from './app.navigator';
import { AppRoutes } from './app-routes';
import { useMeLazyQuery, useMeQuery } from '../graphql/queries/me.generated';
import { ActivityIndicator, SafeAreaView } from 'react-native';

export type RootStackParamList = {
  [AppRoutes.AUTH]: undefined;
  [AppRoutes.APP]: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

type RootStackNavigatorProps = React.ComponentProps<typeof Stack.Navigator>;

export const RootNavigator = (props: Partial<RootStackNavigatorProps>): React.ReactElement => {
  const [getMe, { data, loading }] = useMeLazyQuery({
    onError: (err) => {
      console.log(err)
    }
  })

  useEffect(() => {
    getMe()
  }, [])

  if (loading) {
    return <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator />
    </SafeAreaView>
  }

  return (
    <Stack.Navigator {...props} headerMode="none">
      {
        data?.me ? <Stack.Screen name={AppRoutes.APP} component={AppNavigator} />
          : <Stack.Screen name={AppRoutes.AUTH} component={AuthNavigator} />

      }
    </Stack.Navigator>
  )
};
