import React, { useEffect } from 'react';
import { RootNavigator } from './navigator/root.navigator';
import { loadThemeType, saveThemeType } from './helpers/storage';
import { SafeAreaView, LogBox, StatusBar, StyleSheet } from 'react-native';
import { useRecoilState, useSetRecoilState } from 'recoil';
import type { ThemeColors } from './types/theme';
import { Typography } from './theme';
import { DynamicStatusBar, Theme, ThemeStatic } from './theme/Colors';
import FlashMessage from 'react-native-flash-message';
import { themeState, themeTypeState } from './recoil/theme/atoms';
import { useMeLazyQuery } from './graphql/queries/me.generated';
import LoadingIndicator from './components/shared/LoadingIndicator';
import { isLoginState } from './recoil/auth/atoms';
import { countNotificationState } from './recoil/app/atoms';
import { useCountUnSeenNotificationQuery } from './graphql/queries/countUnSeenNotification.generated';
import { useOnNewNotificationSubscription } from './graphql/subscriptions/onNewNotification.generated';

const App = React.memo(() => {
  const [theme, setTheme] = useRecoilState(themeState);
  const [themeType, setThemeType] = useRecoilState(themeTypeState);
  const [countNoti, setCountNotification] = useRecoilState(countNotificationState);
  const { barStyle, backgroundColor } = DynamicStatusBar[themeType];

  const setIsLogin = useSetRecoilState(isLoginState);

  const [getMe, { data, loading }] = useMeLazyQuery({
    onError: (err) => {
      console.log(err);
      setIsLogin(false);
    },
    onCompleted: () => {
      setIsLogin(true);
    },
  });

  useCountUnSeenNotificationQuery({
    // pollInterval: 5000,
    onCompleted: (res) => {
      setCountNotification(res.countUnSeenNotification);
    },
  });

  useOnNewNotificationSubscription({
    variables: { userId: data?.me.id ?? 0 },
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData.error) {
        console.log('delete comment sub', subscriptionData.error);
      } else {
        setCountNotification(countNoti + 1);
      }
    },
  });

  useEffect(() => {
    getMe();
  }, [getMe]);

  const initializeTheme = async () => {
    try {
      const themeType = await loadThemeType();
      toggleTheme(themeType || '');
    } catch ({ message }) {}
  };

  const initLoginState = () => {
    getMe();
  };

  React.useEffect(() => {
    initializeTheme();
    initLoginState();
  }, []);

  const toggleTheme = (type: string) => {
    setTheme(Theme[type].colors);
    setThemeType(type);
    saveThemeType(type);
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: theme.base,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <LoadingIndicator size={8} color={ThemeStatic.accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles(theme).container}>
      <StatusBar animated barStyle={barStyle} backgroundColor={backgroundColor} />
      <RootNavigator />
      <FlashMessage textStyle={styles(theme).flashMessageTitle} position="bottom" />
    </SafeAreaView>
  );
});

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.base,
    },
    flashMessageTitle: {
      ...Typography.FontWeights.Light,
      ...Typography.FontSizes.Body,
      color: ThemeStatic.white,
    },
  });

export default App;

LogBox.ignoreLogs(['RCTRootView cancelTouches']);
