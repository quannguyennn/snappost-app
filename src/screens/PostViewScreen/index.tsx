/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, { createRef, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import CommentInput from './components/CommentInput';
// import EditPostBottomSheet from './components/EditPostBottomSheet';
import LikeBounceAnimation from './components/LikeBounceAnimation';
import LikesBottomSheet from './components/LikesBottomSheet';
import PostOptionsBottomSheet from './components/PostOptionsBottomSheet';
import { useRecoilState, useRecoilValue } from 'recoil';
import { RouteProp, StackActions, useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import PostViewScreenPlaceholder from '../../components/placeholders/PostViewScreen.Placeholder';
import BounceView from '../../components/shared/BounceView';
import ConfirmationModal from '../../components/shared/ComfirmationModal';
import IconButton from '../../components/shared/Iconbutton';
import GoBackHeader from '../../components/shared/layout/headers/GoBackHeader';
import NativeImage from '../../components/shared/NativeImage';
import { AppRoutes } from '../../navigator/app-routes';
import type { AppStackParamList } from '../../navigator/app.navigator';
import { themeState } from '../../recoil/theme/atoms';
import { Typography, ThemeStatic, PostDimensions } from '../../theme';
import { IconSizes } from '../../theme/Icon';
import type { ThemeColors } from '../../types/theme';
import { useGetPostDetailQuery } from '../../graphql/queries/getPostDetail.generated';
import {
  postDeletedNotification,
  somethingWentWrongErrorNotification,
  tryAgainLaterNotification,
} from '../../helpers/notifications';
import FastImage from 'react-native-fast-image';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import TransformText from '../../components/shared/TransformText';
import CommentList from './components/Comments';
import { useReactToPostMutation } from '../../graphql/mutations/reactToPost.generated';
import { useRemovePostMutation } from '../../graphql/mutations/removePost.generated';
import { myPostState, newFeedState } from '../../recoil/app/atoms';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { PollIntervals } from '../../utils/constants';
import { useOnLikePostSubscription } from '../../graphql/subscriptions/onLikePost.generated';
import { useOnUnLikePostSubscription } from '../../graphql/subscriptions/onUnLikePost.generated';

const { FontWeights, FontSizes } = Typography;

const PostViewScreen: React.FC = () => {
  const theme = useRecoilValue(themeState);
  const { goBack, dispatch } = useNavigation();
  const user = useCurrentUser();
  const {
    params: { postId },
  } = useRoute<RouteProp<AppStackParamList, AppRoutes.POST_VIEW_SCREEN>>();

  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [lastTap, setLastTap] = useState(Date.now());
  const [mediaIndex, setMediaIndex] = useState(0);
  const [isLike, setIsLike] = useState(false);
  const [totalLike, setTotalLike] = useState(0);
  const [post, setPost] = useRecoilState(newFeedState);
  const [myPost, setMyPost] = useRecoilState(myPostState);

  const [reactToPost] = useReactToPostMutation({
    onError: (err) => {
      console.log('like', err);
      somethingWentWrongErrorNotification();
    },
    onCompleted: (res) => {
      setIsLike(res.reactToPost);
    },
  });

  const { data: fetchData, loading } = useGetPostDetailQuery({
    pollInterval: PollIntervals.postView,
    variables: { id: postId },
    onError: (err) => {
      console.log('post detail', err);
      somethingWentWrongErrorNotification();
    },
    onCompleted: (res) => {
      setTotalLike(res.getPostDetail.totalLike);
      setIsLike(res.getPostDetail.isLike);
    },
  });

  const data = fetchData?.getPostDetail;

  const [deletePost] = useRemovePostMutation({
    onCompleted: () => {
      handleUpdatePostState();
    },
    onError: (err) => {
      console.log('post detail', err);
      tryAgainLaterNotification();
    },
  });

  const handleUpdatePostState = () => {
    const tempPost = post?.filter((item) => item.id !== postId);
    const tempMyPost = myPost?.filter((item) => item.id !== postId);
    setPost(tempPost);
    setMyPost(tempMyPost);
    confirmationToggle();
    goBack();
    postDeletedNotification();
  };

  useOnLikePostSubscription({
    variables: { postId },
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData.error) {
        console.log('like post sub', subscriptionData.error);
      } else {
        // @ts-ignore
        setTotalLike(totalLike + 1);
      }
    },
  });

  useOnUnLikePostSubscription({
    variables: { postId },
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData.error) {
        console.log('unlike post sub', subscriptionData.error);
      } else {
        // @ts-ignore
        // const temp = [...user];
        setTotalLike(totalLike - 1);
      }
    },
  });

  const scrollViewRef = useRef();
  const postOptionsBottomSheetRef = useRef();
  // const editPostBottomSheetRef = useRef();
  const likesBottomSheetRef = useRef();
  const likeBounceAnimationRef = createRef();

  const confirmationToggle = () => {
    setIsConfirmModalVisible(!isConfirmModalVisible);
  };

  const navigateToProfile = (userId: number) => {
    if (userId === user?.id ?? 0) {
      return;
    }
    dispatch(StackActions.push(AppRoutes.PROFILE_VIEW_SCREEN, { userId }));
  };

  const openOptions = () => {
    //   @ts-ignore
    postOptionsBottomSheetRef?.current?.open();
  };

  const closeOptions = () => {
    //   @ts-ignore
    postOptionsBottomSheetRef?.current?.close();
  };

  const openLikes = () => {
    //   @ts-ignore
    likesBottomSheetRef?.current?.open();
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 500;
    if (now - lastTap < DOUBLE_PRESS_DELAY) {
      if (isLike) {
        // @ts-ignore
        likeBounceAnimationRef.current.animate();
      } else {
        likeInteractionHandler();
      }
    } else {
      setLastTap(now);
    }
  };

  const likeInteractionHandler = () => {
    if (!isLike) {
      // @ts-ignore
      likeBounceAnimationRef.current.animate();
    }
    reactToPost({ variables: { postId } });
  };

  const onPostEdit = () => {
    closeOptions();
    // navigate(AppRoutes.EDIT_CATION_SCREEN, { postId });
    // @ts-ignore
    // editPostBottomSheetRef.current.open();
  };

  const onPostDelete = () => {
    closeOptions();
    confirmationToggle();
  };

  const onDeleteConfirm = (id: number) => {
    deletePost({ variables: { id } });
  };

  let content = <PostViewScreenPlaceholder />;

  if (!loading && data) {
    const { mediasPath, rawCaption, createdAt, creatorInfo } = data;

    const readableTime = moment(createdAt).fromNow();

    content = (
      <>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigateToProfile(creatorInfo?.id ?? 0)}
          style={styles().postHeader}>
          <NativeImage uri={creatorInfo?.avatarFilePath ?? ''} style={styles(theme).avatarImage} />
          <View style={{ flex: 1 }}>
            <Text style={styles(theme).handleText}>{creatorInfo?.name}</Text>
            <Text style={styles(theme).timeText}>{readableTime}</Text>
          </View>
          <IconButton
            onPress={openOptions}
            Icon={() => <Entypo name="dots-three-vertical" size={IconSizes.x4} color={theme.text01} />}
          />
        </TouchableOpacity>
        <View>
          <Carousel
            data={mediasPath?.map((item) => item.filePath) ?? []}
            renderItem={({ item, index }: { item: any; index: number }) => {
              return (
                <TouchableOpacity onPress={() => handleDoubleTap()} activeOpacity={1}>
                  <FastImage key={`post-image-${index}`} source={{ uri: item }} style={styles(theme).postImage} />
                </TouchableOpacity>
              );
            }}
            sliderWidth={PostDimensions.Large.width}
            itemWidth={PostDimensions.Large.width}
            layout="default"
            inactiveSlideScale={1}
            containerCustomStyle={[styles(theme).postImage, { marginTop: 25 }]}
            onSnapToItem={(slideIndex) => setMediaIndex(slideIndex)}
            hasParallaxImages={true}
          />
          <Pagination
            containerStyle={{ marginBottom: -40, marginTop: -20 }}
            dotsLength={mediasPath?.length ?? 0}
            activeDotIndex={mediaIndex}
            renderDots={(activeIndex) => {
              return mediasPath?.map((e, index) => (
                <View style={[styles(theme).dot, activeIndex === index ? styles(theme).activeDot : null]} />
              ));
            }}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
          />
          <LikeBounceAnimation ref={likeBounceAnimationRef} />
        </View>
        <View style={styles().likes}>
          <BounceView scale={1.5} onPress={() => likeInteractionHandler()}>
            <AntDesign name="heart" color={isLike ? ThemeStatic.like : ThemeStatic.unlike} size={IconSizes.x5} />
          </BounceView>
          <Text onPress={openLikes} style={styles(theme).likesText}>
            {totalLike}
          </Text>
        </View>
        <View style={styles(theme).captionText}>
          <TransformText username={creatorInfo?.name ?? ''} text={rawCaption ?? ''} />
        </View>
        <CommentList postId={postId} />
      </>
    );
  }

  let bottomSheets;

  if (!loading && data) {
    const { id, creatorInfo } = data;

    bottomSheets = (
      <>
        <PostOptionsBottomSheet
          ref={postOptionsBottomSheetRef}
          authorId={creatorInfo?.id ?? 0}
          postId={id}
          onPostEdit={onPostEdit}
          onPostDelete={onPostDelete}
        />
        {/* <EditPostBottomSheet ref={editPostBottomSheetRef} postId={id} caption={rawCaption ?? ''} /> */}
        <ConfirmationModal
          label="Delete"
          title="Delete post?"
          description={"Do you want to delete the current post? Post won't be recoverable later"}
          color={ThemeStatic.delete}
          isVisible={isConfirmModalVisible}
          toggle={confirmationToggle}
          onConfirm={() => onDeleteConfirm(id)}
        />
        <LikesBottomSheet ref={likesBottomSheetRef} postId={postId} onUserPress={navigateToProfile} />
      </>
    );
  }

  const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : undefined;

  return (
    <KeyboardAvoidingView behavior={keyboardBehavior} keyboardVerticalOffset={20} style={styles(theme).container}>
      <GoBackHeader iconSize={IconSizes.x7} />
      <ScrollView
        // @ts-ignore
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        style={styles().content}>
        {content}
      </ScrollView>
      <CommentInput postId={postId} scrollViewRef={scrollViewRef} />
      {bottomSheets}
    </KeyboardAvoidingView>
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
      paddingTop: 10,
      paddingHorizontal: 20,
    },
    postHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatarImage: {
      height: 50,
      width: 50,
      backgroundColor: theme.placeholder,
      borderRadius: 50,
      marginRight: 12,
    },
    handleText: {
      ...FontWeights.Regular,
      ...FontSizes.Body,
      color: theme.text01,
      marginRight: 4,
    },
    timeText: {
      ...FontWeights.Light,
      ...FontSizes.Caption,
      color: theme.text02,
      marginTop: 2,
    },
    postImage: {
      ...PostDimensions.Large,
      alignSelf: 'center',
      borderRadius: 10,
      backgroundColor: theme.placeholder,
    },
    likes: {
      flexDirection: 'row',
      marginTop: 20,
    },
    likesText: {
      ...FontWeights.Regular,
      ...FontSizes.Body,
      marginLeft: 10,
      color: theme.text01,
    },
    captionText: {
      ...FontWeights.Light,
      ...FontSizes.Body,
      color: theme.text01,
      marginTop: 10,
      marginBottom: 20,
      alignItems: 'flex-start',
      flexDirection: 'row',
    },
    dot: {
      backgroundColor: 'transparent',
      borderColor: ThemeStatic.accent,
      borderWidth: 1,
      width: 10,
      height: 10,
      borderRadius: 10,
      marginLeft: 3,
      marginRight: 3,
      marginTop: 3,
      marginBottom: 3,
    },
    activeDot: {
      backgroundColor: ThemeStatic.accent,
    },
  });

export default PostViewScreen;
