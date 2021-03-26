import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
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
import { useRecoilValue } from 'recoil';
import { themeState } from '../../recoil/theme/atoms';
import { transformMessages } from '../../utils/shared';
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

const ConversationScreen: React.FC = () => {
  const {
    params: { chatId, handle, avatar, targetId },
  } = useRoute<RouteProp<AppStackParamList, AppRoutes.CONVERSATION_SCREEN>>();
  const upload = useFileUpload({
    onUploadProgress: (progressEvent) => {
      console.log(progressEvent);
    },
  });
  const isFocused = useIsFocused();

  const { navigate } = useNavigation();
  const user = useCurrentUser();
  const theme = useRecoilValue(themeState);

  const [messages, setMessages] = useState<GetMessageQueryResponse['getMessage']['items']>([]);
  const [loadEarlier, setLoadEarlier] = useState(false);

  const albumnRef = useRef<Modalize>(null);

  const [loading, setLoading] = useState(false);
  const [medias, setMedias] = useState<PhotoIdentifier[]>([]);
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<PhotoIdentifier['node']['image']>();

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
    const getMedia = async () => {
      setLoading(true);
      if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
        noPermissionNotification();
        return;
      }
      CameraRoll.getPhotos({ first: page * 50, assetType: 'Photos' }).then((res) => {
        setMedias(res.edges);
        setLoading(false);
      });
    };
    getMedia();
  }, [isFocused, page]);

  const [
    queryChat,
    { called: chatQueryCalled, data: chatQueryData, loading: chatQueryLoading, error: chatQueryError, fetchMore },
  ] = useGetMessageLazyQuery({
    fetchPolicy: 'network-only',
    onCompleted: (res) => {
      setMessages(res.getMessage.items ?? []);
      setLoadEarlier(false);
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
        // @ts-ignore
        setMessages([subscriptionData.data?.onNewMessage, ...messages]);
      }
    },
  });
  const [addMessage] = useSendMessageMutation();

  useEffect(() => {
    queryChat({
      variables: {
        chatId,
        limit: 20,
        page: 1,
      },
    });
  }, [chatId, queryChat]);

  const onSend = async (updatedMessages: any) => {
    const [updatedMessage] = updatedMessages;
    addMessage({
      variables: {
        input: {
          chatId,
          content: updatedMessage.text,
        },
      },
    });
  };

  const navigateToProfile = () => {
    navigate(AppRoutes.PROFILE_VIEW_SCREEN, { userId: targetId });
  };

  let content = <ConversationScreenPlaceholder />;

  if (chatQueryCalled && !chatQueryLoading && !chatQueryError) {
    const transform = transformMessages(messages);

    content = (
      <GiftedChat
        isCustomViewBottom
        scrollToBottom
        alwaysShowSend
        inverted
        maxInputLength={200}
        messages={transform}
        timeFormat="A h:mm"
        scrollToBottomComponent={CustomScrollToBottom}
        textInputProps={{ disable: true }}
        renderComposer={(composerProps) => <CustomComposer {...composerProps} />}
        renderMessageText={CustomMessageText}
        renderBubble={CustomBubble}
        renderSend={CustomSend}
        renderInputToolbar={CustomInputToolbar}
        onSend={onSend}
        onPressAvatar={navigateToProfile}
        user={{ _id: user?.id ?? 0, avatar: user?.avatarFilePath ?? '', name: user?.name }}
        bottomOffset={ifIphoneX(20, -10)}
        keyboardShouldPersistTaps={null}
        renderAvatarOnTop
        infiniteScroll
        loadEarlier={loadEarlier}
        isLoadingEarlier={loadEarlier}
        onPressActionButton={() => albumnRef.current?.open()}
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
    );
  }

  const handleSelectImage = async (image: PhotoIdentifier['node']['image']) => {
    setSelectedImage(image);
  };

  return (
    <View style={styles(theme).container}>
      <GoBackHeader
        title={handle}
        onTitlePress={navigateToProfile}
        iconSize={IconSizes.x7}
        ContentLeft={() => <ChatHeaderAvatar avatar={avatar} onPress={navigateToProfile} />}
        titleStyle={styles().headerTitleStyle}
        notSpaceBetween
      />
      {content}
      <Modalize
        //@ts-ignore
        ref={albumnRef}
        scrollViewProps={{ showsVerticalScrollIndicator: false }}
        modalStyle={styles(theme).modalContainer}>
        <FlatList
          data={medias}
          style={{ flex: 1 }}
          contentContainerStyle={styles(theme).content}
          keyExtractor={(item, index) => index.toString() + 'image list'}
          numColumns={3}
          horizontal={false}
          onEndReachedThreshold={0.3}
          onEndReached={() => setPage(page + 1)}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[styles(theme).image]}
              onPress={() => {
                handleSelectImage(item.node.image);
              }}>
              <Image source={{ uri: item.node.image.uri }} style={{ height: '100%', width: '100%' }} />
            </TouchableOpacity>
          )}
        />
      </Modalize>
    </View>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.base,
    },
    modalContainer: {
      flex: 1,
      marginTop: 30,
      backgroundColor: theme.base,
      paddingTop: 40,
    },
    headerTitleStyle: {
      marginLeft: 0,
    },
    image: {
      width: '32%',
      marginBottom: 8,
      marginRight: 8,
      borderRadius: 20,
      height: 100,
    },
    content: {
      paddingHorizontal: 20,
    },
  });

export default ConversationScreen;
