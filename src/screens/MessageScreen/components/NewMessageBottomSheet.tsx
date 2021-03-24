import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { FlatGrid } from 'react-native-super-grid';
import ConnectionsPlaceholder from '../../../components/placeholders/Connection.Placeholder';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../../recoil/theme/atoms';
import SvgBanner from '../../../components/shared/SvgBanner';
import { Images } from '../../../assets1/icons';
import UserCard from '../../../components/UserCard';
import BottomSheetHeader from '../../../components/shared/layout/headers/BottomSheetHeader';
import type { ThemeColors } from '../../../types/theme';

interface NewMessageBottomSheetProps {
  ref: React.Ref<any>;
  onConnectionSelect: (targetId: number, avatar: string, handle: string) => void;
}

const NewMessageBottomSheet: React.FC<NewMessageBottomSheetProps> = React.forwardRef(({ onConnectionSelect }, ref) => {
  const user = useCurrentUser();
  const theme = useRecoilValue(themeState);
  // const { data, loading, error } = useQuery(QUERY_USER_CONNECTIONS, {
  //   variables: { userId: user.id, type: Connections.FOLLOWING },
  //   fetchPolicy: 'network-only'
  // });

  let content = <ConnectionsPlaceholder />;

  const ListEmptyComponent = () => (
    <SvgBanner Svg={Images.emptyConnection} placeholder={"You're not following anyone"} spacing={16} />
  );

  const renderItem = ({ item }) => {
    const { id, avatar, nickname, name } = item;
    return (
      <UserCard
        userId={id}
        avatar={avatar}
        nickname={nickname}
        name={name}
        onPress={() => onConnectionSelect(id, avatar, nickname)}
      />
    );
  };

  //!loading && !error
  if (true) {
    const { userConnections } = data;
    content = (
      <FlatGrid
        bounces={false}
        itemDimension={responsiveWidth(85)}
        showsVerticalScrollIndicator={false}
        items={userConnections}
        itemContainerStyle={styles().listItemContainer}
        contentContainerStyle={styles().listContentContainer}
        ListEmptyComponent={ListEmptyComponent}
        style={styles().listContainer}
        spacing={20}
        renderItem={renderItem}
      />
    );
  }

  return (
    <Modalize
      //@ts-ignore
      ref={ref}
      scrollViewProps={{ showsVerticalScrollIndicator: false }}
      modalStyle={styles(theme).container}>
      <BottomSheetHeader heading={"Let's talk"} subHeading="Connect with your friends" />
      <View style={styles(theme).content}>{content}</View>
    </Modalize>
  );
});

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      marginTop: 40,
      padding: 20,
      backgroundColor: theme.base,
    },
    content: {
      flex: 1,
      paddingBottom: responsiveHeight(5),
    },
    listContainer: {
      flex: 1,
    },
    listItemContainer: {
      width: '106%',
    },
    listContentContainer: {
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
  });

export default NewMessageBottomSheet;
