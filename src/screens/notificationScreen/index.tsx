import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
import { useIsFocused, useNavigation } from '@react-navigation/core';
import { tryAgainLaterNotification } from '../../helpers/notifications';
import { useSetSeenNotificationMutation } from '../../graphql/mutations/setSeenNotification.generated';
import { countNotificationState } from '../../recoil/app/atoms';
import { useCountFollowRequestLazyQuery } from '../../graphql/queries/countFollowRequest.generated';
import { AppRoutes } from '../../navigator/app-routes';

const NotificationScreen: React.FC = () => {
  const theme = useRecoilValue(themeState);
  const { navigate } = useNavigation();
  const isFocus = useIsFocused();

  const [refresh, setRefresh] = useState(false);
  const [init, setInit] = useState(true);
  const setCountNoti = useSetRecoilState(countNotificationState);

  const [countRequest, { data: fetchCount }] = useCountFollowRequestLazyQuery({
    fetchPolicy: 'cache-and-network',
  });

  const [getNoti, { data: fetchData, loading, fetchMore }] = useGetNotificationLazyQuery({
    fetchPolicy: 'cache-and-network',
    onCompleted: () => {
      setRefresh(false);
      setSeen();
      setInit(false);
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
      countRequest();
    }
  }, [getNoti, isFocus, countRequest]);

  useEffect(() => {
    if (refresh) {
      getNoti({
        variables: {
          limit: 20,
          page: 1,
        },
      });
      countRequest();
    }
  }, [getNoti, refresh, countRequest]);

  const loadMore = () => {
    if (Number(currentPage) < Number(totalPages)) {
      fetchMore &&
        fetchMore({
          variables: { limit: 20, page: currentPage + 1 },
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
      updatedAt,
      triggerInfo: { avatarFilePath, name },
      link,
      content,
      isSeen,
    } = item;

    return (
      <NotificationCard
        notificationId={id}
        avatar={avatarFilePath}
        handle={name}
        content={content}
        resourceId={link}
        time={updatedAt}
        isSeen={isSeen}
      />
    );
  };

  return (
    <View style={styles(theme).container}>
      <Header title="Notifications" />
      <TouchableOpacity
        onPress={() => navigate(AppRoutes.REQUEST_FOLLOW)}
        style={{
          paddingHorizontal: 20,
          paddingVertical: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 5,
          borderBottomColor: theme.text01,
          borderTopColor: theme.text01,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}>
        <Text style={{ color: theme.text01 }}>Request following</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {Number(fetchCount?.countFollowRequest) > 0 ? (
            <View style={{ backgroundColor: theme.accent, width: 8, height: 8, borderRadius: 8 }} />
          ) : null}
          <Text style={{ color: theme.text02, marginLeft: 10, fontSize: 14 }}>
            {Number(fetchCount?.countFollowRequest ?? 0)}
          </Text>
        </View>
      </TouchableOpacity>
      {loading && init ? (
        <NotificationScreenPlaceholder />
      ) : (
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
      )}
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
