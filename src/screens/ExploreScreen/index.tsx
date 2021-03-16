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

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const FadeView = posed.View({
  enter: { opacity: 1 },
  exit: { opacity: 0.25 },
});

const ExploreScreen: React.FC = () => {
  const theme = useRecoilValue(themeState);

  const [userSearch, setUserSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const debouncedSearchResult = useDebounce(userSearch, Debounce.EXPLORE_SEARCH);

  useEffect(() => {
    if (debouncedSearchResult !== '') {
      // searchUsersQuery({ variables: { userId: user.id, name: debouncedSearchResult } });
    }

    // if (searchUsersQueryCalled && !searchUsersQueryLoading) {
    //   const { searchUsers } = searchUsersQueryData;
    //   setSearchResults(searchUsers);
    // }
    // }, [debouncedSearchResult, searchUsersQueryData, searchUsersQueryCalled, searchUsersQueryLoading]);
  }, []);

  const onEndReached = () => {
    // fetchMorePosts();
  };

  const onFocus = () => setIsSearchFocused(true);

  const onBlur = () => setIsSearchFocused(false);

  let content = <ExploreScreenPlaceholder />;

  const onRefresh = () => {
    try {
      // refetchPosts();
    } catch {}
  };

  const posts = [
    {
      id: '1',
      uri: 'https://i.redd.it/eqkolvkcy2wy.jpg',
    },
    {
      id: '2',
      uri: 'https://i.redd.it/eqkolvkcy2wy.jpg',
    },
    {
      id: '3',
      uri: 'https://i.redd.it/eqkolvkcy2wy.jpg',
    },
    {
      id: '4',
      uri: 'https://i.redd.it/eqkolvkcy2wy.jpg',
    },
    {
      id: '6',
      uri: 'https://i.redd.it/eqkolvkcy2wy.jpg',
    },
    {
      id: '7',
      uri: 'https://i.redd.it/eqkolvkcy2wy.jpg',
    },
    {
      id: '8',
      uri: 'https://i.redd.it/eqkolvkcy2wy.jpg',
    },
    {
      id: '9',
      uri: 'https://i.redd.it/eqkolvkcy2wy.jpg',
    },
    {
      id: '9',
      uri: 'https://i.redd.it/eqkolvkcy2wy.jpg',
    },
    {
      id: '9',
      uri: 'https://i.redd.it/eqkolvkcy2wy.jpg',
    },
    {
      id: '9',
      uri: 'https://i.redd.it/eqkolvkcy2wy.jpg',
    },
    {
      id: '9',
      uri: 'https://i.redd.it/eqkolvkcy2wy.jpg',
    },
  ];

  if (true) {
    content = <ExploreGrid posts={posts} onRefresh={onRefresh} tintColor={theme.text02} onEndReached={onEndReached} />;
  }

  if (isSearchFocused) {
    let subContent;
    // if (searchUsersQueryCalled && searchUsersQueryLoading) {
    // subContent = <SearchUsersPlaceholder />;
    // } else if (!searchUsersQueryLoading && userSearch === '') {
    // subContent = (
    //   <SvgBanner Svg={<Image source={Images.searchUser} />} spacing={16} placeholder="Search for users..." />
    // );
    // } else if (searchUsersQueryCalled && !searchUsersQueryLoading && !searchUsersQueryError) {
    //   subContent = <UserSearchResults searchResults={searchResults} />;
    // }

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
