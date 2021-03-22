import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { FlatGrid } from 'react-native-super-grid';
import Entypo from 'react-native-vector-icons/Entypo';
import ProfileOptionsBottomSheet from './components/ProfileOptionsBottomSheet';
import UserInteractions from './components/UserInteractions';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../recoil/theme/atoms';
import { RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { HandleAvailableColor, PostDimensions, ThemeStatic } from '../../theme';
import { Connections, PollIntervals } from '../../utils/constants';
import { IconSizes } from '../../theme/Icon';
import type { ThemeColors } from '../../types/theme';
import { somethingWentWrongErrorNotification, tryAgainLaterNotification, userBlockedNotification } from '../../helpers/notifications';
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
import { useGetUserInfoLazyQuery } from '../../graphql/queries/getUserInfo.generated';
import { GetUserPostQueryResponse, useGetUserPostLazyQuery } from '../../graphql/queries/getUserPost.generated';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useHandleFollowRequestMutation } from '../../graphql/mutations/handleFollowRequest.generated';
import { useBlockUserMutation } from '../../graphql/mutations/blockUser.generated';

const ProfileViewScreen: React.FC = () => {
  const theme = useRecoilValue(themeState);
  const { goBack } = useNavigation();
  const {
    params: { userId },
  } = useRoute<RouteProp<AppStackParamList, AppRoutes.PROFILE_VIEW_SCREEN>>();

  const [blockConfirmationModal, setBlockConfirmationModal] = useState(false);
  const [init, setInit] = useState(true);
  const [update, setUpdate] = useState(false)
  const [refresh, setRefresh] = useState(false)

  const [getUser, { data, loading, error, called }] = useGetUserInfoLazyQuery({
    variables: { id: userId },
    pollInterval: PollIntervals.profileView,
    onCompleted: (res) => {
      setUpdate(false)
      setRefresh(false)
    },
    fetchPolicy: "cache-and-network"
  });

  const [blockUser] = useBlockUserMutation({
    onError: (err) => {
      console.log("block user", err)
      tryAgainLaterNotification();
    },
    onCompleted: () => {
      goBack();
      userBlockedNotification(data?.getUserInfo?.name);
    }
  })

  useEffect(() => {
    if (update) {
      getUser({ variables: { id: userId } })
    }
  }, [update])

  const [getUserPost, { data: fetchData, loading: loadingPost, fetchMore }] = useGetUserPostLazyQuery({
    fetchPolicy: 'cache-and-network',
    onError: (err: any) => {
      console.log('user post', err);
      somethingWentWrongErrorNotification();
    },
    onCompleted: () => {
      setRefresh(false);
    },
  });

  const currentPage =
    Number(fetchData?.getUserPost?.meta.currentPage) >= 0 ? Number(fetchData?.getUserPost?.meta.currentPage) : 1;
  const totalPages = Number(fetchData?.getUserPost?.meta.totalPages) >= 0 ? Number(fetchData?.getUserPost?.meta.totalPages) : 2;

  const posts = fetchData?.getUserPost.items;

  useEffect(() => {
    if (refresh || init) {
      getUser({ variables: { id: userId } });
    }
    setInit(false);
  }, [refresh, init]);

  useEffect(() => {
    if (init && called && data?.getUserInfo?.followStatus === "ACCEPT") {
      getUserPost({
        variables: { userId, limit: 15, page: 1 },
      })
    }
    setInit(false)
  }, [called, getUserPost, data, init])

  const loadMore = () => {
    if (Number(currentPage) < Number(totalPages)) {
      fetchMore &&
        fetchMore({
          variables: { limit: 15, page: currentPage + 1 },
          updateQuery: (prev: GetUserPostQueryResponse, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return prev;
            }
            const prevItem = prev?.getUserPost?.items ? prev?.getUserPost?.items : [];
            const nextItem = fetchMoreResult.getUserPost?.items ? fetchMoreResult.getUserPost?.items : [];
            return Object.assign({}, prev, {
              getUserPost: {
                items: [...prevItem, ...nextItem],
                meta: fetchMoreResult.getUserPost?.meta,
                __typename: 'PostConnection',
              },
            });
          },
        });
    }
  };

  const [updateRequest] = useHandleFollowRequestMutation({
    onCompleted: () => {
      setUpdate(true)
    }
  });

  const onHandleRequest = (accept: boolean) => {
    updateRequest({ variables: { userId: data?.getUserInfo?.id ?? 0, accept } })
  }

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
    const { id, intro, name, nickname, avatarFilePath, followStatus, nFollower, nFollowing } = data?.getUserInfo ?? {}
    return (
      <>
        {
          data?.getUserInfo?.isRequestFollowMe ? <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ flex: 1, flexWrap: "wrap", fontSize: 16, color: theme.text01 }}>{name} has requested to follow you</Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={() => onHandleRequest(true)}>
                <MaterialIcons name={'done'} color={ThemeStatic.accent} size={IconSizes.x7} />
              </TouchableOpacity>
              <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => onHandleRequest(false)}>
                <MaterialIcons name={'close'} color={HandleAvailableColor.false} size={IconSizes.x7} />
              </TouchableOpacity>
            </View>
          </View> : null
        }

        <ProfileCard
          avatar={avatarFilePath}
          onFollowingOpen={onFollowingOpen}
          onFollowersOpen={onFollowersOpen}
          following={nFollowing?.length ?? 0}
          followers={nFollower?.length ?? 0}
          name={name}
          nickname={nickname}
          renderInteractions={() => (
            <UserInteractions isFollow={followStatus} targetId={id ?? 0} onInteract={() => setUpdate(true)} />
          )}
          about={intro}
        />
      </>
    );
  };

  const renderItem = ({ item }: any) => {
    const { id, mediasPath } = item;
    return <PostThumbnail
      nPost={mediasPath?.length ?? 0}
      id={id}
      uri={mediasPath ? mediasPath[0].filePath : ""}
      dimensions={PostDimensions.Small}
    />;
  };

  let content = <ProfileScreenPlaceholder viewMode />;
  if (!loading && !error) {
    const { name, nFollower, nFollowing } = data?.getUserInfo ?? {}
    content = (
      <>
        <FlatGrid
          ListHeaderComponent={ListHeaderComponent}
          data={posts}
          onEndReachedThreshold={0.3}
          onEndReached={() => loadMore()}
          onRefresh={() => setRefresh(true)}
          refreshing={refresh}
          ListEmptyComponent={() => data?.getUserInfo?.followStatus === "ACCEPT" ? <ListEmptyComponent listType="posts" spacing={30} /> : <ListEmptyComponent listType="posts" spacing={30} private />}
          style={styles().postGrid}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
        />
        <ConnectionsBottomSheet
          viewMode
          ref={followingBottomSheetRef}
          //following
          data={nFollowing}
          handle={name}
          type={Connections.FOLLOWING}
        />
        <ConnectionsBottomSheet
          viewMode
          ref={followersBottomSheetRef}
          data={nFollower}
          handle={name}
          type={Connections.FOLLOWERS}
        />
      </>
    );
  }

  const onBlockUser = () => {
    onProfileOptionsClose();
    toggleBlockConfirmationModal();
  };

  const processBlockUser = () => {
    // const { user: { handle } } = data;

    toggleBlockConfirmationModal();
    blockUser({ variables: { id: userId } })

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
      {
        !init && loadingPost ? <ActivityIndicator /> : null
      }
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
