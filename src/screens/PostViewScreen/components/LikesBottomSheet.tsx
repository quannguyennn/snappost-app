import React from 'react';
import { useState } from 'react';
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
import {
  GetUserLikePostQueryResponse,
  useGetUserLikePostQuery,
} from '../../../graphql/queries/getUserLikePost.generated';
import { useOnLikePostSubscription } from '../../../graphql/subscriptions/onLikePost.generated';
import { useOnUnLikePostSubscription } from '../../../graphql/subscriptions/onUnLikePost.generated';
import { themeState } from '../../../recoil/theme/atoms';
import type { ThemeColors } from '../../../types/theme';

interface LikesBottomSheetProps {
  ref: React.Ref<any>;
  postId: number;
  onUserPress: (userId: number) => void;
}

const LikesBottomSheet: React.FC<LikesBottomSheetProps> = React.forwardRef(({ postId, onUserPress }, ref) => {
  const theme = useRecoilValue(themeState);

  const [users, setUsers] = useState<GetUserLikePostQueryResponse['getUserLikePost']>([]);

  const { loading, error } = useGetUserLikePostQuery({
    variables: { postId },
    fetchPolicy: 'network-only',
    onCompleted: (res) => setUsers(res.getUserLikePost),
  });

  let content = <ConnectionsPlaceholder />;

  const ListEmptyComponent = () => <ImageBanner img={Images.emptyLike} placeholder="No likes yet" spacing={16} />;

  const renderItem = ({ item }: any) => {
    const { id, avatarFilePath, nickname, name } = item;
    return (
      <UserCard userId={id} avatar={avatarFilePath} nickname={nickname} name={name} onPress={() => onUserPress(id)} />
    );
  };

  useOnLikePostSubscription({
    variables: { postId },
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData.error) {
        console.log('like post sub', subscriptionData.error);
      } else {
        // @ts-ignore
        setUsers([subscriptionData.data?.onLikePost.creatorInfo, ...users]);
      }
    },
  });

  useOnUnLikePostSubscription({
    variables: { postId },
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData.error) {
        console.log('unlike post sub', subscriptionData.error);
      } else {
        // @ts-ignore
        // const temp = [...user];
        setUsers([...users].filter((item) => item.id !== subscriptionData.data?.onUnLikePost.userId));
      }
    },
  });

  if (!loading && !error) {
    content = (
      <FlatGrid
        bounces={false}
        itemDimension={responsiveWidth(85)}
        showsVerticalScrollIndicator={false}
        data={users}
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
