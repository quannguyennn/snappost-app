import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useRecoilValue } from 'recoil';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useUserInfo } from '../hooks/useUserInfo';
import { AppRoutes } from '../navigator/app-routes';
import { themeState } from '../recoil/theme/atoms';
import { OnlineDotColor, Typography } from '../theme';
import type { ThemeColors } from '../types/theme';
import NativeImage from './shared/NativeImage';

const { FontWeights, FontSizes } = Typography;

interface UserCardProps {
  userId: number;
  avatar: string;
  nickname: string;
  name: string;
  style?: StyleProp<ViewStyle>;
  onPress?: any;
  isBlock?: boolean;
  isChat?: boolean;
  isOnline?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
  userId,
  avatar,
  nickname,
  name,
  onPress,
  style,
  isBlock,
  isChat = false,
  isOnline = false,
}) => {
  const theme = useRecoilValue(themeState);
  const { navigate } = useNavigation();
  const user = useCurrentUser();

  const navigateToProfile = () => {
    if (userId === user?.id) {
      return;
    }
    navigate(AppRoutes.PROFILE_VIEW_SCREEN, { userId });
  };

  const onlineDotColor = OnlineDotColor[isOnline as any];

  return (
    <TouchableOpacity activeOpacity={0.95} onPress={onPress || navigateToProfile} style={[styles().container, style]}>
      {isChat ? (
        <View style={styles().avatar}>
          <NativeImage uri={avatar} style={styles(theme).avatarImage} />
          <View style={[styles().onlineDot, { backgroundColor: onlineDotColor }]} />
        </View>
      ) : (
          <NativeImage uri={isBlock ? '' : avatar} style={styles(theme).avatarImage} />
        )}
      <View style={styles().info}>
        <Text style={styles(theme).handleText}>{isBlock ? 'Anonymous' : name} </Text>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles(theme).nameText}>
          {isBlock ? 'Anonymous' : nickname}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderRadius: 5,
      width: '100%',
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
    nameText: {
      ...FontWeights.Light,
      ...FontSizes.Caption,
      color: theme.text02,
      marginTop: 5,
    },
    avatar: {
      height: 50,
      width: 50,
    },
    onlineDot: {
      position: 'absolute',
      width: 10,
      height: 10,
      bottom: 2.5,
      right: 2.5,
      borderRadius: 10,
    },
  });

export default UserCard;
