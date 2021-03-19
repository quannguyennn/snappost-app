import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { useRecoilValue } from 'recoil';
import Option from '../../../components/shared/controls/Option';
import BottomSheetHeader from '../../../components/shared/layout/headers/BottomSheetHeader';
import { useReportPostMutation } from '../../../graphql/mutations/reportPost.generated';
import { postReportedNotification, somethingWentWrongErrorNotification } from '../../../helpers/notifications';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import { themeState } from '../../../recoil/theme/atoms';
import { ThemeStatic } from '../../../theme';
import type { ThemeColors } from '../../../types/theme';

interface PostOptionsBottomSheetProps {
  ref: React.Ref<any>;
  authorId: number;
  postId: number;
  onPostEdit: () => void;
  onPostDelete: () => void;
}

const PostOptionsBottomSheet: React.FC<PostOptionsBottomSheetProps> = React.forwardRef(
  ({ authorId, postId, onPostEdit, onPostDelete }, ref) => {
    const theme = useRecoilValue(themeState);
    const user = useCurrentUser();
    const [reportPost] = useReportPostMutation({
      onCompleted: () => {
        postReportedNotification();
      },
      onError: (err) => {
        console.log('report post', err);
        somethingWentWrongErrorNotification();
      },
    });

    const isOwnPost = authorId === user?.id ?? 0;

    const onPostReport = () => {
      reportPost({ variables: { postId } });
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      ref.current.close();
    };

    let subHeading = 'Tell us what you think';
    let content = <Option label="Report" iconName="ios-flag" color={ThemeStatic.delete} onPress={onPostReport} />;

    if (isOwnPost) {
      subHeading = 'Manage your post';
      content = (
        <>
          {/* <Option label="Edit" iconName="md-create" onPress={onPostEdit} /> */}
          <Option label="Delete" iconName="md-trash" color={ThemeStatic.delete} onPress={onPostDelete} />
        </>
      );
    }

    return (
      <Modalize
        //@ts-ignore
        ref={ref}
        scrollViewProps={{ showsVerticalScrollIndicator: false }}
        modalStyle={styles(theme).container}
        adjustToContentHeight>
        <BottomSheetHeader heading="Options" subHeading={subHeading} />
        <View style={styles().content}>{content}</View>
      </Modalize>
    );
  },
);

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: theme.base,
    },
    content: {
      flex: 1,
      paddingTop: 20,
      paddingBottom: 16,
    },
  });

export default PostOptionsBottomSheet;
