import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { StackActions, useNavigation } from '@react-navigation/native';
import type { Dimensions, ThemeColors } from '../../types/theme';
import { AppRoutes } from '../../navigator/app-routes';
import NativeImage from './NativeImage';
import { AppContext } from '../../context';
import Foundation from 'react-native-vector-icons/Foundation';
import { ThemeStatic } from '../../theme/Colors';

interface PostThumbnailProps {
  id: string;
  uri: string;
  dimensions: Dimensions;
  nPost: number;
}

const PostThumbnail: React.FC<PostThumbnailProps> = ({ id, uri, dimensions, nPost }) => {
  const { theme } = useContext(AppContext);
  const { dispatch } = useNavigation();

  const navigateToPost = () => {
    dispatch(StackActions.push(AppRoutes.POST_VIEW_SCREEN, { postId: id }));
  };

  return (
    <TouchableOpacity
      onPress={navigateToPost}
      activeOpacity={0.95}
      style={[styles(theme).container, { ...dimensions }]}>
      <NativeImage uri={uri} style={styles().thumbnailImage} />
      {nPost > 1 ? (
        <Foundation
          name="page-multiple"
          color={ThemeStatic.white}
          style={{
            fontSize: 18,
            position: 'absolute',
            top: 5,
            right: 5,
          }}
        />
      ) : null}
    </TouchableOpacity>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.placeholder,
      overflow: 'hidden',
      borderRadius: 5,
    },
    thumbnailImage: {
      flex: 1,
    },
  });

export default PostThumbnail;
