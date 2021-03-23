import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import { useRecoilValue } from 'recoil';
import { AppRoutes } from '../app-routes';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import { themeState } from '../../recoil/theme/atoms';
import { IconSizes } from '../../theme/Icon';
import type { ThemeColors } from '../../types/theme';
import IconButton from '../../components/shared/Iconbutton';
import { countNotificationState } from '../../recoil/app/atoms';
import { useNavigation } from '@react-navigation/core';

const TabIcon = ({ route, isActive }: any) => {
  const theme = useRecoilValue(themeState);
  const unSeenNoti = useRecoilValue(countNotificationState);
  const { navigate } = useNavigation();

  switch (route) {
    case AppRoutes.HOME_TAB:
      return <Entypo name="home" color={isActive ? theme.accent : theme.text02} size={IconSizes.x5} />;

    case AppRoutes.EXPLORE_TAB:
      return <AntDesign name="search1" color={isActive ? theme.accent : theme.text02} size={IconSizes.x5} />;

    case AppRoutes.UPLOAD_TAB:
      return (
        <View style={styles(theme).bigButton}>
          <AntDesign name="plus" color={theme.text02} size={IconSizes.x6} />
        </View>
      );

    case AppRoutes.NOTIFICATION_TAB:
      return (
        <IconButton
          hasBadge={unSeenNoti !== 0}
          badgeCount={unSeenNoti}
          onPress={() => {
            navigate(AppRoutes.NOTIFICATION_TAB);
          }}
          Icon={() => <Feather name="bell" color={isActive ? theme.accent : theme.text02} size={IconSizes.x5} />}
        />
      );

    case AppRoutes.PROFILE_TAB:
      return <AntDesign name="user" color={isActive ? theme.accent : theme.text02} size={IconSizes.x5} />;

    default:
      return null;
  }
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    bigButton: {
      width: 45,
      height: 45,
      backgroundColor: theme.accent,
      borderRadius: 60,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.5,
      shadowRadius: 3,
      elevation: 8,
      justifyContent: 'center',
      alignItems: 'center',
      // position: 'absolute',
      bottom: 10,
    },
  });

export default TabIcon;
