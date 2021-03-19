import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { FlatGrid } from 'react-native-super-grid';
import ListEmptyComponent from '../../../components/shared/ListEmptyComponent';
import UserCard from '../../../components/UserCard';
import type { SearchUserQueryResponse } from '../../../graphql/queries/searchUser.generated';

interface UserSearchResultsProps {
  searchResults: SearchUserQueryResponse['searchUser']['items'];
  onUserRefresh: () => void;
  onUserEndReached: () => void;
  refresh: boolean;
}

const UserSearchResults: React.FC<UserSearchResultsProps> = ({
  searchResults,
  refresh,
  onUserRefresh,
  onUserEndReached,
}) => {
  const renderItem = ({ item }: { item: any }) => {
    const { id, nickname, name, avatarFilePath } = item;
    return <UserCard userId={id} avatar={avatarFilePath} nickname={nickname} name={name} />;
  };

  return (
    <FlatGrid
      itemDimension={responsiveWidth(85)}
      showsVerticalScrollIndicator={false}
      data={searchResults}
      ListEmptyComponent={() => <ListEmptyComponent placeholder="No users found" spacing={60} />}
      style={styles.container}
      spacing={20}
      renderItem={renderItem}
      refreshing={refresh}
      onEndReached={onUserEndReached}
      onRefresh={onUserRefresh}
      onEndReachedThreshold={0.3}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: responsiveWidth(100),
  },
});

export default UserSearchResults;
