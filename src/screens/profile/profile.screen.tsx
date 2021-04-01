import React, { useRef, useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, View } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Header from '../../components/shared/layout/headers/Header';
import IconButton from '../../components/shared/Iconbutton';
import { IconSizes } from '../../theme/Icon';
import Entypo from 'react-native-vector-icons/Entypo';
import { useRecoilState, useRecoilValue } from 'recoil';
import { themeState } from '../../recoil/theme/atoms';
import SettingsBottomSheet from './components/SettingsBottomSheet';
import ProfileCard from '../../components/shared/ProfileCard';
import { PostDimensions } from '../../theme';
import PostThumbnail from '../../components/shared/PostThumbnail';
import AboutBottomSheet from './components/AboutBottomSheet';
import ProfileScreenPlaceholder from '../../components/placeholders/ProfileScreen.Placeholder';
import ListEmptyComponent from '../../components/shared/ListEmptyComponent';
import { FlatGrid } from 'react-native-super-grid';
import ConnectionsBottomSheet from '../../components/shared/ConnectionsBottomSheet';
import { Connections } from '../../utils/constants';
import type { Modalize } from 'react-native-modalize';
import type { ThemeColors } from '../../types/theme';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { MyPostQueryResponse, useMyPostLazyQuery } from '../../graphql/queries/myPost.generated';
import { somethingWentWrongErrorNotification } from '../../helpers/notifications';
import EditProfileBottomSheet from './components/EditProfileBottomSheet';
import { myPostState } from '../../recoil/app/atoms';
import { useMeLazyQuery } from '../../graphql/queries/me.generated';
import BlockListBottomSheet from './components/BlockListBottomSheet';
import { responsiveWidth } from 'react-native-responsive-dimensions';

