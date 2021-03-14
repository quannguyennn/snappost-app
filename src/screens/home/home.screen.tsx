import React from 'react';
import { RefreshControl, StyleSheet, TextInput, View } from 'react-native';
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
import { AppRoutes } from '../../navigator/app-routes';
import { HomeScreenNavigationProp } from '../../navigator/home.navigator';
import { themeState } from '../../recoil/common/atoms';
import { IconSizes } from '../../theme/Icon';
import { ThemeColors } from '../../types/theme';
import Story from 'react-native-story';

const HomeScreen = React.memo(() => {
  const { navigate } = useNavigation<HomeScreenNavigationProp>();
  const theme = useRecoilValue(themeState);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => {
      clearTimeout(init);
    };
  }, []);

  const refreshControl = () => {
    const onRefresh = () => {
      try {
      } catch {}
    };

    return <RefreshControl tintColor={theme.text02} refreshing={loading} onRefresh={onRefresh} />;
  };

  const renderItem = ({ item }: any) => {
    const { id, uri, caption, likes, createdAt, author } = item;

    return <PostCard id={id} author={author} time={createdAt} uri={uri} likes={likes} caption={caption} />;
  };

  let content = <PostCardPlaceholder />;
  const userFeed = [
    {
      id: '1',
      uri: 'https://i.redd.it/eqkolvkcy2wy.jpg',
      caption: 'Mlem mlem',
      likes: [],
      createdAt: '2020-09-17 08:34:40.221711',
      author: {
        id: '2',
        avatar: 'https://i.redd.it/eqkolvkcy2wy.jpg',
        handle: 'Quan',
      },
    },
    {
      id: '2',
      uri: 'https://i.redd.it/eqkolvkcy2wy.jpg',
      caption: 'Mlem mlem',
      likes: [],
      createdAt: '2020-09-17 08:34:40.221711',
      author: {
        id: '2',
        avatar: 'https://i.redd.it/eqkolvkcy2wy.jpg',
        handle: 'Quan',
      },
    },
    {
      id: '3',
      uri: 'https://i.redd.it/eqkolvkcy2wy.jpg',
      caption: 'Mlem mlem',
      likes: [],
      createdAt: '2020-09-17 08:34:40.221711',
      author: {
        id: '2',
        avatar: 'https://i.redd.it/eqkolvkcy2wy.jpg',
        handle: 'Quan',
      },
    },
  ];
  if (!loading) {
    content = (
      <FlatGrid
        refreshControl={refreshControl()}
        itemDimension={responsiveWidth(85)}
        showsVerticalScrollIndicator={false}
        data={userFeed}
        ListEmptyComponent={() => <ImageBanner img={Images.emptyFeed} spacing={20} placeholder={'No new posts'} />}
        style={styles().postList}
        spacing={20}
        renderItem={renderItem}
      />
    );
  }

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
