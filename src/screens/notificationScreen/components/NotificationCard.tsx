import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Typography } from '../../../theme';
// import { NotificationText, NotificationType } from '../../../types/constants';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../../recoil/theme/atoms';
import { useNavigation } from '@react-navigation/native';
import { parseTimeElapsed } from '../../../utils/shared';
import { AppRoutes } from '../../../navigator/app-routes';
import NativeImage from '../../../components/shared/NativeImage';
import type { ThemeColors } from '../../../types/theme';

const { FontWeights, FontSizes } = Typography;

interface NotificationCardPros {
  notificationId: string;
  avatar: string;
  handle: string;
  resourceId: string;
  content: string;
  time: string;
}

const NotificationCard: React.FC<NotificationCardPros> = ({ avatar, resourceId, handle, time, content }) => {
  const theme = useRecoilValue(themeState);

  const { navigate } = useNavigation();
  // const notificationText = NotificationText[type];
  const { readableTime } = parseTimeElapsed(time);

  // const [deleteNotification, { loading: deleteNotificationLoading, called: deleteNotificationCalled }] = useMutation(
  //   // MUTATION_DELETE_NOTIFICATION,
  // );

  // const swipeableRef = useRef();

  const navigateAction = () => {
    if (resourceId === '') {
      return;
    }
    const [path, id] = resourceId.split('-');

    if (path === 'user') {
      navigate(AppRoutes.PROFILE_VIEW_SCREEN, { userId: Number(id) });
    } else if (path === 'post') {
      navigate(AppRoutes.POST_VIEW_SCREEN, { postId: Number(id) });
    }
  };

  // const onDelete = () => {};

  // const renderRightActions = (progress: any, dragX: any) => (
  //   <DeleteCardRightActions progress={progress} dragX={dragX} onDelete={onDelete} />
  // );

  return (
    // @ts-ignore
    // <Swipeable ref={swipeableRef} useNativeAnimations rightThreshold={-80} renderRightActions={renderRightActions}>
    <TouchableOpacity activeOpacity={0.95} onPress={navigateAction} style={styles().container}>
      <NativeImage uri={avatar} style={styles(theme).avatarImage} />
      <View style={styles().info}>
        <Text style={styles(theme).notificationText}>
          <Text style={styles(theme).handleText}>{handle} </Text>
          {content}
        </Text>
        <Text style={styles(theme).timeText}>{readableTime}</Text>
      </View>
    </TouchableOpacity>
    // </Swipeable>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderRadius: 5,
    },
    avatarImage: {
      height: 50,
      width: 50,
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
    notificationText: {
      ...FontWeights.Light,
      ...FontSizes.Body,
      color: theme.text01,
    },
    timeText: {
      ...FontWeights.Light,
      ...FontSizes.Caption,
      color: theme.text02,
      paddingTop: 5,
    },
  });

export default NotificationCard;
