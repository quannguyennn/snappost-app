import React, { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { OnlineDotColor, Typography } from '../../../theme';
import { useNavigation } from '@react-navigation/native';
import { AppRoutes } from '../../../navigator/app-routes';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../../recoil/theme/atoms';
import { longPressDeleteNotification } from '../../../helpers/notifications';
import DeleteCardRightActions from '../../../components/shared/DeleteCardRightActions';
import NativeImage from '../../../components/shared/NativeImage';
import type { ThemeColors } from '../../../types/theme';
import moment from 'moment';

const { FontWeights, FontSizes } = Typography;

interface MessageCardProps {
  chatId: number;
  participantId: number;
  avatar: string;
  handle: string;
  authorId: number;
  messageId: number;
  messageBody: string;
  seen: boolean;
  time: string | undefined;
  isOnline: boolean;
  unseen: number;
}

const MessageCard: React.FC<MessageCardProps> = ({
  chatId,
  participantId,
  avatar,
  handle,
  authorId,
  messageId,
  messageBody,
  seen,
  time,
  isOnline,
  unseen
}) => {
  const user = useCurrentUser();
  const theme = useRecoilValue(themeState);
  const parsedTime = time ? moment(time).fromNow() : '';
  const { navigate } = useNavigation();
  // const [deleteChat, { loading: deleteChatLoading, called: deleteChatCalled }] = useMutation(MUTATION_DELETE_CHAT);

  const setSeenAndNavigate = () => {
    navigate(AppRoutes.CONVERSATION_SCREEN, { chatId, avatar, handle, targetId: participantId });
  };

  const isHighlighted = authorId !== user?.id && !seen;

  const highlightStyle = isHighlighted
    ? {
      ...FontWeights.Regular,
      color: theme.text01,
    }
    : null;

  const onlineDotColor = OnlineDotColor[isOnline as any];
  const swipeableRef = useRef();

  const onDelete = () => {
    //!deleteChatLoading && !deleteChatCalled
    if (true) {
      longPressDeleteNotification(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        swipeableRef?.current?.close();
        // deleteChat({ variables: { chatId } });
      });
    }
  };

  const renderRightActions = (progress: any, dragX: any) => (
    <DeleteCardRightActions progress={progress} dragX={dragX} onDelete={onDelete} />
  );

  return (
    // @ts-ignore
    <Swipeable ref={swipeableRef} useNativeAnimations rightThreshold={-80} renderRightActions={renderRightActions}>
      <TouchableOpacity activeOpacity={0.9} onPress={setSeenAndNavigate} style={styles().container}>
        <View style={styles().avatar}>
          <NativeImage uri={avatar} style={styles(theme).avatarImage} />
          <View style={[styles().onlineDot, { backgroundColor: onlineDotColor }]} />
        </View>
        <View style={styles().info}>
          <Text style={styles(theme).handleText}>{handle} </Text>
          <View style={styles(theme).content}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={[styles(theme).messageText, highlightStyle]}>
              {authorId === user?.id ? "You: " : null}{messageBody}
            </Text>
            <Text style={[styles(theme).timeText, highlightStyle]}>{` · ${parsedTime}`}</Text>
          </View>
        </View>
        {unseen ? <View style={styles(theme).unseenContainer}><Text style={{ color: theme.white }}>{unseen}</Text></View> : null}
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderRadius: 5,
      marginBottom: 16
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
    content: {
      flexDirection: 'row',
      paddingTop: 5,
    },
    messageText: {
      ...FontWeights.Light,
      ...FontSizes.Caption,
      maxWidth: '70%',
      color: theme.text02,
    },
    timeText: {
      ...FontWeights.Light,
      ...FontSizes.Caption,
      color: theme.text02,
    },
    unseenContainer: {
      backgroundColor: theme.accent,
      height: 20,
      width: 20,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center"
    }
  });

export default MessageCard;
