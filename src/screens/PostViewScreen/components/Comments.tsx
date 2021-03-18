import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { useRecoilValue } from 'recoil';
import ListEmptyComponent from '../../../components/shared/ListEmptyComponent';
import type { GetPostDetailQueryResponse } from '../../../graphql/queries/getPostDetail.generated';
import type { Comments } from '../../../graphql/type.interface';
import { themeState } from '../../../recoil/theme/atoms';
import { Typography } from '../../../theme';
import type { ThemeColors } from '../../../types/theme';
import CommentCard from './CommentCard';
import type * as Types from '../type.interface';

const { FontWeights, FontSizes } = Typography;

interface CommentsProps {
  postId: number;
  comments: GetPostDetailQueryResponse['getPostDetail']['postComments'];
}

const CommentList: React.FC<CommentsProps> = ({ postId, comments = [] }) => {
  const renderItem = ({ item }: { item: any }) => {
    const { id, creatorId, creatorInfo, content, createdAt } = item;

    return (
      <CommentCard
        postId={postId}
        commentId={id}
        authorId={creatorId}
        avatar={creatorInfo.avatarFilePath}
        handle={creatorInfo.name}
        body={content}
        time={createdAt}
      />
    );
  };

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

export default CommentList;
