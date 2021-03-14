import React, { useState } from 'react';
import { Keyboard, Platform, StyleSheet, TextInput, View } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useRecoilValue } from 'recoil';
import IconButton from '../../../components/shared/Iconbutton';
import LoadingIndicator from '../../../components/shared/LoadingIndicator';
import NativeImage from '../../../components/shared/NativeImage';
import { inputLimitErrorNotification } from '../../../helpers/notifications';
import { createAsyncDelay } from '../../../helpers/utils';
import { themeState } from '../../../recoil/common/atoms';
import { Typography, ThemeStatic } from '../../../theme';
import { IconSizes } from '../../../theme/Icon';
import { ThemeColors } from '../../../types/theme';

const { FontWeights, FontSizes } = Typography;

interface CommentInputProps {
  postId: string;
  scrollViewRef: React.MutableRefObject<any>;
}

const CommentInput: React.FC<CommentInputProps> = ({ postId, scrollViewRef }) => {
  const theme = useRecoilValue(themeState);
  const [comment, setComment] = useState('');
  // const [addComment, { loading }] = useMutation(MUTATION_ADD_COMMENT);

  const postComment = async () => {
    if (comment.length < 1) {
      inputLimitErrorNotification('Comment', 'more', 1);
      return;
    }
    if (comment.length > 200) {
      inputLimitErrorNotification('Comment', 'less', 200);
      return;
    }

    // await addComment({ variables: { userId: user.id, postId, body: comment } });
    Keyboard.dismiss();
    setComment('');
    await createAsyncDelay(1200);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    scrollViewRef.current.scrollToEnd();
  };

  const Icon = () => <MaterialIcons name="done" size={IconSizes.x6} color={ThemeStatic.accent} />;

  let content = (
    <View style={styles().loading}>
      <LoadingIndicator color={ThemeStatic.accent} size={IconSizes.x00} />
    </View>
  );

  if (!false) {
    content = <IconButton Icon={Icon} onPress={postComment} style={styles().postButton} />;
  }

  return (
    <View style={styles().container}>
      <NativeImage uri="https://i.redd.it/eqkolvkcy2wy.jpg" style={styles(theme).commentAvatarImage} />
      <TextInput
        style={styles(theme).commentTextInput}
        value={comment}
        placeholder={'Add a comment as UserName...'}
        placeholderTextColor={theme.text02}
        onChangeText={setComment}
      />
      {content}
    </View>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 20,
      borderTopColor: ThemeStatic.translucent,
      borderTopWidth: StyleSheet.hairlineWidth,
      backgroundColor: theme.base,
      ...ifIphoneX(
        {
          paddingBottom: 32,
        },
        {},
      ),
    },
    commentAvatarImage: {
      height: 36,
      width: 36,
      backgroundColor: theme.placeholder,
      marginRight: 10,
      borderRadius: 50,
    },
    commentTextInput: {
      flex: 1,
      ...FontWeights.Light,
      ...FontSizes.Body,
      paddingVertical: Platform.select({ ios: 8, android: 6 }),
      paddingHorizontal: 20,
      backgroundColor: theme.placeholder,
      color: theme.text01,
      borderRadius: 20,
      marginVertical: 5,
    },
    loading: {
      marginLeft: 10,
    },
    postButton: {
      width: undefined,
      marginLeft: 10,
    },
  });

export default CommentInput;
