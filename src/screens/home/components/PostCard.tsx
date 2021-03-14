import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import NativeImage from '../../../components/shared/NativeImage';
import { parseLikes } from '../../../helpers/utils';
import { AppRoutes } from '../../../navigator/app-routes';
import { Typography, ThemeStatic, PostDimensions } from '../../../theme';
import { IconSizes } from '../../../theme/Icon';

const { FontWeights, FontSizes } = Typography;

type Author = {
  id: string;
  avatar: string;
  handle: string;
};

export interface PostCardProps {
  id: string;
  author: Author;
  time: string;
  uri: string;
  likes: string[];
  caption: string;
}

const PostCard: React.FC<PostCardProps> = ({ id, author, time, uri, likes, caption }) => {
  const { navigate } = useNavigation();

  const navigateToPost = () => navigate(AppRoutes.POST_VIEW_SCREEN, { postId: id });

  const readableTime = moment(time).fromNow();
  const readableLikes = parseLikes(likes.length);
  const isLiked = Math.round(Math.random());

  return (
    <TouchableOpacity onPress={navigateToPost} activeOpacity={0.9} style={styles.container}>
      <NativeImage uri={uri} style={styles.postImage} />

      <View style={styles.upperContent}>
        <NativeImage uri={author.avatar} style={styles.avatarImage} />
        <View>
          <Text style={styles.handleText}>{author.handle}</Text>
          <Text style={styles.timeText}>{readableTime}</Text>
        </View>
      </View>

      <View style={styles.lowerContent}>
        <View style={styles.likeContent}>
          <AntDesign name="heart" color={isLiked === 0 ? ThemeStatic.like : ThemeStatic.unlike} size={IconSizes.x5} />
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
});

export default PostCard;
