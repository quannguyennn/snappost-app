import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { FlatGrid } from 'react-native-super-grid';
import EmptyNotifications from '../..//assets/svg/empty-notifications.svg';
import NotificationCard from './components/NotificationCard';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { themeState } from '../../recoil/theme/atoms';
import type { ThemeColors } from '../../types/theme';
import Header from '../../components/shared/layout/headers/Header';
import SvgBanner from '../../components/shared/SvgBanner';
import NotificationScreenPlaceholder from '../../components/placeholders/NotificationScreen.Placeholder';
import {
  GetNotificationQueryResponse,
  useGetNotificationLazyQuery,
} from '../../graphql/queries/getNotification.generated';
import { useIsFocused } from '@react-navigation/core';
import { tryAgainLaterNotification } from '../../helpers/notifications';
import { useSetSeenNotificationMutation } from '../../graphql/mutations/setSeenNotification.generated';
import { countNotificationState } from '../../recoil/app/atoms';

const NotificationScreen: React.FC = () => {
  const theme = useRecoilValue(themeState);
  const isFocus = useIsFocused();

  const [refresh, setRefresh] = useState(false);
  const setCountNoti = useSetRecoilState(countNotificationState);

  const [getNoti, { data: fetchData, loading, error, fetchMore }] = useGetNotificationLazyQuery({
    fetchPolicy: 'cache-and-network',
    onCompleted: () => {
      setRefresh(false);
      setSeen();
    },
    onError: (err) => {
      console.log('noti', err);
      tryAgainLaterNotification();
    },
  });

  const currentPage =
    Number(fetchData?.getNotification?.meta.currentPage) >= 0
      ? Number(fetchData?.getNotification?.meta.currentPage)
      : 1;
  const totalPages =
    Number(fetchData?.getNotification?.meta.totalPages) >= 0 ? Number(fetchData?.getNotification?.meta.totalPages) : 2;

  const data = fetchData?.getNotification.items;

  const [setSeen] = useSetSeenNotificationMutation({
    onCompleted: () => {
      setCountNoti(0);
    },
  });

  useEffect(() => {
    if (isFocus) {
      getNoti({
        variables: {
          limit: 20,
          page: 1,
        },
      });
    }
  }, [getNoti, isFocus]);

  useEffect(() => {
    if (refresh) {
      getNoti({
        variables: {
          limit: 20,
          page: 1,
        },
      });
    }
  }, [getNoti, refresh]);

  const loadMore = () => {
    if (Number(currentPage) < Number(totalPages)) {
      fetchMore &&
        fetchMore({
          variables: { limit: 12, page: currentPage + 1 },
          updateQuery: (prev: GetNotificationQueryResponse, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return prev;
            }
            const prevItem = prev?.getNotification?.items ? prev?.getNotification?.items : [];
            const nextItem = fetchMoreResult.getNotification?.items ? fetchMoreResult.getNotification?.items : [];
            return Object.assign({}, prev, {
              getNotification: {
                items: [...prevItem, ...nextItem],
                meta: fetchMoreResult.getNotification?.meta,
                __typename: 'NotificationConnection',
              },
            });
          },
        });
    }
  };

  const renderItem = ({ item }: any) => {
    const {
      id,
      createdAt,
      triggerInfo: { avatarFilePath, name },
      link,
      content,
    } = item;

    return (
      <NotificationCard
        notificationId={id}
        avatar={avatarFilePath}
        handle={name}
        content={content}
        resourceId={link}
        time={createdAt}
      />
    );
  };

  let content = <NotificationScreenPlaceholder />;

  if (!loading && !error) {
    content = (
      <FlatGrid
        onRefresh={() => {
          setRefresh(true);
        }}
        refreshing={refresh}
        onEndReached={() => loadMore()}
        onEndReachedThreshold={0.3}
        itemDimension={responsiveWidth(85)}
        showsVerticalScrollIndicator={false}
        data={data}
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
