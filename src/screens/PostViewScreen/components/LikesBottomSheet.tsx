import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { FlatGrid } from 'react-native-super-grid';
import { useRecoilValue } from 'recoil';
import { Images } from '../../../assets1/icons';
import ConnectionsPlaceholder from '../../../components/placeholders/Connection.Placeholder';
import ImageBanner from '../../../components/shared/ImageBanner';
import BottomSheetHeader from '../../../components/shared/layout/headers/BottomSheetHeader';
import UserCard from '../../../components/UserCard';
import { themeState } from '../../../recoil/common/atoms';
import { ThemeColors } from '../../../types/theme';

interface LikesBottomSheetProps {
  ref: React.Ref<any>;
  likes: string[];
  onUserPress: (userId: string) => void;
}

const LikesBottomSheet: React.FC<LikesBottomSheetProps> = React.forwardRef(({ likes, onUserPress }, ref) => {
  const theme = useRecoilValue(themeState);

  // const { data, loading, error } = useQuery(QUERY_LIKE_USERS, {
  //   variables: { likes },
  //   fetchPolicy: 'network-only',
  // });

  let content = <ConnectionsPlaceholder />;

  const ListEmptyComponent = () => <ImageBanner img={Images.emptyLike} placeholder="No likes yet" spacing={16} />;

  const renderItem = ({ item }: any) => {
    const { id, avatar, handle, name } = item;
    return <UserCard userId={id} avatar={avatar} handle={handle} name={name} onPress={() => onUserPress(id)} />;
  };

  if (true) {
    const likeUsers = [
      {
        userId: '1',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZCQk1_Y-Y_cmK36Dt6LwTn9SNf3o2pYamnw&usqp=CAU',
        handle: 'Quan',
      },
      {
        userId: '2',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZCQk1_Y-Y_cmK36Dt6LwTn9SNf3o2pYamnw&usqp=CAU',
        handle: 'Quan',
      },
      {
        userId: '3',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZCQk1_Y-Y_cmK36Dt6LwTn9SNf3o2pYamnw&usqp=CAU',
        handle: 'Quan',
      },
      {
        userId: '4',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZCQk1_Y-Y_cmK36Dt6LwTn9SNf3o2pYamnw&usqp=CAU',
        handle: 'Quan',
      },
    ];

    content = (
      <FlatGrid
        bounces={false}
        itemDimension={responsiveWidth(85)}
        showsVerticalScrollIndicator={false}
        data={likeUsers}
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
      <BottomSheetHeader heading="Likes" subHeading="Users who liked this post" />
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

export default LikesBottomSheet;
