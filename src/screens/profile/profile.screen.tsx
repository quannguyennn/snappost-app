import React, { useEffect, useRef, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/shared/layout/headers/Header';
import IconButton from '../../components/shared/Iconbutton';
import { IconSizes } from '../../theme/Icon';
import Entypo from 'react-native-vector-icons/Entypo';

import { useRecoilValue } from 'recoil';
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
import { useMyPostLazyQuery } from '../../graphql/queries/myPost.generated';
import { somethingWentWrongErrorNotification } from '../../helpers/notifications';

const ProfileScreen: React.FunctionComponent = React.memo(() => {
  const { navigate } = useNavigation();
  const theme = useRecoilValue(themeState);

  const me = useCurrentUser();

  const [refresh, setRefresh] = useState(true);

  const [getMyPost, { data: fetchData, loading, fetchMore }] = useMyPostLazyQuery({
    onError: () => somethingWentWrongErrorNotification(),
    onCompleted: () => {

    }
  })

  const currentPage =
    Number(fetchData?.myPost?.meta.currentPage) >= 0 ? Number(fetchData?.myPost?.meta.currentPage) : 1;
  const totalPages =
    Number(fetchData?.myPost?.meta.totalPages) >= 0 ? Number(fetchData?.myPost?.meta.totalPages) : 2;

  const data = fetchData?.myPost?.items;

  useEffect(() => {
    if (refresh) {
      getMyPost({
        variables: { limit: 10, page: 1 },
      });
    }
  }, [getMyPost, refresh]);

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
        avatar={me?.avatarFilePath ?? ""}
        following={me?.nFollowing as number ?? 0}
        followers={me?.nFollower as number ?? 0}
        name={me?.name ?? ''}
        handle={me?.nickname ?? ""}
        about={me?.intro ?? ""}
      />
    );
  };

  // @ts-ignore
  const renderItem = ({ item }) => {
    const { id, uri } = item;
    return <PostThumbnail id={id} uri={uri} dimensions={PostDimensions.Medium} />;
  };

  const IconRight = () => (
    <IconButton
      onPress={onSettingsOpen}
      Icon={() => <Entypo name="dots-three-vertical" size={IconSizes.x5} color={theme.text01} />}
    />
  );

  let content = <ProfileScreenPlaceholder />;
  // loading : query user
  if (loading) {

    content = (
      <>
        <FlatGrid
          staticDimension={responsiveWidth(94)}
          ListHeaderComponent={ListHeaderComponent}
          itemDimension={150}
          data={data}
          ListEmptyComponent={() => <ListEmptyComponent listType="posts" spacing={30} />}
          style={styles().postGrid}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
        />
        <ConnectionsBottomSheet ref={followingBottomSheetRef} data={following} type={Connections.FOLLOWING} />
        <ConnectionsBottomSheet ref={followersBottomSheetRef} data={followers} type={Connections.FOLLOWERS} />
        {/*<EditProfileBottomSheet*/}
        {/*  ref={editProfileBottomSheetRef}*/}
        {/*  avatar={avatar}*/}
        {/*  name={name}*/}
        {/*  handle={handle}*/}
        {/*  about={about}*/}
        {/*/>*/}
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
