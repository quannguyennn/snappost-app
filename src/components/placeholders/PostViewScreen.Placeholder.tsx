import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRecoilValue } from 'recoil';
import { Placeholder, PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';
import { themeState } from '../../recoil/theme/atoms';
import { PostDimensions } from '../../theme';
import PlaceholderAnimation from './PlaceholderAnimation';

const PostViewScreenPlaceholder = () => {
  const theme = useRecoilValue(themeState);

  return (
    <View style={styles.container}>
      <Placeholder Animation={PlaceholderAnimation}>
        <View style={styles.postHeader}>
          <PlaceholderMedia color={theme.placeholder} size={50} isRound />
          <View style={styles.author}>
            <PlaceholderLine noMargin color={theme.placeholder} width={60} style={styles.handlePlaceholder} />
            <PlaceholderLine noMargin color={theme.placeholder} width={30} style={styles.timePlaceholder} />
          </View>
        </View>
        <PlaceholderLine noMargin color={theme.placeholder} height={PostDimensions.Large.height} style={styles.card} />
        <PlaceholderLine noMargin color={theme.placeholder} width={25} style={styles.likesPlaceholder} />
        <PlaceholderLine noMargin color={theme.placeholder} width={90} style={styles.captionPlaceholder} />
        <PlaceholderLine noMargin color={theme.placeholder} width={90} style={styles.captionPlaceholder} />
      </Placeholder>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingTop: 2,
  },
  postHeader: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  author: {
    flex: 1,
    justifyContent: 'center',
  },
  handlePlaceholder: {
    marginLeft: 12,
    borderRadius: 10,
  },
  timePlaceholder: {
    marginTop: 10,
    marginLeft: 12,
    borderRadius: 10,
  },
  card: {
    marginTop: 25,
    borderRadius: 10,
  },
  likesPlaceholder: {
    marginTop: 20,
    marginBottom: 5,
    borderRadius: 10,
  },
  captionPlaceholder: {
    marginTop: 8,
    borderRadius: 10,
  },
});

export default PostViewScreenPlaceholder;
