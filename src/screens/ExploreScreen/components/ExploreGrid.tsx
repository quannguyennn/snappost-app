import React from 'react';
import { StyleSheet, View, RefreshControl } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import { PrimaryImageGroup, SecondaryImageGroup } from './ExplorePostCard';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../../recoil/theme/atoms';
import type { ExplorePost } from '../../../types/utils';
import { parseGridImages } from '../../../utils/shared';
import LoadingIndicator from '../../../components/shared/LoadingIndicator';
import ListEmptyComponent from '../../../components/shared/ListEmptyComponent';

interface ExploreGridProps {
  posts: ExplorePost[];
  onRefresh: () => void;
  tintColor: string;
  onEndReached: () => void;
  refresh: boolean;
  loading?: boolean;
}

const ExploreGrid: React.FC<ExploreGridProps> = ({
  refresh,
  posts,
  onRefresh,
  tintColor,
  onEndReached,
  loading = false,
}) => {
  const theme = useRecoilValue(themeState);

  const renderItem = ({ item, index }: { item: ExplorePost[]; index: number }) => {
    const isSecondaryImageGroup = index % 3 === 2;

    if (isSecondaryImageGroup) {
      const reversed = index % 2 === 1;

      return <SecondaryImageGroup reversed={reversed} imageGroup={item} />;
    }

    return <PrimaryImageGroup imageGroup={item} />;
  };

  const refreshControl = () => <RefreshControl tintColor={tintColor} refreshing={false} onRefresh={onRefresh} />;

  const ListFooterComponent = () => (
    <View style={styles.listLoader}>{loading ? <LoadingIndicator size={4} color={theme.text02} /> : null}</View>
  );

  const parsedGridImages = parseGridImages(posts);

  return (
    <View style={styles.container}>
      <FlatGrid
        refreshing={refresh}
        staticDimension={responsiveWidth(92)}
        refreshControl={refreshControl()}
        itemDimension={responsiveWidth(92)}
        showsVerticalScrollIndicator={false}
        data={parsedGridImages}
        ListEmptyComponent={() => <ListEmptyComponent placeholder="No posts found" spacing={60} />}
        spacing={5}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        ListFooterComponent={ListFooterComponent}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listLoader: {
    marginBottom: 10,
  },
});

export default ExploreGrid;
