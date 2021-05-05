import React from 'react';
import { ActivityIndicator, FlatList, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRecoilState, useRecoilValue } from 'recoil';
import PostCard from './components/PostCard';
import { useState } from 'react';
import { FlatGrid } from 'react-native-super-grid';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useEffect } from 'react';
import { Images } from '../../assets1/icons';
import PostCardPlaceholder from '../../components/placeholders/PostCard.Placeholder';
import IconButton from '../../components/shared/Iconbutton';
import ImageBanner from '../../components/shared/ImageBanner';
import HomeHeader from '../../components/shared/layout/headers/HomeHeader';
import { themeState } from '../../recoil/theme/atoms';
import { IconSizes } from '../../theme/Icon';
import type { ThemeColors } from '../../types/theme';
import { GetNewFeedQueryResponse, useGetNewFeedLazyQuery } from '../../graphql/queries/getNewFeed.generated';
import type { Post } from '../../graphql/type.interface';
import { somethingWentWrongErrorNotification, tryAgainLaterNotification } from '../../helpers/notifications';
import { countMessageState, newFeedState } from '../../recoil/app/atoms';
import { useNavigation } from '@react-navigation/core';
import { AppRoutes } from '../../navigator/app-routes';
import { useCreateLiveStreamMutation } from '../../graphql/mutations/createLiveStream.generated';
import { SafeAreaView } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import { useGetStreamsQuery } from '../../graphql/queries/getStreams.generated';

const HomeScreen = React.memo(() => {
  const theme = useRecoilValue(themeState);
  const { navigate } = useNavigation();
  const [refresh, setRefresh] = useState(false);
  const [init, setInit] = useState(true);
  const [posts, setPosts] = useRecoilState(newFeedState);
  const unseenChat = useRecoilValue(countMessageState);

  const [createStream, { loading: createStreamLoad }] = useCreateLiveStreamMutation({
    onError: (err) => {
      console.log('create stream err', err);
      tryAgainLaterNotification();
    },
    onCompleted: (res) => {
      navigate(AppRoutes.LIVE_STREAM_VIEW_SCREEN, {
        streamId: res.createLiveStream.id,
        isOwner: true,
        streamUrl: res.createLiveStream.streamUrl,
        viewUrl: res.createLiveStream.viewUrl,
      });
    },
  });

  const { data: fetchStream, refetch } = useGetStreamsQuery({
    fetchPolicy: 'network-only',
    pollInterval: 1000,
    onError: (err) => {
      console.log('get streams', err);
    },
  });

  const [getNewFeed, { data: fetchNewFeed, loading, fetchMore }] = useGetNewFeedLazyQuery({
    fetchPolicy: 'cache-and-network',
    onCompleted: (res) => {
      setPosts(res.getNewFeed.items);
      setRefresh(false);
    },
    onError: (err) => {
      console.log('new Feed', err);
      somethingWentWrongErrorNotification();
    },
  });

  const currentPage =
    Number(fetchNewFeed?.getNewFeed?.meta.currentPage) >= 0 ? Number(fetchNewFeed?.getNewFeed?.meta.currentPage) : 1;
  const totalPages =
    Number(fetchNewFeed?.getNewFeed?.meta.totalPages) >= 0 ? Number(fetchNewFeed?.getNewFeed?.meta.totalPages) : 2;

  const data = posts;

  useEffect(() => {
    if (refresh || init) {
      getNewFeed({
        variables: { limit: 12, page: 1 },
      });
      refetch && refetch();
    }
    setInit(false);
  }, [getNewFeed, refresh, init, refetch]);

  const loadMore = () => {
    if (Number(currentPage) < Number(totalPages)) {
      fetchMore &&
        fetchMore({
          variables: { limit: 12, page: currentPage + 1 },
          updateQuery: (prev: GetNewFeedQueryResponse, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return prev;
            }
            const prevItem = prev?.getNewFeed?.items ? prev?.getNewFeed?.items : [];
            const nextItem = fetchMoreResult.getNewFeed?.items ? fetchMoreResult.getNewFeed?.items : [];
            setPosts([...prevItem, ...nextItem]);
            return Object.assign({}, prev, {
              getNewFeed: {
                items: [...prevItem, ...nextItem],
                meta: fetchMoreResult.getNewFeed?.meta,
                __typename: 'PostConnection',
              },
            });
          },
        });
    }
  };

  const renderItem = ({ item }: { item: Post }) => {
    const { id, mediasPath, totalLike, createdAt, creatorInfo, isLike, rawCaption } = item;

    return (
      <PostCard
        id={id}
        author={{ avatar: creatorInfo?.avatarFilePath ?? '', name: creatorInfo?.name ?? '', id: creatorInfo?.id ?? 0 }}
        time={createdAt}
        uri={mediasPath?.map((item) => item.filePath) ?? []}
        likes={totalLike}
        caption={rawCaption ?? ''}
        isLike={isLike}
      />
    );
  };

  console.log(fetchStream?.getStreams);

  const content = (
    <FlatGrid
      onRefresh={() => {
        setRefresh(true);
      }}
      itemDimension={responsiveWidth(85)}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.id.toString()}
      data={data ?? []}
      ListEmptyComponent={() => <ImageBanner img={Images.emptyFeed} spacing={20} placeholder={'No new posts'} />}
      style={styles().postList}
      spacing={20}
      renderItem={renderItem}
      ListHeaderComponent={
        fetchStream?.getStreams && fetchStream.getStreams.length ? (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={fetchStream?.getStreams ?? []}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={styles(theme).liveItem}
                  onPress={() =>
                    navigate(AppRoutes.LIVE_STREAM_VIEW_SCREEN, {
                      streamId: item.id,
                      isOwner: false,
                      viewUrl: item.viewUrl,
                      streamUrl: item.streamUrl,
                    })
                  }>
                  <FastImage
                    source={{ uri: item?.streamerInfo?.avatarFilePath ?? '' }}
                    style={styles(theme).liveItem}
                  />
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={styles(theme).liveContainer}
          />
        ) : null
      }
      onEndReachedThreshold={0.3}
      ListFooterComponent={loading && posts?.length ? <PostCardPlaceholder /> : null}
      refreshing={refresh}
      onEndReached={() => loadMore()}
    />
  );

  const IconRight = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <IconButton
          hasBadge={unseenChat.length !== 0}
          badgeCount={unseenChat.length}
          onPress={() => {
            createStream();
          }}
          Icon={() => <MaterialIcons name="live-tv" size={IconSizes.x6} color={theme.text01} />}
        />

        <IconButton
          hasBadge={unseenChat.length !== 0}
          badgeCount={unseenChat.length}
          onPress={() => {
            navigate(AppRoutes.MESSAGE_SCREEN);
          }}
          Icon={() => <AntDesign name="message1" size={IconSizes.x5} color={theme.text01} />}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles(theme).container}>
      <Modal animationType="fade" visible={createStreamLoad} transparent>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <ActivityIndicator size="large" />
        </View>
      </Modal>

      <HomeHeader IconRight={IconRight} />

      {content}
      {loading && !posts?.length ? <PostCardPlaceholder /> : null}
    </SafeAreaView>
  );
});

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.base,
      marginBottom: 0,
      paddingBottom: 0,
    },
    liveContainer: {
      height: 62,
      width: '100%',
      margin: 0,
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    liveItem: {
      height: 60,
      width: 60,
      borderRadius: 60,
    },
    postList: {
      marginBottom: 0,
      height: '100%',
    },
  });

export default HomeScreen;
