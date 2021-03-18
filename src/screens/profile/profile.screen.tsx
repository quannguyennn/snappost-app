import React, { useRef, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
import { responsiveWidth } from 'react-native-responsive-dimensions';
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

const ProfileScreen: React.FunctionComponent = React.memo(() => {
  const theme = useRecoilValue(themeState);

  const me = useCurrentUser();

  const [refresh, setRefresh] = useState(false);
  const [myPost, setMyPost] = useRecoilState(myPostState);
  const [init, setInit] = useState(true);

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

  // const data = fetchData?.myPost.items;

  useEffect(() => {
    if (refresh || init) {
      getMyPost({
        variables: { limit: 20, page: 1 },
      });
    }
    setInit(false);
  }, [getMyPost, refresh, init]);

  const loadMore = () => {
    if (Number(currentPage) < Number(totalPages)) {
      fetchMore &&
        fetchMore({
          variables: { limit: 20, page: currentPage + 1 },
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
    return <PostThumbnail id={id} uri={mediasPath[0].filePath} dimensions={PostDimensions.Medium} />;
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
      <>
        <FlatGrid
          onRefresh={() => setRefresh(true)}
          refreshing={refresh}
          staticDimension={responsiveWidth(94)}
          ListHeaderComponent={ListHeaderComponent}
          itemDimension={150}
          data={myPost}
          ListEmptyComponent={() => <ListEmptyComponent listType="posts" spacing={30} />}
          style={styles().postGrid}
          onEndReachedThreshold={0.5}
          onEndReached={() => loadMore()}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
        />
        <ConnectionsBottomSheet ref={followingBottomSheetRef} data={me?.nFollowing} type={Connections.FOLLOWING} />
        <ConnectionsBottomSheet ref={followersBottomSheetRef} data={me?.nFollower} type={Connections.FOLLOWERS} />
        <EditProfileBottomSheet
          ref={editProfileBottomSheetRef}
          avatar={me?.avatarFilePath ?? ''}
          name={me?.name ?? ''}
          handle={me?.nickname ?? ''}
          about={me?.intro ?? ''}
        />
      </>
    );
  }

  return (
    <SafeAreaView style={styles(theme).container}>
      <Header title="My Profile" IconRight={IconRight} />
      {content}
      <AboutBottomSheet ref={aboutBottomSheetRef} />
      <SettingsBottomSheet
        ref={settingsBottomSheetRef}
        onBlockListPress={onBlockListPress}
        onAboutPress={onAboutPress}
      />
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
