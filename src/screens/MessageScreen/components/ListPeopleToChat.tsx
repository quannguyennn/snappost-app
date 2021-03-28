import { useNavigation } from '@react-navigation/core';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRecoilValue } from 'recoil';
import UserRowPlaceholder from '../../../components/placeholders/UserRow.Placeholder';
import NativeImage from '../../../components/shared/NativeImage';
import { useCreateChatMutation } from '../../../graphql/mutations/createChat.generated';
import { useGetExistChatLazyQuery } from '../../../graphql/queries/getExistChat.generated';
import { useGetFollowingUserQuery } from '../../../graphql/queries/getFollowingUser.generated';
import { tryAgainLaterNotification } from '../../../helpers/notifications';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import { AppRoutes } from '../../../navigator/app-routes';
import { themeState } from '../../../recoil/theme/atoms';
import { OnlineDotColor, Typography } from '../../../theme';
import type { ThemeColors } from '../../../types/theme';
import { filterChatParticipants, isUserOnline } from '../../../utils/shared';

const { FontWeights, FontSizes } = Typography;

const ListPeopleToChat: React.FC = () => {
  const theme = useRecoilValue(themeState);
  const { navigate } = useNavigation();
  const user = useCurrentUser();

  const [target, setTarget] = useState(0);

  const { data, loading } = useGetFollowingUserQuery({
    fetchPolicy: 'network-only',
    pollInterval: 2000,
    onCompleted: (res) => { }
  });

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

  const handleChose = (id: number) => {
    setTarget(id);
    getExist({
      variables: {
        participants: [id, user?.id ?? 0],
      },
    });
  };

  return (

    <FlatList
      data={data?.getFollowingUser}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      style={{ marginBottom: 10 }}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => {
        const { avatarFilePath, lastSeen, name, id } = item;
        const isOnline = isUserOnline(lastSeen);
        const onlineDotColor = OnlineDotColor[isOnline as any];
        return (
          <TouchableOpacity onPress={() => handleChose(id)} style={{ width: 50 }} activeOpacity={0.95}>
            <View style={styles().avatar}>
              <NativeImage uri={avatarFilePath ?? ''} style={styles(theme).avatarImage} />
              <View style={[styles().onlineDot, { backgroundColor: onlineDotColor }]} />
            </View>
            <Text numberOfLines={2} style={styles(theme).handleText}>
              {name}
            </Text>
          </TouchableOpacity>
        );
      }}
    />




  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderRadius: 5,
    },
    avatar: {
      height: 50,
      width: 50,
    },
    avatarImage: {
      flex: 1,
      borderRadius: 50,
      backgroundColor: theme.placeholder,
    },
    onlineDot: {
      position: 'absolute',
      width: 10,
      height: 10,
      bottom: 2.5,
      right: 2.5,
      borderRadius: 10,
    },
    handleText: {
      ...FontWeights.Regular,
      ...FontSizes.Body,
      color: theme.text01,
      flexWrap: 'wrap',
      flex: 1,
      textAlign: 'center',
      marginTop: 4,
    },
  });

export default ListPeopleToChat;
