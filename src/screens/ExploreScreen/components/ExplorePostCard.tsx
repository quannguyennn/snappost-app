import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { useRecoilValue } from 'recoil';
import NativeImage from '../../../components/shared/NativeImage';
import { AppRoutes } from '../../../navigator/app-routes';
import { themeState } from '../../../recoil/common/atoms';
import { PostDimensions } from '../../../theme';
import { ThemeColors } from '../../../types/theme';
import { ExplorePost } from '../../../types/utils';

interface ExplorePostCardProps {
  postId: string;
  uri: string;
  large?: boolean;
  style?: StyleProp<ViewStyle>;
}

const ExplorePostCard: React.FC<ExplorePostCardProps> = ({ postId, uri, large, style }): React.ReactElement => {
  const theme = useRecoilValue(themeState);
  const { navigate } = useNavigation();

  const navigateToPost = () => {
    navigate(AppRoutes.POST_VIEW_SCREEN, { postId });
  };

  const containerStyle = large ? { height: '100%', width: '100%' } : {};

  return (
    <TouchableOpacity onPress={navigateToPost} activeOpacity={0.95} style={[styles().container, style, containerStyle]}>
      <NativeImage uri={uri} style={styles(theme).postImage} />
    </TouchableOpacity>
  );
};

export const PrimaryImageGroup = ({ imageGroup }: { imageGroup: ExplorePost[] }): React.ReactElement => (
  <View style={styles().gridImageGroup}>
    {imageGroup.map(({ id: postId, uri }) => (
      <ExplorePostCard key={postId} postId={postId} uri={uri} />
    ))}
  </View>
);

type SecondaryImageGroupProps = {
  imageGroup: ExplorePost[];
  reversed: boolean;
};

export const SecondaryImageGroup: React.FC<SecondaryImageGroupProps> = ({
  imageGroup,
  reversed,
}): React.ReactElement => {
  const theme = useRecoilValue(themeState);

  const leftColumns = imageGroup.slice(0, 2);
  const rightColumn = imageGroup.slice(2, 3);

  const reverseDirection: ViewStyle = reversed ? { flexDirection: 'row-reverse' } : {};
  const reverseMargin: ViewStyle = reversed ? { alignItems: 'flex-end', marginLeft: 2 } : { marginRight: 2 };

  return (
    <View style={[styles(theme).gridImageGroup, reverseDirection]}>
      <View style={[styles(theme).secondaryLeftColumn, reverseMargin]}>
        {leftColumns.map(({ id: postId, uri }, index) => {
          const style = index ? { marginTop: 5 } : {};
          return <ExplorePostCard key={postId} postId={postId} uri={uri} style={style} />;
        })}
      </View>
      <View style={styles(theme).secondaryRightColumn}>
        {rightColumn.map(({ id: postId, uri }) => (
          <ExplorePostCard large key={postId} postId={postId} uri={uri} />
        ))}
      </View>
    </View>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      ...PostDimensions.Small,
      overflow: 'hidden',
      borderRadius: 4,
    },
    postImage: {
      flex: 1,
      backgroundColor: theme.placeholder,
    },
    gridImageGroup: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    secondaryLeftColumn: {
      flex: 1,
    },
    secondaryRightColumn: {
      flex: 2,
    },
  });

export default ExplorePostCard;
