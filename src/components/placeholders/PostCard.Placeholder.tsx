import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRecoilValue } from 'recoil';
import { Placeholder, PlaceholderLine } from 'rn-placeholder';
import { themeState } from '../../recoil/theme/atoms';
import { PostDimensions } from '../../theme';
import PlaceholderAnimation from './PlaceholderAnimation';

const PostCardPlaceholder = () => {
  const theme = useRecoilValue(themeState);

  return (
    <View style={styles.container}>
      <Placeholder Animation={PlaceholderAnimation}>
        {new Array(4).fill({}).map((_, index) => (
          <PlaceholderLine
            noMargin
            color={theme.placeholder}
            key={index}
            height={PostDimensions.Large.height}
            style={styles.card}
          />
        ))}
      </Placeholder>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 2,
    paddingHorizontal: 20,
  },
  card: {
    marginTop: 20,
    borderRadius: 10,
  },
});

export default PostCardPlaceholder;
