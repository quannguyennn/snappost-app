import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Actions, GiftedChat } from 'react-native-gifted-chat';
import ChatHeaderAvatar from './components/ChatHeaderAvatar';
import CustomBubble from './components/CustomBubble';
import CustomComposer from './components/CustomComposer';
import CustomInputToolbar from './components/CustomInputToolbar';
import CustomMessageText from './components/CustomMessageText';
import CustomSend from './components/CustomSend';
import CustomScrollToBottom from './components/CustomScrollToBottom';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { themeState } from '../../recoil/theme/atoms';
import { isUserOnline, transformMessages } from '../../utils/shared';
import ConversationScreenPlaceholder from '../../components/placeholders/ConversationScreen.Placeholder';
import { AppRoutes } from '../../navigator/app-routes';
import { GetMessageQueryResponse, useGetMessageLazyQuery } from '../../graphql/queries/getMessage.generated';
import type { AppStackParamList } from '../../navigator/app.navigator';
import { useSendMessageMutation } from '../../graphql/mutations/sendMessage.generated';
import { useOnNewMessageSubscription } from '../../graphql/subscriptions/onNewMessage.generated';
import GoBackHeader from '../../components/shared/layout/headers/GoBackHeader';
import { IconSizes } from '../../theme/Icon';
import type { ThemeColors } from '../../types/theme';
import { noPermissionNotification, somethingWentWrongErrorNotification } from '../../helpers/notifications';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ThemeStatic } from '../../theme';
import { Modalize } from 'react-native-modalize';
import CameraRoll, { PhotoIdentifier } from '@react-native-community/cameraroll';
import { useFileUpload } from '../../hooks/useFileUpload';
import Entypo from 'react-native-vector-icons/Entypo';
import { MediaType, NewMessageInput } from '../../graphql/type.interface';
import { useOnSeenMessageSubscription } from '../../graphql/subscriptions/onSeenMessage.generated';
import { countMessageState, currentChatState } from '../../recoil/app/atoms';
import { useGetUserLasActiveQuery } from '../../graphql/queries/getUserLastActive.generated';
import moment from 'moment';
import { useSetSeenMessageMutation } from '../../graphql/mutations/setSeenMessage.generated';
import { SafeAreaView } from 'react-native-safe-area-context';

