import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import ListEmptyComponent from '../../../components/shared/ListEmptyComponent';
import { GetPostCommentQueryResponse, useGetPostCommentLazyQuery } from '../../../graphql/queries/getPostComment.generated';
import { showErrorNotification } from '../../../helpers/notifications';
import { Typography } from '../../../theme';
import type { ThemeColors } from '../../../types/theme';
import CommentCard from './CommentCard';

const { FontWeights, FontSizes } = Typography;

interface CommentsProps {
  postId: number;
}

const CommentList: React.FC<CommentsProps> = ({ postId }) => {
  const [init, setInit] = useState(true)
  const [comments, setComments] = useState<GetPostCommentQueryResponse["getPostComment"]["items"]>([])
  const [getPostComment, { data: fetchData, fetchMore }] = useGetPostCommentLazyQuery({
    onCompleted: (res) => {
      setComments([...res.getPostComment.items ?? []].reverse())
    },
    onError: (err) => {
      console.log("post comment", err);
      showErrorNotification("Can't fetch comments. Please try again.")
    },
    fetchPolicy: "cache-and-network"
  })

  const currentPage =
    Number(fetchData?.getPostComment?.meta.currentPage) >= 0 ? Number(fetchData?.getPostComment?.meta.currentPage) : 1;
  const totalPages =
    Number(fetchData?.getPostComment?.meta.totalPages) >= 0 ? Number(fetchData?.getPostComment?.meta.totalPages) : 2;

  useEffect(() => {
    getPostComment({
      variables: {
        postId, limit: 5, page: 1
      }
    })
    setInit(false)
  }, [postId])

  const loadMore = () => {
    if (Number(currentPage) < Number(totalPages)) {
      fetchMore &&
        fetchMore({
          variables: { limit: 5, page: currentPage + 1 },
          updateQuery: (prev: GetPostCommentQueryResponse, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return prev;
            }
            const prevItem = prev?.getPostComment?.items ? prev?.getPostComment?.items : [];
            const nextItem = fetchMoreResult.getPostComment?.items ? fetchMoreResult.getPostComment?.items : [];
            setComments([...nextItem, ...prevItem].reverse());
            return Object.assign({}, prev, {
              getPostComment: {
                items: [...prevItem, ...nextItem],
                meta: fetchMoreResult.getPostComment?.meta,
                __typename: 'CommentConnection',
              },
            });
          },
        });
    }
  };

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
      ListHeaderComponent={currentPage < totalPages && comments?.length ? <TouchableOpacity onPress={() => loadMore()} activeOpacity={0.9}><Text style={{ fontSize: 16, marginBottom: 5 }}>See ealier comments...</Text></TouchableOpacity> : null}
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
