import React, { useEffect, useState, useRef } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, View } from 'react-native';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { FlatGrid } from 'react-native-super-grid';
import MessageCard from './components/MessageCard';
import NewMessageBottomSheet from './components/NewMessageBottomSheet';
import Entypo from 'react-native-vector-icons/Entypo';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../recoil/theme/atoms';
import { filterChatParticipants, isUserOnline } from '../../utils/shared';
import MessageScreenPlaceholder from '../../components/placeholders/MessageScreen.Placeholder';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import SvgBanner from '../../components/shared/SvgBanner';
import { Images } from '../../assets1/icons';
import {
  postDeletedNotification,
  somethingWentWrongErrorNotification,
  tryAgainLaterNotification,
} from '../../helpers/notifications';
import IconButton from '../../components/shared/Iconbutton';
import { IconSizes } from '../../theme/Icon';
import Header from '../../components/shared/layout/headers/Header';
import SearchBar from '../../components/shared/layout/headers/SearchBar';
import type { ThemeColors } from '../../types/theme';
import { GetChatsQueryResponse, useGetChatsLazyQuery } from '../../graphql/queries/getChats.generated';
import { useCreateChatMutation } from '../../graphql/mutations/createChat.generated';

const MessageScreen: React.FC = () => {
  const { navigate } = useNavigation();
  const isFocus = useIsFocused();
  const theme = useRecoilValue(themeState);
  const user = useCurrentUser();

  const [refresh, setRefresh] = useState(false);

  const [queryChats, { called, data: fetchData, loading, error, fetchMore }] = useGetChatsLazyQuery({
    fetchPolicy: 'cache-and-network',
    onError: (err) => {
      console.log('chat list', err);
      somethingWentWrongErrorNotification();
    },
    onCompleted: () => {
      setRefresh(false);
    },
  });

  const currentPage =
    Number(fetchData?.getChats?.meta.currentPage) >= 0 ? Number(fetchData?.getChats?.meta.currentPage) : 1;
  const totalPages =
    Number(fetchData?.getChats?.meta.totalPages) >= 0 ? Number(fetchData?.getChats?.meta.totalPages) : 2;

  const data = fetchData?.getChats.items;

  const loadMore = () => {
    if (Number(currentPage) < Number(totalPages)) {
      fetchMore &&
        fetchMore({
          variables: { limit: 12, page: currentPage + 1 },
          updateQuery: (prev: GetChatsQueryResponse, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return prev;
            }
            const prevItem = prev?.getChats?.items ? prev?.getChats?.items : [];
            const nextItem = fetchMoreResult.getChats?.items ? fetchMoreResult.getChats?.items : [];
            return Object.assign({}, prev, {
              getChats: {
                items: [...prevItem, ...nextItem],
                meta: fetchMoreResult.getChats?.meta,
                __typename: 'ChatConnection',
              },
            });
          },
        });
    }
  };

  const [createTemporaryChat] = useCreateChatMutation();

  const [chatSearch, setChatSearch] = useState('');
  const newMessageBottomSheetRef = useRef();

  useEffect(() => {
    if (isFocus || refresh) {
      queryChats({ variables: { limit: 20, page: 1 } });
    }
  }, [queryChats, isFocus, refresh]);

  const renderItem = ({ item }) => {
    const { id: chatId, participantInfo, lastMessageData } = item;
    const [participant] = filterChatParticipants(user?.id ?? 0, participantInfo);
    const { id, avatarFilePath, name, lastSeen } = participant;

    const isOnline = isUserOnline(lastSeen);
    return (
      <MessageCard
        chatId={chatId}
        participantId={id}
        avatar={avatarFilePath ?? ''}
        handle={name}
        authorId={lastMessageData ? lastMessageData.senderInfo.id : 0}
        messageId={lastMessageData ? lastMessageData.id : 0}
        messageBody={lastMessageData ? lastMessageData.content : ''}
        seen={lastMessageData ? lastMessageData.isRead : false}
        time={lastMessageData ? lastMessageData.senderInfo.id : undefined}
        isOnline={isOnline}
      />
    );
  };

  let content = <MessageScreenPlaceholder />;

  if (called && !loading && !error) {
    content = (
      <FlatList
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
        data={data}
        ListEmptyComponent={() => (
          <SvgBanner Svg={<Image source={Images.emptyMessage} />} spacing={16} placeholder="No messages" />
        )}
        style={styles().messagesList}
        renderItem={renderItem}
        onRefresh={() => {
          setRefresh(true);
        }}
        onEndReachedThreshold={0.3}
        ListFooterComponent={loading && data?.length ? <ActivityIndicator /> : null}
        refreshing={refresh}
        onEndReached={() => loadMore()}
      />
    );
  }

  const onConnectionSelect = async (targetId: number, avatar: string, handle: string) => {
    try {
      // const {
      //   data: { chatExists },
      // } = await client.query({
      //   query: QUERY_CHAT_EXISTS,
      //   variables: { userId: user.id, targetId },
      //   fetchPolicy: 'no-cache',
      // });
      // // @ts-ignore
      // newMessageBottomSheetRef.current.close();
      // if (chatExists) {
      //   navigate(Routes.ConversationScreen, { chatId: chatExists.id, avatar, handle, targetId });
      // } else {
      //   const { data } = await createTemporaryChat();
      //   navigate(Routes.ConversationScreen, { chatId: data.createTemporaryChat.id, avatar, handle, targetId });
      // }
    } catch ({ message }) {
      tryAgainLaterNotification();
    }
  };

  const IconRight = () => (
    <IconButton
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      onPress={() => newMessageBottomSheetRef?.current?.open()}
      Icon={() => <Entypo name="add-to-list" size={IconSizes.x6} color={theme.text01} />}
    />
  );

  return (
    <View style={styles(theme).container}>
      <Header title="Messages" IconRight={IconRight} />
      <SearchBar value={chatSearch} onChangeText={setChatSearch} placeholder="Search for chats..." />
      {content}
      <NewMessageBottomSheet ref={newMessageBottomSheetRef} onConnectionSelect={onConnectionSelect} />
    </View>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.base,
    },
    messagesList: {
      flex: 1,
      paddingHorizontal: 4,
    },
  });

export default MessageScreen;
