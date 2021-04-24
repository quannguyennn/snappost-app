import React, { useEffect } from 'react';
import { RootNavigator } from './navigator/root.navigator';
import { loadThemeType, saveThemeType } from './helpers/storage';
import { SafeAreaView, LogBox, StatusBar, StyleSheet, Image, View, Text, TouchableOpacity } from 'react-native';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import type { ThemeColors } from './types/theme';
import { Typography } from './theme';
import { DynamicStatusBar, Theme, ThemeStatic } from './theme/Colors';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { themeState, themeTypeState } from './recoil/theme/atoms';
import { useMeLazyQuery } from './graphql/queries/me.generated';
import { isLoginState } from './recoil/auth/atoms';
import {
  countMessageState,
  countNotificationState,
  currentChatState,
  notificationNavigateState,
} from './recoil/app/atoms';
import { useCountUnSeenNotificationQuery } from './graphql/queries/countUnSeenNotification.generated';
import { useOnNewNotificationSubscription } from './graphql/subscriptions/onNewNotification.generated';
import { useGetChatHasUnseenMessageLazyQuery } from './graphql/queries/getChatHasUnseenMessage.generated';
import { useOnReceiveMessageSubscription } from './graphql/subscriptions/onReceiveMessage.generated';
import LottieView from 'lottie-react-native';
import Toast from 'react-native-toast-message';
import FastImage from 'react-native-fast-image';
import { AppRoutes } from './navigator/app-routes';

const App = React.memo(() => {
  const [theme, setTheme] = useRecoilState(themeState);
  const [themeType, setThemeType] = useRecoilState(themeTypeState);
  const [countNoti, setCountNotification] = useRecoilState(countNotificationState);
  const [unseenChat, setUnseenChat] = useRecoilState(countMessageState);
  const setNotificationNavigate = useSetRecoilState(notificationNavigateState);
  const { barStyle, backgroundColor } = DynamicStatusBar[themeType];
  const currentChat = useRecoilValue(currentChatState);

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

  const [getChatUnseen] = useGetChatHasUnseenMessageLazyQuery({
    onCompleted: (res) => {
      // @ts-ignore
      setUnseenChat(res.getChatHasUnseenMessage);
    },
  });

  useCountUnSeenNotificationQuery({
    pollInterval: 5000,
    fetchPolicy: 'network-only',
    onCompleted: (res) => {
      setCountNotification(res.countUnSeenNotification);
    },
  });

  useOnNewNotificationSubscription({
    variables: { userId: data?.me.id ?? 0 },
    fetchPolicy: 'no-cache',
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData.error) {
        console.log('delete comment sub', subscriptionData.error);
      } else {
        const navigateAction = () => {
          if (subscriptionData.data?.onNewNotification.link === '') {
            return;
          }
          const [path, id] = (subscriptionData.data?.onNewNotification?.link ?? '').split('-');

          if (path === 'user') {
            setNotificationNavigate({ screen: AppRoutes.PROFILE_VIEW_SCREEN, params: { userId: Number(id) } });
          } else if (path === 'post') {
            setNotificationNavigate({
              screen: AppRoutes.POST_VIEW_SCREEN,
              params: { postId: Number(id) },
            });
          }
          Toast.hide();
        };
        Toast.show({
          type: 'success',
          text1: subscriptionData.data?.onNewNotification.triggerInfo.name,
          text2: subscriptionData.data?.onNewNotification.content,
          props: {
            image: subscriptionData.data?.onNewNotification.triggerInfo.avatarFilePath,
            onPress: () => navigateAction(),
          },
        });
        setCountNotification(countNoti + 1);
      }
    },
  });

  useOnReceiveMessageSubscription({
    variables: { userId: data?.me.id ?? 0 },
    fetchPolicy: 'no-cache',
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData.error) {
        console.log('receive message sub', subscriptionData.error);
      } else {
        const chatId = subscriptionData.data?.onReceiveMessage.chatId;
        if (currentChat !== chatId) {
          Toast.show({
            type: 'success',
            text1: subscriptionData.data?.onReceiveMessage.message.senderInfo.name,
            text2: subscriptionData.data?.onReceiveMessage.message.content ?? '',
            props: {
              image: subscriptionData.data?.onReceiveMessage.message.senderInfo.avatarFilePath,
              onPress: () => {
                setNotificationNavigate({
                  screen: AppRoutes.CONVERSATION_SCREEN,
                  params: {
                    chatId: subscriptionData.data?.onReceiveMessage.chatId,
                    avatar: subscriptionData.data?.onReceiveMessage.message.senderInfo.avatarFilePath,
                    handle: subscriptionData.data?.onReceiveMessage.message.senderInfo.name,
                    targetId: subscriptionData.data?.onReceiveMessage.message.senderInfo.id,
                  },
                });
                Toast.hide();
              },
            },
          });
        }
        if (!unseenChat.includes(chatId)) {
          setUnseenChat([...unseenChat, chatId]);
        }
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
    getChatUnseen();
  }, [getChatUnseen, initLoginState]);

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
        <LottieView source={require('./assets1/loading.json')} autoPlay loop />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles(theme).container}>
      <StatusBar animated barStyle={barStyle} backgroundColor={backgroundColor} />
      <RootNavigator />
      <Toast
        ref={(ref) => Toast.setRef(ref)}
        position="top"
        visibilityTime={3500}
        config={{
          success: ({ text1, text2, props, ...rest }: any) => {
            return (
              <TouchableOpacity
                onPress={props.onPress}
                activeOpacity={0.95}
                style={{
                  width: '100%',
                  height: 'auto',
                  backgroundColor: 'rgba(132,107,226, 0.8)',
                  padding: 15,
                  margin: 5,
                  flexDirection: 'row',
                }}>
                <View style={{ marginRight: 10 }}>
                  <FastImage source={{ uri: props.image }} style={{ height: 50, width: 50, borderRadius: 50 }} />
                </View>
                <View>
                  <Text style={{ color: theme.white, fontWeight: 'bold', marginBottom: 8 }}>{text1}</Text>
                  <Text style={{ color: theme.white }}>{text2}</Text>
                </View>
              </TouchableOpacity>
            );
          },
        }}
      />
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
