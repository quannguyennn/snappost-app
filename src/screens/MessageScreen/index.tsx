import React, { useEffect, useState, useRef } from 'react';
import { FlatList, Image, StyleSheet, View } from 'react-native';
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
import { somethingWentWrongErrorNotification, tryAgainLaterNotification } from '../../helpers/notifications';
import IconButton from '../../components/shared/Iconbutton';
import { IconSizes } from '../../theme/Icon';
import Header from '../../components/shared/layout/headers/Header';
import SearchBar from '../../components/shared/layout/headers/SearchBar';
import type { ThemeColors } from '../../types/theme';
import { GetChatsQueryResponse, useGetChatsLazyQuery } from '../../graphql/queries/getChats.generated';
import { useCreateChatMutation } from '../../graphql/mutations/createChat.generated';
import { useGetExistChatLazyQuery } from '../../graphql/queries/getExistChat.generated';
import { AppRoutes } from '../../navigator/app-routes';

const MessageScreen: React.FC = () => {
  const { navigate } = useNavigation();
  const theme = useRecoilValue(themeState);
  const user = useCurrentUser();
  const isFocus = useIsFocused();

  const [refresh, setRefresh] = useState(false);
  const [target, setTarget] = useState(0);

  const [createTemporaryChat] = useCreateChatMutation({
    onCompleted: (res) => {
      const [participant] = filterChatParticipants(user?.id ?? 0, res?.createChat?.participantInfo);

      navigate(AppRoutes.CONVERSATION_SCREEN, {
        chatId: res.createChat.id,
        avatar: participant.avatarFilePath,
        handle: participant.name,
        targetId: participant.id,
      });
    },
  });

  const [getExist] = useGetExistChatLazyQuery({
    fetchPolicy: 'network-only',
    onCompleted: (res) => {
      console.log(res);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      newMessageBottomSheetRef?.current?.close();
      if (res.getExistChat) {
        const [participant] = filterChatParticipants(user?.id ?? 0, res.getExistChat.participantInfo);

        navigate(AppRoutes.CONVERSATION_SCREEN, {
          chatId: res.getExistChat.id,
          avatar: participant.avatarFilePath,
          handle: participant.name,
          targetId: participant.id,
        });
      } else {
        createTemporaryChat({ variables: { participants: [target, user?.id ?? 0] } });
      }
    },
    onError: (err) => {
      console.log('exist chat', err);
      tryAgainLaterNotification();
    },
  });

  const [queryChats, { called, data: fetchData, loading, error, fetchMore }] = useGetChatsLazyQuery({
    fetchPolicy: 'cache-and-network',
    onError: (err) => {
      console.log('chat list', err);
      somethingWentWrongErrorNotification();
    },
    onCompleted: () => {
      console.log(111);
      // if (refresh) {
      //   setRefresh(false);
      // }
    },
  });

  // const currentPage =
  //   Number(fetchData?.getChats?.meta.currentPage) >= 0 ? Number(fetchData?.getChats?.meta.currentPage) : 1;
  // const totalPages =
  //   Number(fetchData?.getChats?.meta.totalPages) >= 0 ? Number(fetchData?.getChats?.meta.totalPages) : 2;

  const data = fetchData?.getChats.items;

  // const loadMore = () => {
  //   console.log(33);
  //   if (Number(currentPage) < Number(totalPages)) {
  //     console.log(22);
  //     fetchMore &&
  //       fetchMore({
  //         variables: { limit: 20, page: currentPage + 1 },
  //         updateQuery: (prev: GetChatsQueryResponse, { fetchMoreResult }) => {
  //           if (!fetchMoreResult) {
  //             return prev;
  //           }
  //           const prevItem = prev?.getChats?.items ? prev?.getChats?.items : [];
  //           const nextItem = fetchMoreResult.getChats?.items ? fetchMoreResult.getChats?.items : [];
  //           return Object.assign({}, prev, {
  //             getChats: {
  //               items: [...prevItem, ...nextItem],
  //               meta: fetchMoreResult.getChats?.meta,
  //               __typename: 'ChatConnection',
  //             },
  //           });
  //         },
  //       });
  //   }
  // };

  const [chatSearch, setChatSearch] = useState('');
  const newMessageBottomSheetRef = useRef();

  // useEffect(() => {
  //   if (refresh) {
  //     console.log('refresh');
  //     queryChats({ variables: { limit: 20, page: 1 } });
  //   }
  // }, [refresh, queryChats]);

  useEffect(() => {
    console.log('load');
    queryChats({ variables: { limit: 20, page: 1 } });
  }, [queryChats]);

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

  console.log(data);

  if (called && !loading && !error) {
    content = (
      <FlatList
        // onRefresh={() => {
        //   setRefresh(true);
        // }}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
        data={data}
        ListEmptyComponent={() => (
          <SvgBanner Svg={<Image source={Images.emptyMessage} />} spacing={16} placeholder="No messages" />
        )}
        style={styles().messagesList}
        renderItem={renderItem}
        // refreshing={refresh}
        // onEndReached={() => {}}
        // onEndReachedThreshold={0.1}
      />
    );
  }

  const onConnectionSelect = async (targetId: number) => {
    // setTarget(targetId);
    try {
      // getExist({ variables: { participants: [targetId, user?.id ?? 0] } });
      // @ts-ignore
    } catch ({ message }) {
      console.log(message);
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
      <NewMessageBottomSheet ref={null} onConnectionSelect={onConnectionSelect} />
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
