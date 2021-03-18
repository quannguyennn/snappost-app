import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useRecoilState, useRecoilValue } from 'recoil';
import PostCard from './components/PostCard';
import { useState } from 'react';
import { FlatGrid } from 'react-native-super-grid';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
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
import { somethingWentWrongErrorNotification } from '../../helpers/notifications';
import { newFeedState } from '../../recoil/app/atoms';

const HomeScreen = React.memo(() => {
  const theme = useRecoilValue(themeState);
  const [refresh, setRefresh] = useState(false);
  const [init, setInit] = useState(true);
  const [posts, setPosts] = useRecoilState(newFeedState);

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
        variables: { limit: 20, page: 1 },
      });
    }
    setInit(false);
  }, [getNewFeed, refresh, init]);

  const loadMore = () => {
    if (Number(currentPage) < Number(totalPages)) {
      fetchMore &&
        fetchMore({
          variables: { limit: 20, page: currentPage + 1 },
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
      onEndReachedThreshold={0.4}
      refreshing={refresh}
      onEndReached={() => loadMore()}
    />
  );

  const IconRight = () => {
    const unreadMessages = Math.floor(Math.random() * 10);
    const hasBadge = unreadMessages !== 0;
    return (
      <IconButton
        hasBadge={hasBadge}
        badgeCount={unreadMessages}
        onPress={() => { }}
        Icon={() => <FontAwesome name="send" size={IconSizes.x5} color={theme.text01} />}
      />
    );
  };

  return (
    <View style={styles(theme).container}>
      <HomeHeader IconRight={IconRight} />
      {content}
      {loading && !posts?.length ? <PostCardPlaceholder /> : null}
    </View>
  );
});

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.base,
    },
    postList: {
      flex: 1,
    },
  });

export default HomeScreen;
