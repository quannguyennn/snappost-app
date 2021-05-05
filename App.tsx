import React from 'react';
import { StatusBar, Text, useColorScheme } from 'react-native';
import { ApolloProvider } from '@apollo/client';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { client } from './src/apollo/client';
import RootApp from './src/RootApp';
import RNBootSplash from 'react-native-bootsplash';
import { RecoilRoot } from 'recoil';

const App = () => {
  const colorScheme = useColorScheme();

  RNBootSplash.hide(); // immediate
  return (
    <ApolloProvider client={client}>
      <RecoilRoot>
        <SafeAreaProvider>
          <StatusBar backgroundColor="transparent" />
          <NavigationContainer
            theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
            fallback={<Text>Loading...</Text>}>
            <RootApp />
          </NavigationContainer>
        </SafeAreaProvider>
      </RecoilRoot>
    </ApolloProvider>
  );
};

export default App;
