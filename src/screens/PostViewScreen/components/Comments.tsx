import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import ConnectionsPlaceholder from '../../../components/placeholders/Connection.Placeholder';
import ListEmptyComponent from '../../../components/shared/ListEmptyComponent';
import {
  GetPostCommentQueryResponse,
  useGetPostCommentLazyQuery,
} from '../../../graphql/queries/getPostComment.generated';
import { useOnCreateCommentSubscription } from '../../../graphql/subscriptions/onCreateComment.generated';
import { useOnDeleteCommentSubscription } from '../../../graphql/subscriptions/onDeleteComment.generated';
import { showErrorNotification } from '../../../helpers/notifications';
import { Typography } from '../../../theme';
import type { ThemeColors } from '../../../types/theme';
import CommentCard from './CommentCard';

const { FontWeights, FontSizes } = Typography;

interface CommentsProps {
  postId: number;
}

const CommentList: React.FC<CommentsProps> = ({ postId }) => {
  const [comments, setComments] = useState<GetPostCommentQueryResponse['getPostComment']['items']>([]);
  const [init, setInit] = useState(true);
  const [getPostComment, { data: fetchData, fetchMore, loading }] = useGetPostCommentLazyQuery({
    onCompleted: (res) => {
      setInit(false);
      setComments([...(res.getPostComment.items ?? [])].reverse());
    },
    onError: (err) => {
      console.log('post comment', err);
      showErrorNotification("Can't fetch comments. Please try again.");
    },
    fetchPolicy: 'cache-and-network',
  });

  const currentPage =
    Number(fetchData?.getPostComment?.meta.currentPage) >= 0 ? Number(fetchData?.getPostComment?.meta.currentPage) : 1;
  const totalPages =
    Number(fetchData?.getPostComment?.meta.totalPages) >= 0 ? Number(fetchData?.getPostComment?.meta.totalPages) : 2;

  useEffect(() => {
    getPostComment({
      variables: {
        postId,
        limit: 5,
        page: 1,
      },
    });
  }, [postId, getPostComment]);

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

  useOnCreateCommentSubscription({
    variables: { postId },
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData.error) {
        console.log('comment sub', subscriptionData.error);
      } else {
        // @ts-ignore
        setComments([...comments, subscriptionData.data?.onCreateComment]);
      }
    },
  });

  useOnDeleteCommentSubscription({
    variables: { postId },
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData.error) {
        console.log('delete comment sub', subscriptionData.error);
      } else {
        // @ts-ignore
        setComments([...comments].filter((item) => item.id !== subscriptionData.data?.onDeleteComment.id));
      }
    },
  });

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
        isBlock={creatorInfo.isBlockMe}
      />
    );
  };

  return (
    <>
      {loading && init ? <ConnectionsPlaceholder /> : null}
      <FlatList
        bounces={false}
        showsVerticalScrollIndicator={false}
        data={comments}
        renderItem={renderItem}
        style={styles().listStyle}
        ListHeaderComponent={
          !init && currentPage < totalPages ? (
            <TouchableOpacity onPress={() => loadMore()} activeOpacity={0.9}>
              <Text style={{ fontSize: 16, marginBottom: 5 }}>See ealier comments...</Text>
            </TouchableOpacity>
          ) : null
        }
        ListEmptyComponent={() =>
          !init ? (
            <ListEmptyComponent
              placeholder="Be the first one to comment"
              placeholderStyle={styles().placeholderStyle}
              spacing={10}
            />
          ) : null
        }
      />
    </>
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