const ProfileScreen: React.FunctionComponent = React.memo(() => {
  const theme = useRecoilValue(themeState);
  const isFocused = useIsFocused();
  const me = useCurrentUser();
  const [getMe] = useMeLazyQuery({
    fetchPolicy: 'cache-and-network',
    onCompleted: () => {
      setUpdate(false);
      setRefresh(false);
    },
  });

  const [refresh, setRefresh] = useState(false);
  const [myPost, setMyPost] = useRecoilState(myPostState);
  const [init, setInit] = useState(true);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if (update || isFocused || refresh) {
      getMe();
    }
  }, [update, isFocused, refresh, getMe]);

  const [getMyPost, { data: fetchData, loading, fetchMore }] = useMyPostLazyQuery({
    fetchPolicy: 'cache-and-network',
    onError: (err) => {
      console.log('my post', err);
      somethingWentWrongErrorNotification();
    },
    onCompleted: (res) => {
      setMyPost(res.myPost.items);
      setRefresh(false);
    },
  });

  const currentPage =
    Number(fetchData?.myPost?.meta.currentPage) >= 0 ? Number(fetchData?.myPost?.meta.currentPage) : 1;
  const totalPages = Number(fetchData?.myPost?.meta.totalPages) >= 0 ? Number(fetchData?.myPost?.meta.totalPages) : 2;

  useEffect(() => {
    if (refresh || init) {
      getMe();
      getMyPost({
        variables: { limit: 15, page: 1 },
      });
    }
    setInit(false);
  }, [getMyPost, refresh, init, getMe]);

  const loadMore = () => {
    if (Number(currentPage) < Number(totalPages)) {
      fetchMore &&
        fetchMore({
          variables: { limit: 15, page: currentPage + 1 },
          updateQuery: (prev: MyPostQueryResponse, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return prev;
            }
            const prevItem = prev?.myPost?.items ? prev?.myPost?.items : [];
            const nextItem = fetchMoreResult.myPost?.items ? fetchMoreResult.myPost?.items : [];
            setMyPost([...prevItem, ...nextItem]);
            return Object.assign({}, prev, {
              myPost: {
                items: [...prevItem, ...nextItem],
                meta: fetchMoreResult.myPost?.meta,
                __typename: 'PostConnection',
              },
            });
          },
        });
    }
  };

  const editProfileBottomSheetRef = useRef<Modalize>(null);
  const settingsBottomSheetRef = useRef<Modalize>(null);
  const followingBottomSheetRef = useRef<Modalize>(null);
  const followersBottomSheetRef = useRef<Modalize>(null);
  const aboutBottomSheetRef = useRef<Modalize>(null);
  const blockListBottomSheetRef = useRef<Modalize>(null);
  // @ts-ignore
  const onFollowingOpen = () => followingBottomSheetRef.current?.open();
  // @ts-ignore
  const onFollowersOpen = () => followersBottomSheetRef.current?.open();
  // @ts-ignore
  const onEdit = () => editProfileBottomSheetRef.current?.open();
  // @ts-ignore
  const onSettingsOpen = () => settingsBottomSheetRef.current?.open();
  // @ts-ignore
  const onSettingsClose = () => settingsBottomSheetRef.current?.close();
  // @ts-ignore
  const onAboutOpen = () => aboutBottomSheetRef.current?.open();
  // @ts-ignore
  const onBlockListOpen = () => blockListBottomSheetRef.current.open();

  const onBlockListPress = () => {
    onSettingsClose();
    onBlockListOpen();
  };

  const onAboutPress = () => {
    onSettingsClose();
    onAboutOpen();
  };

  const ListHeaderComponent = (props: any) => {
    return (
      <ProfileCard
        editable
        onEdit={onEdit}
        onFollowingOpen={onFollowingOpen}
        onFollowersOpen={onFollowersOpen}
        avatar={me?.avatarFilePath ?? ''}
        following={me?.nFollowing?.length ?? 0}
        followers={me?.nFollower?.length ?? 0}
        name={me?.name ?? ''}
        nickname={me?.nickname ?? ''}
        about={me?.intro ?? ''}
      />
    );
  };

  // @ts-ignore
  const renderItem = ({ item }) => {
    const { id, mediasPath } = item;
    return (
      <PostThumbnail
        nPost={mediasPath?.length}
        id={id}
        uri={mediasPath[0].filePath}
        dimensions={PostDimensions.Small}
      />
    );
  };

  const IconRight = () => (
    <IconButton
      onPress={onSettingsOpen}
      Icon={() => <Entypo name="dots-three-vertical" size={IconSizes.x5} color={theme.text01} />}
    />
  );

  let content = loading && !myPost?.length ? <ProfileScreenPlaceholder /> : null;

  if (!loading || myPost?.length) {
    content = (
      <View style={{ flex: 1 }}>
        <FlatGrid
          itemDimension={responsiveWidth(22)}
          onRefresh={() => setRefresh(true)}
          refreshing={refresh}
          ListHeaderComponent={ListHeaderComponent}
          data={myPost}
          ListEmptyComponent={() => <ListEmptyComponent listType="posts" spacing={30} />}
          style={styles().postGrid}
          onEndReachedThreshold={0.3}
          onEndReached={() => loadMore()}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          spacing={12}
        />
        <ConnectionsBottomSheet ref={followingBottomSheetRef} data={me?.nFollowing} type={Connections.FOLLOWING} />
        <ConnectionsBottomSheet ref={followersBottomSheetRef} data={me?.nFollower} type={Connections.FOLLOWERS} />
        <EditProfileBottomSheet
          ref={editProfileBottomSheetRef}
          avatar={me?.avatarFilePath ?? ''}
          name={me?.name ?? ''}
          nickname={me?.nickname ?? ''}
          about={me?.intro ?? ''}
          onUpdate={() => setUpdate(true)}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles(theme).container}>
      <Header title="My Profile" IconRight={IconRight} />
      {content}
      {myPost?.length && loading ? <ActivityIndicator /> : null}
      {/* <AboutBottomSheet ref={aboutBottomSheetRef} /> */}
      <SettingsBottomSheet
        ref={settingsBottomSheetRef}
        onBlockListPress={onBlockListPress}
        onAboutPress={onAboutPress}
      />
      <BlockListBottomSheet ref={blockListBottomSheetRef} onUnblock={() => null} />
    </SafeAreaView>
  );
});

export default ProfileScreen;

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.base,
      flex: 1,
    },
    postGrid: {
      flex: 1,
      marginHorizontal: 10,
    },
  });
