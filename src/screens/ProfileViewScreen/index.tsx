import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { FlatGrid } from 'react-native-super-grid';
import Entypo from 'react-native-vector-icons/Entypo';
import ProfileOptionsBottomSheet from './components/ProfileOptionsBottomSheet';
import UserInteractions from './components/UserInteractions';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../recoil/theme/atoms';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { PostDimensions, ThemeStatic } from '../../theme';
import { Connections, PollIntervals } from '../../utils/constants';
import { IconSizes } from '../../theme/Icon';
import type { ThemeColors } from '../../types/theme';
import { userBlockedNotification } from '../../helpers/notifications';
import { sortPostsAscendingTime } from '../../utils/shared';
import ProfileCard from '../../components/shared/ProfileCard';
import PostThumbnail from '../../components/shared/PostThumbnail';
import ListEmptyComponent from '../../components/shared/ListEmptyComponent';
import ProfileScreenPlaceholder from '../../components/placeholders/ProfileScreen.Placeholder';
import ConnectionsBottomSheet from '../../components/shared/ConnectionsBottomSheet';
import IconButton from '../../components/shared/Iconbutton';
import GoBackHeader from '../../components/shared/layout/headers/GoBackHeader';
import ConfirmationModal from '../../components/shared/ComfirmationModal';
import type { AppStackParamList } from '../../navigator/app.navigator';
import type { AppRoutes } from '../../navigator/app-routes';
import { useGetUserInfoQuery } from '../../graphql/queries/getUserInfo.generated';
import { useUserInfo } from '../../hooks/useUserInfo';

const ProfileViewScreen: React.FC = () => {
  const theme = useRecoilValue(themeState);
  const { goBack } = useNavigation();
  const {
    params: { userId },
  } = useRoute<RouteProp<AppStackParamList, AppRoutes.PROFILE_VIEW_SCREEN>>();
  const user = useUserInfo(userId)

  const [blockConfirmationModal, setBlockConfirmationModal] = useState(false);

  // const { data, loading, error } = useQuery(QUERY_USER, {
  //   variables: { userId },
  //   pollInterval: PollIntervals.profileView,
  //   fetchPolicy: 'network-only'
  // });

  const { data, loading, error } = useGetUserInfoQuery({
    variables: { id: userId },
    pollInterval: PollIntervals.profileView,
  });

  // const [blockUser] = useMutation(MUTATION_BLOCK_USER);

  const followingBottomSheetRef = useRef();
  const followersBottomSheetRef = useRef();
  const profileOptionsBottomSheetRef = useRef();

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const onFollowingOpen = () => followingBottomSheetRef.current.open();
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const onFollowersOpen = () => followersBottomSheetRef.current.open();
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const onProfileOptionsOpen = () => profileOptionsBottomSheetRef.current.open();
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const onProfileOptionsClose = () => profileOptionsBottomSheetRef.current.close();

  const toggleBlockConfirmationModal = () => setBlockConfirmationModal(!blockConfirmationModal);

  const ListHeaderComponent = () => {
    // const { user: { avatar, following, followers, name, handle, about } } = data;
    return (
      <ProfileCard
        avatar={user?.avatarFilePath}
        onFollowingOpen={onFollowingOpen}
        onFollowersOpen={onFollowersOpen}
        following={'100'}
        followers={'200'}
        name={user?.name}
        nickname={user?.nickname}
        renderInteractions={() => (
          <UserInteractions targetId={'userId'} avatar={user?.avatarFilePath} name={user?.name} />
        )}
        about={user?.intro}
      />
    );
  };

  const renderItem = ({ item }: any) => {
    const { id, uri } = item;
    return <PostThumbnail id={id} uri={uri} dimensions={PostDimensions.Medium} />;
  };

  let content = <ProfileScreenPlaceholder viewMode />;
  //!loading && !error
  if (true) {
    // const { user: { handle, following, followers, posts } } = data;
    const sortedPosts = sortPostsAscendingTime(['post']);

    content = (
      <>
        <FlatGrid
          staticDimension={responsiveWidth(94)}
          ListHeaderComponent={ListHeaderComponent}
          itemDimension={150}
          data={sortedPosts}
          ListEmptyComponent={() => <ListEmptyComponent listType="posts" spacing={30} />}
          style={styles().postGrid}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
        />
        <ConnectionsBottomSheet
          viewMode
          ref={followingBottomSheetRef}
          //following
          data={'10000'}
          handle={'hihihi'}
          type={Connections.FOLLOWING}
        />
        <ConnectionsBottomSheet
          viewMode
          ref={followersBottomSheetRef}
          data={'followers'}
          handle={'handle'}
          type={Connections.FOLLOWERS}
        />
      </>
    );
  }

  const onBlockUser = () => {
    onProfileOptionsClose();
    toggleBlockConfirmationModal();
  };

  const processBlockUser = async () => {
    // const { user: { handle } } = data;

    toggleBlockConfirmationModal();
    // await blockUser({ variables: { from: 'user.id', to: 'userId' } });
    goBack();
    userBlockedNotification('handle');
  };

  const IconRight = () => (
    <IconButton
      onPress={onProfileOptionsOpen}
      style={styles().profileOptions}
      Icon={() => <Entypo name="dots-three-vertical" size={IconSizes.x5} color={theme.text01} />}
    />
  );

  return (
    <View style={styles(theme).container}>
      <GoBackHeader iconSize={IconSizes.x7} IconRight={IconRight} />
      {content}
      <ProfileOptionsBottomSheet ref={profileOptionsBottomSheetRef} onBlockUser={onBlockUser} />
      <ConfirmationModal
        label="Confirm"
        title="Block"
        description="Are you sure you want to block this user?"
        color={ThemeStatic.delete}
        isVisible={blockConfirmationModal}
        toggle={toggleBlockConfirmationModal}
        onConfirm={processBlockUser}
      />
    </View>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.base,
    },
    postGrid: {
      flex: 1,
      marginHorizontal: 10,
    },
    profileOptions: {
      flex: 1,
      alignItems: 'flex-end',
    },
  });

export default ProfileViewScreen;
