import React, { useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import ConnectionsPlaceholder from '../../../components/placeholders/Connection.Placeholder';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../../recoil/theme/atoms';
import SvgBanner from '../../../components/shared/SvgBanner';
import { Images } from '../../../assets1/icons';
import UserCard from '../../../components/UserCard';
import BottomSheetHeader from '../../../components/shared/layout/headers/BottomSheetHeader';
import type { ThemeColors } from '../../../types/theme';
import { useGetFollowingUserLazyQuery } from '../../../graphql/queries/getFollowingUser.generated';
import { useIsFocused } from '@react-navigation/core';
import { isUserOnline } from '../../../utils/shared';

interface NewMessageBottomSheetProps {
  ref: React.Ref<any>;
  onConnectionSelect: (targetId: number, avatar: string, handle: string) => void;
}

const NewMessageBottomSheet: React.FC<NewMessageBottomSheetProps> = React.forwardRef(({ onConnectionSelect }, ref) => {
  const user = useCurrentUser();
  const isFocus = useIsFocused();
  const theme = useRecoilValue(themeState);

  const [getFollowing, { data: fetchData, loading, error }] = useGetFollowingUserLazyQuery({
    fetchPolicy: 'cache-and-network',
  });

  const data = fetchData?.getFollowingUser;

  useEffect(() => {
    if (isFocus) {
      getFollowing();
    }
  }, [getFollowing, isFocus]);

  let content = <ConnectionsPlaceholder />;

  const ListEmptyComponent = () => (
    <SvgBanner Svg={Images.emptyConnection} placeholder={"You're not following anyone"} spacing={16} />
  );

  const renderItem = ({ item }) => {
    const { id, avatarFilePath, nickname, name, lastSeen } = item;

    const isOnline = isUserOnline(lastSeen);

    return (
      <UserCard
        userId={id}
        avatar={avatarFilePath}
        nickname={nickname}
        name={name}
        isChat
        isOnline={isOnline}
        onPress={() => onConnectionSelect(id, avatarFilePath, nickname)}
      />
    );
  };

  if (!loading && !error) {
    content = (
      <FlatList
        bounces={false}
        showsVerticalScrollIndicator={false}
        data={data}
        contentContainerStyle={styles().listContentContainer}
        ListEmptyComponent={ListEmptyComponent}
        style={styles().listContainer}
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
      marginTop: 20,
    },
  });

export default NewMessageBottomSheet;
