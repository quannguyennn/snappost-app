import React from 'react';
import { StyleSheet, View } from 'react-native';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { FlatGrid } from 'react-native-super-grid';
import EmptyNotifications from '../..//assets/svg/empty-notifications.svg';

import NotificationCard from './components/NotificationCard';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../recoil/theme/atoms';
import { useQuery } from '@apollo/client';
import type { ThemeColors } from '../../types/theme';
import Header from '../../components/shared/layout/headers/Header';
import SvgBanner from '../../components/shared/SvgBanner';
import NotificationScreenPlaceholder from '../../components/placeholders/NotificationScreen.Placeholder';

const NotificationScreen: React.FC = () => {
  const theme = useRecoilValue(themeState);

  // const { data, loading, error } = useQuery(QUERY_NOTIFICATION, {
  //   variables: { userId: user.id },
  //   pollInterval: PollIntervals.notification
  // });

  const renderItem = ({ item }: any) => {
    const { id: notificationId, actionUser, type, resourceId, createdAt } = item;

    return (
      <NotificationCard
        notificationId={notificationId}
        avatar={
          'https://images.pexels.com/photos/5706559/pexels-photo-5706559.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
        }
        handle={'hihi'}
        type={type}
        resourceId={resourceId}
        time={createdAt}
      />
    );
  };

  let content = <NotificationScreenPlaceholder />;

  if (true) {
    content = (
      <FlatGrid
        itemDimension={responsiveWidth(85)}
        showsVerticalScrollIndicator={false}
        data={[0, 1, 2, 3]}
        ListEmptyComponent={() => (
          <SvgBanner Svg={EmptyNotifications} spacing={20} placeholder="No notifications yet" />
        )}
        style={styles().notificationList}
        spacing={20}
        renderItem={renderItem}
      />
    );
  }

  return (
    <View style={styles(theme).container}>
      <Header title="Notifications" />
      {content}
    </View>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.base,
    },
    notificationList: {
      flex: 1,
      paddingHorizontal: 4,
    },
  });

export default NotificationScreen;
