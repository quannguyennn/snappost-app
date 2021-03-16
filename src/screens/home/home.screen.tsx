import React from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRecoilValue } from 'recoil';
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
import type { HomeScreenNavigationProp } from '../../navigator/home.navigator';
import { themeState } from '../../recoil/theme/atoms';
import { IconSizes } from '../../theme/Icon';
import type { ThemeColors } from '../../types/theme';
import { GetNewFeedQueryResponse, useGetNewFeedLazyQuery } from '../../graphql/queries/getNewFeed.generated';
import type { Post } from '../../graphql/type.interface';

const HomeScreen = React.memo(() => {
  const { navigate } = useNavigation<HomeScreenNavigationProp>();
  const theme = useRecoilValue(themeState);

  const [refresh, setRefresh] = useState(true);

  const [getNewFeed, { data: fetchNewFeed, loading, fetchMore }] = useGetNewFeedLazyQuery({
    fetchPolicy: 'cache-and-network',
    onCompleted: () => setRefresh(false),
  });

  const currentPage =
    Number(fetchNewFeed?.getNewFeed?.meta.currentPage) >= 0 ? Number(fetchNewFeed?.getNewFeed?.meta.currentPage) : 1;
  const totalPages =
    Number(fetchNewFeed?.getNewFeed?.meta.totalPages) >= 0 ? Number(fetchNewFeed?.getNewFeed?.meta.totalPages) : 2;

  const data = fetchNewFeed?.getNewFeed?.items;

  useEffect(() => {
    if (refresh) {
      getNewFeed({
        variables: { limit: 10, page: 1 },
      });
    }
  }, [getNewFeed, refresh]);

  const refreshControl = () => {
    const onRefresh = () => {
      try {
        setRefresh(true);
      } catch {}
    };

    return <RefreshControl tintColor={theme.text02} refreshing={loading} onRefresh={onRefresh} />;
  };

  const loadMore = () => {
    if (Number(currentPage) < Number(totalPages)) {
      fetchMore &&
        fetchMore({
          variables: { limit: 10, page: currentPage + 1 },
          updateQuery: (prev: GetNewFeedQueryResponse, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return prev;
            }
            const prevItem = prev?.getNewFeed?.items ? prev?.getNewFeed?.items : [];
            const nextItem = fetchMoreResult.getNewFeed?.items ? fetchMoreResult.getNewFeed?.items : [];
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
    const { id, mediasPath, caption, totalLike, createdAt, creatorInfo, isLike } = item;

    return (
      <PostCard
        id={id}
        author={{ avatar: creatorInfo?.avatarFilePath ?? '', name: creatorInfo?.name ?? '', id: creatorInfo?.id ?? 0 }}
        time={createdAt}
        uri={mediasPath?.map((item) => item.filePath) ?? []}
        likes={totalLike}
        caption={caption ?? ''}
        isLike={isLike}
      />
    );
  };

  const content = (
    <FlatGrid
      refreshControl={refreshControl()}
      itemDimension={responsiveWidth(85)}
      showsVerticalScrollIndicator={false}
      data={data ?? []}
      ListEmptyComponent={() => <ImageBanner img={Images.emptyFeed} spacing={20} placeholder={'No new posts'} />}
      style={styles().postList}
      spacing={20}
      renderItem={renderItem}
      onEndReachedThreshold={0.5}
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
        onPress={() => {}}
        Icon={() => <FontAwesome name="send" size={IconSizes.x5} color={theme.text01} />}
      />
    );
  };

  return (
    <View style={styles(theme).container}>
      <HomeHeader IconRight={IconRight} />
      {content}
      {loading ? <PostCardPlaceholder /> : null}
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
