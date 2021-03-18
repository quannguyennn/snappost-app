import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Typography } from '../../../theme';
import LoadingIndicator from '../../../components/shared/LoadingIndicator';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../../recoil/theme/atoms';
import type { ThemeColors } from '../../../types/theme';
import { useNavigation } from '@react-navigation/native';
import { tryAgainLaterNotification } from '../../../helpers/notifications';
import { PollIntervals } from '../../../utils/constants';
import { FollowInteraction } from '../../../types/constants';
import { AppRoutes } from '../../../navigator/app-routes';
import { IconSizes } from '../../../theme/Icon';

const { FontWeights, FontSizes } = Typography;

interface UserInteractionsProps {
  targetId: string,
  avatar: string | undefined | null,
  name: string | undefined
};

const UserInteractions: React.FC<UserInteractionsProps> = ({ targetId, avatar, name }) => {

  const { navigate } = useNavigation();
  const theme = useRecoilValue(themeState);
  const {
    data: doesFollowData,
    loading: doesFollowLoading,
    error: doesFollowError
  } = useQuery(QUERY_DOES_FOLLOW, {
    variables: { userId: user.id, targetId },
    pollInterval: PollIntervals.interaction
  });

  const [updateFollowing, { loading: updateFollowingLoading }] = useMutation(MUTATION_UPDATE_FOLLOWING);


  let content = <LoadingIndicator size={IconSizes.x0} color={theme.white} />;

  if (!doesFollowLoading && !updateFollowingLoading && !doesFollowError) {
    const { doesFollow } = doesFollowData;
    content = (
      <Text style={styles(theme).followInteractionText}>
        {`${doesFollow ? 'FOLLOWING' : 'FOLLOW'}`}
      </Text>
    );
  }

  const followInteraction = () => {
    if (doesFollowLoading) return;

    const { doesFollow } = doesFollowData;
    const updateFollowingArgs = { userId: user.id, targetId };
    if (doesFollow) {
      updateFollowing({
        variables: {
          ...updateFollowingArgs,
          action: FollowInteraction.UNFOLLOW
        }
      });
    } else {
      updateFollowing({
        variables: {
          ...updateFollowingArgs,
          action: FollowInteraction.FOLLOW
        }
      });
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
      <TouchableOpacity activeOpacity={0.90} onPress={followInteraction} style={styles(theme).followInteraction}>
        {content}
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.90} 
      // onPress={messageInteraction} 
      style={styles(theme).messageInteraction}>
        <Text style={styles(theme).messageInteractionText}>MESSAGE</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = (theme = {} as ThemeColors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20
  },
  followInteraction: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
    paddingVertical: 7,
    borderRadius: 40,
    backgroundColor: theme.accent
  },
  messageInteraction: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
    paddingVertical: 7,
    borderRadius: 40,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.accent
  },
  followInteractionText: {
    ...FontWeights.Light,
    ...FontSizes.Caption,
    color: theme.white
  },
  messageInteractionText: {
    ...FontWeights.Light,
    ...FontSizes.Caption,
    color: theme.accent
  }
});

export default UserInteractions;