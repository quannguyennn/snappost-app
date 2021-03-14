import React from 'react';
import { RootNavigator } from './navigator/root.navigator';
import { loadThemeType, saveThemeType } from './helpers/storage';
import { SafeAreaView, LogBox, StatusBar, StyleSheet } from 'react-native';
import { useRecoilState } from 'recoil';
import { themeState, themeTypeState } from './recoil/common/atoms';
import type { ThemeColors } from './types/theme';
import { Typography } from './theme';
import { DynamicStatusBar, Theme, ThemeStatic } from './theme/Colors';
import FlashMessage from "react-native-flash-message";


const App = React.memo(() => {
  const [theme, setTheme] = useRecoilState(themeState);
  const [themeType, setThemeType] = useRecoilState(themeTypeState);
  const { barStyle, backgroundColor } = DynamicStatusBar[themeType];

  const initializeTheme = async () => {
    try {
      const themeType = await loadThemeType();
      toggleTheme(themeType || '');
    } catch ({ message }) { }
  };

  React.useEffect(() => {
    initializeTheme();
  }, []);

  const toggleTheme = (type: string) => {
    setTheme(Theme[type].colors);
    setThemeType(type);
    saveThemeType(type);
  };

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
