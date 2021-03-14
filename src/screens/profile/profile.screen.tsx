import React, { useRef } from 'react';
import { useApolloClient } from '@apollo/client';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/shared/layout/headers/Header';
import IconButton from '../../components/shared/Iconbutton';
import { IconSizes } from '../../theme/Icon';
import Entypo from 'react-native-vector-icons/Entypo';

import { useRecoilValue } from 'recoil';
import { themeState } from '../../recoil/common/atoms';
import SettingsBottomSheet from './components/SettingsBottomSheet';
import { Modalize } from 'react-native-modalize';
import { ThemeColors } from '../../types/theme';
import ProfileCard from '../../components/shared/ProfileCard';
import { PostDimensions } from '../../theme';
import PostThumbnail from '../../components/shared/PostThumbnail';
import AboutBottomSheet from './components/AboutBottomSheet';
import ProfileScreenPlaceholder from '../../components/placeholders/ProfileScreen.Placeholder';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import ListEmptyComponent from '../../components/shared/ListEmptyComponent';
import { FlatGrid } from 'react-native-super-grid';
import { sortPostsAscendingTime } from '../../utils/shared';
import ConnectionsBottomSheet from '../../components/shared/ConnectionsBottomSheet';
import { Connections } from '../../utils/constants';
import EditProfileBottomSheet from './components/EditProfileBottomSheet';
const ProfileScreen: React.FunctionComponent = React.memo(() => {
  const { navigate } = useNavigation();
  const client = useApolloClient();
  const theme = useRecoilValue(themeState);

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

  // const ListHeaderComponent = (props: any) => {
  //   const {
  //     user: { avatar, following, followers, name, handle, about },
  //   } = props;
  //   return (
  //     <ProfileCard
  //       editable
  //       onEdit={onEdit}
  //       onFollowingOpen={onFollowingOpen}
  //       onFollowersOpen={onFollowersOpen}
  //       avatar={avatar}
  //       following={following.length}
  //       followers={followers.length}
  //       name={name}
  //       handle={handle}
  //       about={about}
  //     />
  //   );
  // };

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
  if (true) {
    const posts = new Array(
      'Bulbasaur',
      'Rhyhorn',
      'Rhydon',
      'Chansey',
      'Tangela',
      'Kangaskhan',
      'Horsea',
      'Seadra',
      'Goldeen',
      'Seaking',
      'Staryu',
      'Starmie',
      'Mr. Mime',
      'Scyther',
      'Jynx',
      'Electabuzz',
      'Magmar',
      'Pinsir',
      'Tauros',
      'Magikarp',
      'Gyarados',
      'Lapras',
      'Ditto',
      'Eevee',
      'Vaporeon',
      'Jolteon',
      'Flareon',
      'Porygon',
      'Omanyte',
      'Omastar',
      'Kabuto',
      'Kabutops',
      'Aerodactyl',
      'Snorlax',
      'Articuno',
      'Zapdos',
      'Moltres',
      'Dratini',
      'Dragonair',
      'Dragonite',
      'Mewtwo',
      'Mew',
    );
    const following = posts;
    const followers = posts;
    const avatar =
      'https://images.pexels.com/photos/5608545/pexels-photo-5608545.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500';
    const name = 'MrH';

    const sortedPosts = sortPostsAscendingTime(posts);
    content = (
      <>
        <FlatGrid
          staticDimension={responsiveWidth(94)}
          // ListHeaderComponent={ListHeaderComponent}
          itemDimension={150}
          data={sortedPosts}
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
