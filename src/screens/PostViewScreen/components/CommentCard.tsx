import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useRecoilValue } from 'recoil';
import DeleteCardRightActions from '../../../components/shared/DeleteCardRightActions';
import NativeImage from '../../../components/shared/NativeImage';
import { useRemoveCommentMutation } from '../../../graphql/mutations/removeComment.generated';
import { longPressDeleteNotification } from '../../../helpers/notifications';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import { AppRoutes } from '../../../navigator/app-routes';
import { themeState } from '../../../recoil/theme/atoms';
import { Typography } from '../../../theme';
import type { ThemeColors } from '../../../types/theme';

const { FontWeights, FontSizes } = Typography;

interface CommentCardProps {
  postId: number;
  commentId: number;
  authorId: number;
  avatar: string;
  handle: string;
  body: string;
  time: string;
}

const CommentCard: React.FC<CommentCardProps> = ({ commentId, authorId, avatar, handle, body, time }) => {
  const theme = useRecoilValue(themeState);
  const { navigate } = useNavigation();

  const user = useCurrentUser();

  const parsedTime = moment(time).fromNow();

  const [deleteComment, { loading: deleteCommentLoading, called: deleteCommentCalled }] = useRemoveCommentMutation({});

  const swipeableRef = useRef(null);

  const navigateToProfile = () => {
    if (authorId === user?.id) {
      return;
    }
    navigate(AppRoutes.PROFILE_VIEW_SCREEN, { userId: authorId });
  };

  const onDelete = () => {
    if (!deleteCommentLoading && !deleteCommentCalled) {
      longPressDeleteNotification(() => {
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        swipeableRef.current.close();
        deleteComment({ variables: { id: commentId } });
      });
    }
  };

  const renderRightActions = (progress: any, dragX: any) => {
    if (authorId !== user?.id) {
      return null;
    }
    return <DeleteCardRightActions progress={progress} dragX={dragX} onDelete={onDelete} />;
  };

  return (
    // @ts-ignore
    <Swipeable
      ref={swipeableRef}
      useNativeAnimations
      containerStyle={styles().swipeable}
      rightThreshold={-80}
      renderRightActions={renderRightActions}>
      <TouchableOpacity activeOpacity={0.95} onPress={navigateToProfile} style={styles().container}>
        <NativeImage uri={avatar} style={styles(theme).avatarImage} />
        <View style={styles().info}>
          <Text style={styles(theme).commentText}>
            <Text style={styles(theme).handleText}>{handle} </Text>
            {body}
          </Text>
          <Text style={styles(theme).timeText}>{parsedTime}</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    swipeable: {
      marginVertical: 5,
    },
    container: {
      flexDirection: 'row',
      borderRadius: 5,
      marginVertical: 5,
    },
    avatarImage: {
      height: 40,
      width: 40,
      borderRadius: 50,
      backgroundColor: theme.placeholder,
    },
    info: {
      flex: 1,
      justifyContent: 'center',
      paddingLeft: 10,
    },
    handleText: {
      ...FontWeights.Regular,
      ...FontSizes.Body,
      color: theme.text01,
    },
    commentText: {
      ...FontWeights.Light,
      ...FontSizes.Body,
      color: theme.text01,
    },
    timeText: {
      ...FontWeights.Light,
      ...FontSizes.Caption,
      color: theme.text02,
      paddingTop: 2,
    },
  });

export default CommentCard;
