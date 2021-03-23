import { useIsFocused } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useRecoilValue } from 'recoil';
import ConnectionsPlaceholder from '../../components/placeholders/Connection.Placeholder';
import GoBackHeader from '../../components/shared/layout/headers/GoBackHeader';
import UserCard from '../../components/UserCard';
import { useHandleFollowRequestMutation } from '../../graphql/mutations/handleFollowRequest.generated';
import {
  GetFollowRequestQueryResponse,
  useGetFollowRequestLazyQuery,
} from '../../graphql/queries/getFollowRequest.generated';
import { themeState } from '../../recoil/theme/atoms';
import { ThemeStatic, Typography } from '../../theme';
import { IconSizes } from '../../theme/Icon';
import type { ThemeColors } from '../../types/theme';

const { FontSizes } = Typography;

const RequestFollowScreen: React.FC = () => {
  const theme = useRecoilValue(themeState);
  const styles = useStyle(theme);
  const isFocus = useIsFocused();

  const [refresh, setRefresh] = useState(false);

  const [handleRequest] = useHandleFollowRequestMutation({
    onCompleted: () => {
      setRefresh(true);
    },
  });

  const [getRequest, { data: fetchData, loading, fetchMore }] = useGetFollowRequestLazyQuery({
    fetchPolicy: 'cache-and-network',
    onCompleted: () => {
      setRefresh(false);
    },
  });

  const currentPage =
    Number(fetchData?.getFollowRequest?.meta.currentPage) >= 0
      ? Number(fetchData?.getFollowRequest?.meta.currentPage)
      : 1;
  const totalPages =
    Number(fetchData?.getFollowRequest?.meta.totalPages) >= 0
      ? Number(fetchData?.getFollowRequest?.meta.totalPages)
      : 2;

  const data = fetchData?.getFollowRequest.items;

  useEffect(() => {
    if (isFocus) {
      getRequest({ variables: { limit: 20, page: 1 } });
    }
  }, [getRequest, isFocus]);

  useEffect(() => {
    if (refresh) {
      getRequest({ variables: { limit: 20, page: 1 } });
    }
  }, [getRequest, refresh]);

  const loadMore = () => {
    if (Number(currentPage) < Number(totalPages)) {
      fetchMore &&
        fetchMore({
          variables: { limit: 20, page: currentPage + 1 },
          updateQuery: (prev: GetFollowRequestQueryResponse, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return prev;
            }
            const prevItem = prev?.getFollowRequest?.items ? prev?.getFollowRequest?.items : [];
            const nextItem = fetchMoreResult.getFollowRequest?.items ? fetchMoreResult.getFollowRequest?.items : [];
            return Object.assign({}, prev, {
              getFollowRequest: {
                items: [...prevItem, ...nextItem],
                meta: fetchMoreResult.getFollowRequest?.meta,
                __typename: 'FollowConnection',
              },
            });
          },
        });
    }
  };

  let content = (
    <View style={{ paddingHorizontal: 20, flex: 1 }}>
      <ConnectionsPlaceholder />
    </View>
  );

  if (!loading) {
    content = (
      <FlatList
        data={data}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.3}
        onRefresh={() => {
          setRefresh(true);
        }}
        renderItem={({ item }) => {
          return (
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <UserCard
                style={{ width: '60%' }}
                name={item.requestInfo.name}
                userId={item.requestInfo.id}
                nickname={item.requestInfo.nickname}
                avatar={item.requestInfo.avatarFilePath ?? ''}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity
                  onPress={() => handleRequest({ variables: { userId: item.requestInfo.id, accept: true } })}
                  style={{
                    backgroundColor: theme.accent,
                    height: 30,
                    paddingHorizontal: 10,
                    justifyContent: 'center',
                    borderRadius: 5,
                    marginRight: 5,
                  }}>
                  <Text style={{ color: ThemeStatic.white }}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleRequest({ variables: { userId: item.requestInfo.id, accept: false } })}
                  style={{
                    height: 30,
                    paddingHorizontal: 10,
                    justifyContent: 'center',
                    borderRadius: 5,
                    borderWidth: StyleSheet.hairlineWidth,
                    borderColor: theme.text01,
                  }}>
                  <Text style={{ color: theme.text01 }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        refreshing={refresh}
        onEndReached={() => loadMore()}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <GoBackHeader title="Follow requests" iconSize={IconSizes.x6} />
      {content}
    </SafeAreaView>
  );
};

const useStyle = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.base,
    },
    placeholderStyle: {
      ...FontSizes.Body,
    },
  });

export default RequestFollowScreen;
