import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { parseLikes } from '../../../helpers/utils';
import { AppRoutes } from '../../../navigator/app-routes';
import { Typography, ThemeStatic, PostDimensions } from '../../../theme';
import { IconSizes } from '../../../theme/Icon';
import type { Maybe } from '../../../graphql/type.interface';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import FastImage from 'react-native-fast-image';

const { FontWeights, FontSizes } = Typography;

type Author = {
  id: number;
  avatar: string;
  name: string;
};

export interface PostCardProps {
  id: number;
  author: Author;
  time: string;
  uri: Maybe<string>[];
  likes: number;
  caption: string;
  isLike: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ id, author, time, uri, likes, caption, isLike }) => {
  const { navigate } = useNavigation();

  const [mediaIndex, setMediaIndex] = useState(0);

  const navigateToPost = () => navigate(AppRoutes.POST_VIEW_SCREEN, { postId: id });

  const readableTime = moment(time).fromNow();
  const readableLikes = parseLikes(likes);

  return (
    <TouchableOpacity onPress={navigateToPost} activeOpacity={0.9} style={styles.container}>
      <Carousel
        data={uri}
        renderItem={({ item, index }: { item: any; index: number }) => {
          return <FastImage key={`post-image-${index}`} source={{ uri: item }} style={styles.postImage} />;
        }}
        sliderWidth={PostDimensions.Large.width}
        itemWidth={PostDimensions.Large.width}
        layout="default"
        inactiveSlideScale={1}
        containerCustomStyle={styles.postImage}
        onSnapToItem={(slideIndex) => setMediaIndex(slideIndex)}
        hasParallaxImages={true}
        loop
      />
      <Pagination
        // containerStyle={styles.paginationContainer}
        dotsLength={uri.length}
        activeDotIndex={mediaIndex}
        renderDots={(activeIndex) => {
          return uri.map((e, index) => <View style={[styles.dot, activeIndex === index ? styles.activeDot : null]} />);
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />

      <View style={styles.upperContent}>
        <FastImage source={{ uri: author.avatar }} style={styles.avatarImage} />
        <View>
          <Text style={styles.handleText}>{author.name}</Text>
          <Text style={styles.timeText}>{readableTime}</Text>
        </View>
      </View>

      <View style={styles.lowerContent}>
        <View style={styles.likeContent}>
          <AntDesign name="heart" color={isLike ? ThemeStatic.like : ThemeStatic.unlike} size={IconSizes.x5} />
          <Text style={styles.likesText}>{readableLikes}</Text>
        </View>

        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.captionText}>
          {caption}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    ...PostDimensions.Large,
    alignSelf: 'center',
    justifyContent: 'space-between',
    backgroundColor: ThemeStatic.black,
    overflow: 'hidden',
    borderRadius: 10,
  },
  postImage: {
    position: 'absolute',
    ...PostDimensions.Large,
    backgroundColor: 'white',
  },
  avatarImage: {
    height: 44,
    width: 44,
    backgroundColor: ThemeStatic.placeholder,
    borderRadius: 45,
    marginRight: 10,
  },
  upperContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: ThemeStatic.translucent,
  },
  lowerContent: {
    justifyContent: 'center',
    padding: 16,
    backgroundColor: ThemeStatic.translucent,
  },
  likeContent: {
    flexDirection: 'row',
  },
  handleText: {
    ...FontWeights.Regular,
    ...FontSizes.Body,
    color: ThemeStatic.white,
  },
  timeText: {
    ...FontWeights.Light,
    ...FontSizes.Caption,
    color: ThemeStatic.white,
    marginTop: 2,
  },
  likesText: {
    ...FontWeights.Regular,
    ...FontSizes.Body,
    marginLeft: 8,
    color: ThemeStatic.white,
  },
  captionText: {
    ...FontWeights.Light,
    ...FontSizes.Body,
    color: ThemeStatic.white,
    marginTop: 5,
  },
  // paginationContainer: {
  //   position: 'absolute',
  // },
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

export default PostCard;
