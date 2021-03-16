import React from 'react';
import { StyleSheet, Text, FlatList } from 'react-native';
import { useRecoilValue } from 'recoil';
import ListEmptyComponent from '../../../components/shared/ListEmptyComponent';
import { themeState } from '../../../recoil/theme/atoms';
import { Typography } from '../../../theme';
import type { ThemeColors } from '../../../types/theme';
import CommentCard from './CommentCard';

const { FontWeights, FontSizes } = Typography;

interface CommentsProps {
  postId: number;
  comments: any[];
}

const Comments: React.FC<CommentsProps> = ({ postId, comments }) => {
  const theme = useRecoilValue(themeState);

  comments = [
    {
      postId: '1',
      commentId: '1',
      author: {
        id: '1',
        avatar: 'https://i.redd.it/eqkolvkcy2wy.jpg',
        handle: 'user 1',
      },
      body: 'comment ne',
      time: '2020-09-17 08:34:40.221711',
    },
    {
      postId: '1',
      commentId: '1',
      author: {
        id: '1',
        avatar: 'https://i.redd.it/eqkolvkcy2wy.jpg',
        handle: 'user 1',
      },
      body: 'comment ne',
      time: '2020-09-17 08:34:40.221711',
    },
    {
      postId: '1',
      commentId: '1',
      author: {
        id: '1',
        avatar: 'https://i.redd.it/eqkolvkcy2wy.jpg',
        handle: 'user 1',
      },
      body: 'comment ne',
      time: '2020-09-17 08:34:40.221711',
    },
    {
      postId: '1',
      commentId: '1',
      author: {
        id: '1',
        avatar: 'https://i.redd.it/eqkolvkcy2wy.jpg',
        handle: 'user 1',
      },
      body: 'comment ne',
      time: '2020-09-17 08:34:40.221711',
    },
    {
      postId: '1',
      commentId: '1',
      author: {
        id: '1',
        avatar: 'https://i.redd.it/eqkolvkcy2wy.jpg',
        handle: 'user 1',
      },
      body: 'comment ne',
      time: '2020-09-17 08:34:40.221711',
    },
  ];

  const renderItem = ({ item }: any) => {
    const {
      id: commentId,
      author: { id: authorId, avatar, handle },
      body,
      createdAt,
    } = item;

    return (
      <CommentCard
        postId={postId}
        commentId={commentId}
        authorId={authorId}
        avatar={avatar}
        handle={handle}
        body={body}
        time={createdAt}
      />
    );
  };

  const marginBottom = comments && comments.length === 0 ? 0 : 20;

  return (
    <FlatList
      bounces={false}
      showsVerticalScrollIndicator={false}
      data={comments}
      renderItem={renderItem}
      style={styles().listStyle}
      ListEmptyComponent={() => (
        <ListEmptyComponent
          placeholder="Be the first one to comment"
          placeholderStyle={styles().placeholderStyle}
          spacing={10}
        />
      )}
    />
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    commentsHeader: {
      ...FontWeights.Regular,
      ...FontSizes.Body,
      color: theme.text01,
    },
    listStyle: {
      marginBottom: 10,
    },
    placeholderStyle: {
      ...FontSizes.Body,
    },
  });

export default Comments;
