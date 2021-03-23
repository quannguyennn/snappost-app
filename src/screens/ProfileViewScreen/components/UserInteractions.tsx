import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Typography } from '../../../theme';
import LoadingIndicator from '../../../components/shared/LoadingIndicator';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../../recoil/theme/atoms';
import type { ThemeColors } from '../../../types/theme';
import { useNavigation } from '@react-navigation/native';
import { AppRoutes } from '../../../navigator/app-routes';
import { IconSizes } from '../../../theme/Icon';
import type { FollowStatus, Maybe } from '../../../graphql/type.interface';
import { useFollowUserMutation } from '../../../graphql/mutations/FollowUser.generated';
import { useUnFollowUserMutation } from '../../../graphql/mutations/UnFollowUser.generated';

const { FontWeights, FontSizes } = Typography;

interface UserInteractionsProps {
  targetId: number;
  isFollow: Maybe<FollowStatus> | undefined;
  onInteract: () => void;
}

const UserInteractions: React.FC<UserInteractionsProps> = ({ targetId, isFollow, onInteract }) => {
  const { navigate } = useNavigation();
  const theme = useRecoilValue(themeState);

  const [follow, { loading: followLoading }] = useFollowUserMutation({
    onCompleted: () => {
      onInteract();
    },
  });
  const [unFollow, { loading: unFollowLoading }] = useUnFollowUserMutation({
    onCompleted: () => {
      onInteract();
    },
  });

  let content = <LoadingIndicator size={IconSizes.x0} color={theme.white} />;

  if (!followLoading && !unFollowLoading) {
    if (isFollow !== 'ACCEPT') {
      content = (
        <Text style={styles(theme).followInteractionText}>{`${
          isFollow === 'WAITING' ? 'REQUEST SENT' : 'FOLLOW'
        }`}</Text>
      );
    } else {
      content = <Text style={styles(theme).followInteractionText}>FOLLOWING</Text>;
    }
  }

  const followInteraction = () => {
    if (isFollow === 'ACCEPT' || isFollow === 'WAITING') {
      unFollow({ variables: { id: targetId } });
    } else {
      follow({ variables: { id: targetId } });
    }
  };

  // const messageInteraction = async () => {
  //   try {
  //     const { data: { chatExists } } = await client.query({
  //       query: QUERY_CHAT_EXISTS,
  //       variables: { userId: user.id, targetId },
  //       fetchPolicy: 'no-cache'
  //     });

  //     if (chatExists) {
  //       navigate(AppRoutes.ConversationScreen, { chatId: chatExists.id, avatar, name, targetId });
  //     } else {
  //       const { data } = await createTemporaryChat();
  //       navigate(AppRoutes.ConversationScreen, { chatId: data.createTemporaryChat.id, avatar, name, targetId });
  //     }
  //   } catch ({ message }) {
  //     tryAgainLaterNotification();
  //     // crashlytics.recordCustomError(Errors.INITIALIZE_CHAT, message);
  //   }
  // };

  return (
    <View style={styles().container}>
      <TouchableOpacity activeOpacity={0.9} onPress={followInteraction} style={styles(theme).followInteraction}>
        {content}
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.9}
        // onPress={messageInteraction}
        style={styles(theme).messageInteraction}>
        <Text style={styles(theme).messageInteractionText}>MESSAGE</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    followInteraction: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 5,
      paddingVertical: 7,
      borderRadius: 40,
      backgroundColor: theme.accent,
    },
    messageInteraction: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 5,
      paddingVertical: 7,
      borderRadius: 40,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.accent,
    },
    followInteractionText: {
      ...FontWeights.Light,
      ...FontSizes.Caption,
      color: theme.white,
    },
    messageInteractionText: {
      ...FontWeights.Light,
      ...FontSizes.Caption,
      color: theme.accent,
    },
  });

export default UserInteractions;