const ConversationScreen: React.FC = () => {
  const {
    params: { chatId, handle, avatar, targetId },
  } = useRoute<RouteProp<AppStackParamList, AppRoutes.CONVERSATION_SCREEN>>();
  const [upload] = useFileUpload();
  const isFocused = useIsFocused();

  const { navigate, addListener, dispatch } = useNavigation();
  const user = useCurrentUser();
  const theme = useRecoilValue(themeState);
  const [unseenChat, setUnseenChat] = useRecoilState(countMessageState);
  const setCurrentChat = useSetRecoilState(currentChatState);

  const { data } = useGetUserLasActiveQuery({
    pollInterval: 2000,
    variables: { id: targetId },
    fetchPolicy: 'network-only',
    onCompleted: (res) => {
      console.log(res);
    },
  });

  const [messages, setMessages] = useState<GetMessageQueryResponse['getMessage']['items']>([]);
  const [loadEarlier, setLoadEarlier] = useState(false);

  const [medias, setMedias] = useState<PhotoIdentifier[]>([]);
  const [page, setPage] = useState(1);
  const [openMedia, setOpenMedia] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [init, setInit] = useState(true);
  const [isKeyboard, setIsKeyboard] = useState(false);

  useEffect(() => {
    Keyboard.addListener('keyboardWillShow', keyboardShow);
    Keyboard.addListener('keyboardDidHide', keyboardHide);
    setCurrentChat(chatId);

    return () => {
      Keyboard.removeListener('keyboardWillShow', keyboardShow);
      Keyboard.removeListener('keyboardDidHide', keyboardHide);
      addListener('beforeRemove', (e) => {
        e.preventDefault();
        setCurrentChat(0);
        dispatch(e.data.action);
      });
    };
  }, [chatId, setCurrentChat, addListener, dispatch]);

  const keyboardShow = () => setIsKeyboard(true);
  const keyboardHide = () => setIsKeyboard(false);

  async function hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }

  useEffect(() => {
    if (openMedia) {
      setTimeout(() => {
        //@ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        albumRef?.current?.open();
      }, 100);

      const getMedia = async () => {
        if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
          noPermissionNotification();
          return;
        }
        CameraRoll.getPhotos({ first: page * 50, assetType: 'Photos' }).then((res) => {
          setMedias(res.edges);
        });
      };
      getMedia();
    }
  }, [isFocused, page, openMedia]);

  useEffect(() => {
    if (openMedia && !isKeyboard) {
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        albumRef?.current?.open();
      }, 100);
    } else if (openMedia && isKeyboard) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      albumRef?.current?.close();
    }
  }, [openMedia, isKeyboard]);

  const [
    queryChat,
    { called: chatQueryCalled, data: chatQueryData, loading: chatQueryLoading, error: chatQueryError, fetchMore },
  ] = useGetMessageLazyQuery({
    fetchPolicy: 'cache-and-network',
    onCompleted: (res) => {
      setMessages(res.getMessage.items ?? []);
      setLoadEarlier(false);
      setInit(false);
      setUnseenChat([...unseenChat].filter((item) => item !== chatId));
    },
    onError: (err) => {
      console.log('list message', err);
      somethingWentWrongErrorNotification();
    },
  });

  const currentPage =
    Number(chatQueryData?.getMessage?.meta.currentPage) >= 0 ? Number(chatQueryData?.getMessage?.meta.currentPage) : 1;
  const totalPages =
    Number(chatQueryData?.getMessage?.meta.totalPages) >= 0 ? Number(chatQueryData?.getMessage?.meta.totalPages) : 2;

  const loadMore = () => {
    if (Number(currentPage) < Number(totalPages)) {
      fetchMore &&
        fetchMore({
          variables: { limit: 20, page: currentPage + 1 },
          updateQuery: (prev: GetMessageQueryResponse, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return prev;
            }
            const prevItem = prev?.getMessage?.items ? prev?.getMessage?.items : [];
            const nextItem = fetchMoreResult.getMessage?.items ? fetchMoreResult.getMessage?.items : [];
            setMessages([...prevItem, ...nextItem]);
            return Object.assign({}, prev, {
              getMessage: {
                items: [...prevItem, ...nextItem],
                meta: fetchMoreResult.getMessage?.meta,
                __typename: 'MessageConnection',
              },
            });
          },
        });
    }
  };

  useOnNewMessageSubscription({
    variables: { chatId },
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData.error) {
        console.log('on new Message', subscriptionData.error);
      } else {
        if (subscriptionData.data?.onNewMessage.senderInfo.id !== user?.id) {
          // @ts-ignore
          setMessages([subscriptionData.data?.onNewMessage, ...messages]);
        } else {
          const index = messages?.findIndex((item) => item.tempId === subscriptionData.data?.onNewMessage?.tempId);
          if (index !== -1) {
            const temp = [...messages];
            temp[index ?? 0].sent = true;
            setMessages(temp);
          }
          if (subscriptionData.data?.onNewMessage.sender !== user?.id) {
            seenMessage({ variables: { chatId } });
          }
        }
      }
    },
  });

  useOnSeenMessageSubscription({
    variables: { chatId },
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData.error) {
        console.log('on seen Message', subscriptionData.error);
      } else {
        const seenId = subscriptionData.data?.onSeenMessage.userId;
        const temp = [...messages].map((item) => {
          if (item.senderInfo.id !== seenId) {
            return { ...item, received: true };
          }
          return item;
        });
        setMessages(temp);
      }
    },
  });

  const [addMessage] = useSendMessageMutation({
    onError: (err) => {
      console.log('send message', err);
    },
  });

  const [seenMessage] = useSetSeenMessageMutation();

  useEffect(() => {
    if (init) {
      queryChat({
        variables: {
          chatId,
          limit: 20,
          page: 1,
        },
      });
    }
  }, [chatId, queryChat, init]);

  const onSend = async (updatedMessages: any) => {
    const [updatedMessage] = updatedMessages;
    const newMessage = {
      id: updatedMessage._id,
      content: updatedMessage.text,
      createdAt: updatedMessage.createdAt,
      senderInfo: {
        id: user?.id ?? 0,
        name: user?.name,
        avatarFilePath: user?.avatarFilePath ?? '',
      },
      media: selectedIndex !== -1 ? medias[selectedIndex].node.image.uri : null,
      mediaType: selectedIndex !== -1 ? MediaType.IMAGE : null,
      sent: false,
      received: false,
      pending: false,
      tempId: updatedMessage._id,
    };
    setMessages([newMessage, ...messages]);
    setSelectedIndex(-1);

    const input: NewMessageInput = {
      chatId,
      content: updatedMessage.text,
      tempId: updatedMessage._id,
    };

    if (selectedIndex !== -1) {
      const resMedia = await upload(medias[selectedIndex].node.image);
      input.media = resMedia.filePath;
      input.mediaType = MediaType.IMAGE;
    }

    addMessage({
      variables: {
        input,
      },
    });
  };

  const navigateToProfile = () => {
    navigate(AppRoutes.PROFILE_VIEW_SCREEN, { userId: targetId });
  };

  const transform = transformMessages(messages);

  const albumRef = useRef(null);

  const handleSelectImage = async (index: number) => {
    if (index !== selectedIndex) {
      setSelectedIndex(index);
    } else {
      setSelectedIndex(-1);
    }
  };

  return (
    <SafeAreaView style={styles(theme).container}>
      <GoBackHeader
        title={handle}
        onTitlePress={navigateToProfile}
        iconSize={IconSizes.x7}
        ContentLeft={() => (
          <ChatHeaderAvatar
            isOnline={isUserOnline(data?.getUserInfo?.lastSeen)}
            avatar={avatar}
            onPress={navigateToProfile}
          />
        )}
        titleStyle={styles().headerTitleStyle}
        notSpaceBetween
        subTitle={isUserOnline(data?.getUserInfo?.lastSeen) ? 'Active' : moment(data?.getUserInfo?.lastSeen).fromNow()}
      />
      {init && chatQueryLoading ? <ConversationScreenPlaceholder /> : null}
      <GiftedChat
        isTyping
        scrollToBottom
        alwaysShowSend
        inverted
        maxInputLength={200}
        messages={transform}
        // timeFormat="A h:mm"
        scrollToBottomComponent={CustomScrollToBottom}
        textInputProps={{ disable: true }}
        renderComposer={(composerProps) => <CustomComposer {...composerProps} />}
        renderMessageText={CustomMessageText}
        renderBubble={(props) => <CustomBubble {...props} />}
        renderSend={CustomSend}
        renderInputToolbar={(props) => <CustomInputToolbar {...props} />}
        onSend={onSend}
        onPressAvatar={navigateToProfile}
        user={{ _id: user?.id ?? 0, avatar: user?.avatarFilePath ?? '', name: user?.name }}
        bottomOffset={ifIphoneX(20, -10)}
        keyboardShouldPersistTaps={null}
        renderAvatarOnTop
        infiniteScroll
        loadEarlier={loadEarlier}
        isLoadingEarlier={loadEarlier}
        onPressActionButton={() => {
          setOpenMedia(true);
        }}
        renderLoadEarlier={() => (
          <View style={{ paddingVertical: 5 }}>
            <ActivityIndicator />
          </View>
        )}
        renderActions={(props) => (
          <Actions
            containerStyle={{ alignItems: 'center', justifyContent: 'center', marginTop: 10 }}
            {...props}
            icon={() => <FontAwesome name="photo" size={IconSizes.x5} color={ThemeStatic.accent} />}
          />
        )}
        listViewProps={{
          showsVerticalScrollIndicator: false,
          style: { marginBottom: 16 },
          onEndReachedThreshold: 0.3,
          onEndReached: () => {
            loadMore();
          },
        }}
      />
      {openMedia && !isKeyboard ? (
        <View style={{ flex: 0.7, marginTop: 10, backgroundColor: theme.base }}>
          <Modalize
            ref={albumRef}
            scrollViewProps={{ showsVerticalScrollIndicator: false }}
            modalStyle={styles(theme).pickerContainer}
            onClose={() => {
              setOpenMedia(false);
              setSelectedIndex(-1);
            }}>
            <FlatList
              data={medias}
              style={{ flex: 1 }}
              contentContainerStyle={styles(theme).content}
              keyExtractor={(item, index) => index.toString() + 'image list'}
              numColumns={4}
              horizontal={false}
              onEndReachedThreshold={0.3}
              onEndReached={() => setPage(page + 1)}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[styles(theme).image]}
                  onPress={() => {
                    handleSelectImage(index);
                  }}>
                  <Image source={{ uri: item.node.image.uri }} style={{ height: '100%', width: '100%' }} />
                  {openMedia && selectedIndex !== -1 && index === selectedIndex ? (
                    <View style={styles(theme).selectedContainer}>
                      <View style={styles(theme).selectedCircle}>
                        <Entypo name="check" size={IconSizes.x4} color={ThemeStatic.white} />
                      </View>
                    </View>
                  ) : null}
                </TouchableOpacity>
              )}
            />
          </Modalize>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.base,
    },
    pickerContainer: {
      marginTop: 16,
      backgroundColor: theme.base,
      paddingVertical: 10,
      flex: 1,
    },
    headerTitleStyle: {
      marginLeft: 0,
    },
    image: {
      width: '25%',
      borderRadius: 20,
      aspectRatio: 1,
      borderWidth: 1,
      borderColor: theme.base,
    },
    content: {},
    selectedContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: theme.base,
      opacity: 0.7,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 99,
    },
    selectedCircle: {
      backgroundColor: theme.accent,
      padding: 6,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 100,
      borderRadius: 100,
    },
  });

export default ConversationScreen;
