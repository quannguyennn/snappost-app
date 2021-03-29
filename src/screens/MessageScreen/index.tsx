import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import MessageCard from './components/MessageCard';
import Entypo from 'react-native-vector-icons/Entypo';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../recoil/theme/atoms';
import { filterChatParticipants, isUserOnline } from '../../utils/shared';
import MessageScreenPlaceholder from '../../components/placeholders/MessageScreen.Placeholder';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import SvgBanner from '../../components/shared/SvgBanner';
import { Images } from '../../assets1/icons';
import { somethingWentWrongErrorNotification } from '../../helpers/notifications';
import IconButton from '../../components/shared/Iconbutton';
import { IconSizes } from '../../theme/Icon';
import Header from '../../components/shared/layout/headers/Header';
import SearchBar from '../../components/shared/layout/headers/SearchBar';
import type { ThemeColors } from '../../types/theme';
import { GetChatsQueryResponse, useGetChatsLazyQuery } from '../../graphql/queries/getChats.generated';
import ListPeopleToChat from './components/ListPeopleToChat';
import GoBackHeader from '../../components/shared/layout/headers/GoBackHeader';

const MessageScreen: React.FC = () => {
  const theme = useRecoilValue(themeState);
  const user = useCurrentUser();
  const isFocus = useIsFocused();

  const [refresh, setRefresh] = useState(false);
  const [init, setInit] = useState(true);

  const [queryChats, { data: fetchData, loading, fetchMore }] = useGetChatsLazyQuery({
    fetchPolicy: 'cache-and-network',
    onError: (err) => {
      console.log('chat list', err);
      somethingWentWrongErrorNotification();
    },
    onCompleted: () => {
      if (refresh) {
        setRefresh(false);
      }
      setInit(false);
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
          variables: { limit: 20, page: currentPage + 1 },
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

  useEffect(() => {
    if (refresh || init || isFocus) {
      queryChats({ variables: { limit: 20, page: 1 } });
    }
  }, [queryChats, refresh, init, isFocus]);

  const renderItem = ({ item }) => {
    const { id: chatId, participantInfo, lastMessageData, unseenMessage } = item;
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
        time={lastMessageData ? lastMessageData.createdAt : undefined}
        isOnline={isOnline}
        unseen={unseenMessage}
      />
    );
  };

  console.log(loading && init);

  return (
    <View style={styles(theme).container}>
      <GoBackHeader title="Messages" notSpaceBetween iconSize={IconSizes.x7} />
      {/* <SearchBar value={chatSearch} onChangeText={setChatSearch} placeholder="Search for chats..." /> */}

      {loading && init ? (
        <MessageScreenPlaceholder />
      ) : (
        <FlatList
          onRefresh={() => {
            setRefresh(true);
          }}
          ListHeaderComponent={<ListPeopleToChat />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          showsVerticalScrollIndicator={false}
          data={data}
          ListEmptyComponent={() => (
            <SvgBanner Svg={<Image source={Images.emptyMessage} />} spacing={16} placeholder="No messages" />
          )}
          style={styles().messagesList}
          renderItem={renderItem}
          refreshing={refresh}
          onEndReached={() => {
            loadMore();
          }}
          onEndReachedThreshold={0.1}
        />
      )}
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
