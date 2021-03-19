import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import ExploreGrid from './components/ExploreGrid';
import UserSearchResults from './components/UserSearchResults';
import useDebounce from './hooks/useDebounce';
import posed, { Transition } from 'react-native-pose';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../recoil/theme/atoms';
import { Debounce } from '../../utils/constants';
import ExploreScreenPlaceholder from '../../components/placeholders/Explore.Placeholder';
import SearchUsersPlaceholder from '../../components/placeholders/UserSearch.Placeholder';
import SvgBanner from '../../components/shared/SvgBanner';
import Header from '../../components/shared/layout/headers/Header';
import AnimatedSearchBar from '../../components/shared/layout/headers/AnimatedSearchBar';
import type { ThemeColors } from '../../types/theme';
import { Images } from '../../assets1/icons';
import { SearchUserQueryResponse, useSearchUserLazyQuery } from '../../graphql/queries/searchUser.generated';
import { tryAgainLaterNotification } from '../../helpers/notifications';
import {
  GetExplorePostQueryResponse,
  useGetExplorePostLazyQuery,
} from '../../graphql/queries/getExplorePost.generated';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const FadeView = posed.View({
  enter: { opacity: 1 },
  exit: { opacity: 0.25 },
});

const ExploreScreen: React.FC = () => {
  const theme = useRecoilValue(themeState);

  const [userSearch, setUserSearch] = useState('');
  const [refreshUser, setRefreshUser] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [init, setInit] = useState(true);

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [
    searchUsersQuery,
    {
      data: searchUsersQueryData,
      loading: searchUsersQueryLoading,
      called: searchUsersQueryCalled,
      error: searchUsersQueryError,
      fetchMore,
    },
  ] = useSearchUserLazyQuery({
    onCompleted: () => {
      setRefreshUser(false);
    },
    onError: (err) => {
      console.log('search user', err);
      tryAgainLaterNotification();
    },
  });

  const currentPage =
    Number(searchUsersQueryData?.searchUser?.meta.currentPage) >= 0
      ? Number(searchUsersQueryData?.searchUser?.meta.currentPage)
      : 1;
  const totalPages =
    Number(searchUsersQueryData?.searchUser?.meta.totalPages) >= 0
      ? Number(searchUsersQueryData?.searchUser?.meta.totalPages)
      : 2;

  const searchUsers = searchUsersQueryData?.searchUser.items;

  const loadMore = () => {
    if (Number(currentPage) < Number(totalPages)) {
      fetchMore &&
        fetchMore({
          variables: { limit: 20, page: currentPage + 1 },
          updateQuery: (prev: SearchUserQueryResponse, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return prev;
            }
            const prevItem = prev?.searchUser?.items ? prev?.searchUser?.items : [];
            const nextItem = fetchMoreResult.searchUser?.items ? fetchMoreResult.searchUser?.items : [];
            return Object.assign({}, prev, {
              searchUser: {
                items: [...prevItem, ...nextItem],
                meta: fetchMoreResult.searchUser?.meta,
                __typename: 'UserConnection',
              },
            });
          },
        });
    }
  };

  const debouncedSearchResult = useDebounce(userSearch, Debounce.EXPLORE_SEARCH);

  useEffect(() => {
    if (debouncedSearchResult !== '' || refreshUser) {
      searchUsersQuery({
        variables: {
          keyword: debouncedSearchResult,
          isRestricted: false,
          limit: 10,
          page: 1,
        },
      });
    }
  }, [debouncedSearchResult, searchUsersQuery, refreshUser]);

  const [
    getExplorePost,
    { data: fetchPost, loading: postsLoading, fetchMore: fetchMorePost, called },
  ] = useGetExplorePostLazyQuery({
    onError: (err) => {
      console.log('explore post', err);
      tryAgainLaterNotification();
    },
    onCompleted: (res) => {
      setInit(false);
      setRefresh(false);
    },
  });

  useEffect(() => {
    if (init || refresh) {
      getExplorePost({ variables: { limit: 20, page: 1 } });
    }
    setInit(false);
  }, [init, refresh, getExplorePost]);

  const currentPagePost =
    Number(fetchPost?.getExplorePost?.meta.currentPage) >= 0 ? Number(fetchPost?.getExplorePost?.meta.currentPage) : 1;
  const totalPagesPost =
    Number(fetchPost?.getExplorePost?.meta.totalPages) >= 0 ? Number(fetchPost?.getExplorePost?.meta.totalPages) : 2;

  const postsData = fetchPost?.getExplorePost.items;

  const loadMorePost = () => {
    if (Number(currentPagePost) < Number(totalPagesPost)) {
      fetchMorePost &&
        fetchMorePost({
          variables: { limit: 20, page: currentPagePost + 1 },
          updateQuery: (prev: GetExplorePostQueryResponse, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return prev;
            }
            const prevItem = prev?.getExplorePost?.items ? prev?.getExplorePost?.items : [];
            const nextItem = fetchMoreResult.getExplorePost?.items ? fetchMoreResult.getExplorePost?.items : [];
            return Object.assign({}, prev, {
              getExplorePost: {
                items: [...prevItem, ...nextItem],
                meta: fetchMoreResult.getExplorePost?.meta,
                __typename: 'PostConnection',
              },
            });
          },
        });
    }
  };

  const onEndReached = () => {
    loadMorePost();
  };

  const onUserEndReached = () => {
    loadMore();
  };

  const onFocus = () => setIsSearchFocused(true);

  const onBlur = () => setIsSearchFocused(false);

  let content = <ExploreScreenPlaceholder />;

  const onRefresh = () => {
    try {
      setRefresh(true);
    } catch {}
  };

  const onUserRefresh = () => {
    setRefreshUser(true);
  };

  if (!postsLoading && called) {
    const posts = postsData?.map((item) => {
      return { id: item.id, uri: (item && item.mediasPath && item?.mediasPath[0].filePath) ?? '' };
    });

    content = (
      <ExploreGrid
        refresh={refresh}
        posts={posts}
        onRefresh={onRefresh}
        tintColor={theme.text02}
        onEndReached={onEndReached}
      />
    );
  }

  if (isSearchFocused) {
    let subContent;
    if (searchUsersQueryCalled && searchUsersQueryLoading) {
      subContent = <SearchUsersPlaceholder />;
    } else if (!searchUsersQueryLoading && userSearch === '') {
      subContent = (
        <SvgBanner Svg={<Image source={Images.searchUser} />} spacing={16} placeholder="Search for users..." />
      );
    } else if (searchUsersQueryCalled && !searchUsersQueryLoading && !searchUsersQueryError) {
      subContent = (
        <UserSearchResults
          refresh={refreshUser}
          onUserRefresh={onUserRefresh}
          onUserEndReached={onUserEndReached}
          searchResults={searchUsers}
        />
      );
    }

    content = (
      <Transition animateOnMount>
        <FadeView style={styles().fadeView} key="search-content">
          {subContent}
        </FadeView>
      </Transition>
    );
  }

  return (
    <View style={styles(theme).container}>
      <Header title="Explore" />
      <AnimatedSearchBar
        onFocus={onFocus}
        onBlur={onBlur}
        value={userSearch}
        onChangeText={setUserSearch}
        placeholder="Search for users..."
      />
      <View style={styles().content}>{content}</View>
    </View>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.base,
    },
    content: {
      flex: 1,
    },
    fadeView: {
      flex: 1,
    },
  });

export default ExploreScreen;
