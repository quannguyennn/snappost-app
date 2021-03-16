import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useRecoilValue } from 'recoil';
import { AppRoutes } from '../navigator/app-routes';
import { themeState } from '../recoil/theme/atoms';
import { Typography } from '../theme';
import { ThemeColors } from '../types/theme';
import NativeImage from './shared/NativeImage';

const { FontWeights, FontSizes } = Typography;

interface UserCardProps {
  userId: string;
  avatar: string;
  handle: string;
  name: string;
  style?: StyleProp<ViewStyle>;
  onPress?: any;
}

const UserCard: React.FC<UserCardProps> = ({ userId, avatar, handle, name, onPress, style }) => {
  const theme = useRecoilValue(themeState);
  const { navigate } = useNavigation();

  const navigateToProfile = () => {
    // if (userId === user.id) {
    //   return;
    // }
    navigate(AppRoutes.PROFILE_VIEW_SCREEN, { userId });
  };

  return (
    <TouchableOpacity activeOpacity={0.95} onPress={onPress || navigateToProfile} style={[styles().container, style]}>
      <NativeImage uri={avatar} style={styles(theme).avatarImage} />
      <View style={styles().info}>
        <Text style={styles(theme).handleText}>{handle}</Text>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles(theme).nameText}>
          {name}
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
  });

export default UserCard;
