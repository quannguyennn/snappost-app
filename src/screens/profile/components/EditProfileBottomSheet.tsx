import React, { useEffect, useState } from 'react';
import { ImageBackground, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LoadingIndicator from '../../../components/shared/LoadingIndicator';
import { IconSizes } from '../../../theme/Icon';
import { HandleAvailableColor, ThemeStatic } from '../../../theme';
import BottomSheetHeader from '../../../components/shared/layout/headers/BottomSheetHeader';
import FormInput from '../../../components/shared/controls/FormInput';
import type { ThemeColors } from '../../../types/theme';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../../recoil/theme/atoms';
import { useIsAvailableLazyQuery } from '../../../graphql/queries/isAvailable.generated';
import { getImageFromLibrary } from '../../../utils/shared';
import {
  inputLimitErrorNotification,
  showErrorNotification,
  somethingWentWrongErrorNotification,
  tryAgainLaterNotification,
  uploadErrorNotification,
} from '../../../helpers/notifications';
import { useUpdateUserInfoMutation } from '../../../graphql/mutations/updateUserInfo.generated';
import { useFileUpload } from '../../../hooks/useFileUpload';
import type { Image } from 'react-native-image-crop-picker';
import { MeDocument } from '../../../graphql/queries/me.generated';
import Button from '../../../components/shared/controls/Button';

interface EditProfileBottomSheetProps {
  ref: React.Ref<any>;
  avatar: string;
  name: string;
  nickname: string;
  about: string;
  onUpdate: () => void;
}

const EditProfileBottomSheet: React.FC<EditProfileBottomSheetProps> = React.forwardRef(
  ({ avatar, name, nickname, about, onUpdate }, ref) => {
    const theme = useRecoilValue(themeState);
    const user = useCurrentUser();
    const [upload] = useFileUpload();

    const [selectedImage, setSelectedImage] = useState<Image>({} as Image);
    const [editAvatar, setEditAvatar] = useState('');
    const [editableName, setEditableName] = useState('');
    const [editNickname, setEditNickname] = useState('');
    const [avatarId, setAvatarId] = useState(0);
    const [handleError, setHandleError] = useState('');
    const [intro, setIntro] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const [
      queryIsHandleAvailable,
      { loading: isHandleAvailableLoading, called: isHandleAvailableCalled, data: isHandleAvailableData },
    ] = useIsAvailableLazyQuery({
      onError: (err) => {
        console.log('isAvai', err);
      },
    });

    const [updateUser] = useUpdateUserInfoMutation({
      onError: (err) => {
        console.log('update user', err);
        tryAgainLaterNotification();
      },
      onCompleted: () => {
        setIsUploading(false);
        onUpdate();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        setSelectedImage({} as Image);
        ref.current.close();
      },
      update: async (proxy, { data, errors }) => {
        if (data?.updateUserInfo) {
          const user = data?.updateUserInfo;
          proxy.writeQuery({
            query: MeDocument,
            data: {
              me: user,
            },
          });
          if (errors) {
            return;
          }
        }
      },
    });

    useEffect(() => {
      setEditAvatar(avatar);
      setEditableName(name);
      setEditNickname(nickname);
      setIntro(about);
      setAvatarId(user?.avatar ?? 0);
    }, [about, avatar, name, nickname, user]);

    useEffect(() => {
      queryIsHandleAvailable({
        variables: {
          nickname: editNickname,
        },
      });
    }, [editNickname, queryIsHandleAvailable]);

    useEffect(() => {
      if (!isHandleAvailableLoading && isHandleAvailableCalled) {
        const isHandleAvailable = isHandleAvailableData?.isAvailable;
        if (!isHandleAvailable && editNickname !== nickname) {
          setHandleError('Nickname not available');
        } else {
          if (!editNickname) {
            setHandleError('Nickname cannot be empty');
          } else {
            setHandleError('');
          }
        }
      }
    }, [editNickname, isHandleAvailableLoading, isHandleAvailableCalled, isHandleAvailableData, nickname]);

    const onAvatarPick = async () => {
      const image = await getImageFromLibrary(120, 120, true);
      setSelectedImage(image ?? ({} as Image));
      setEditAvatar(image?.path ?? '');
    };

    const onDone = async () => {
      const isHandleAvailable = isHandleAvailableData?.isAvailable;

      if (!editableName.trim().length) {
        showErrorNotification('Name cannot be empty');
        return;
      }
      if (intro.trim().length > 200) {
        inputLimitErrorNotification('About', 'less', 200);
        return;
      }
      if (!isHandleAvailable && editNickname !== nickname) {
        showErrorNotification('Nickname is not available');
        return;
      }
      if (!editNickname) {
        showErrorNotification('Nickname cannot be empty');
        return;
      }
      if (editNickname.split(' ').length > 1) {
        showErrorNotification('Nickname cannot contain blank spaces');
        return;
      }

      const avatarChanged = avatar !== editAvatar;

      try {
        setIsUploading(true);

        const updatedProfileData = {
          name: editableName.trim(),
          nickname: editNickname.trim(),
          intro: intro.trim(),
          avatar: avatarId,
        };

        if (avatarChanged) {
          const uploadRes = await upload({
            uri: selectedImage.path,
            type: selectedImage.mime,
            name: selectedImage.filename ?? 'name',
            height: selectedImage.height ?? 0,
            width: selectedImage.width ?? 0,
          });
          updatedProfileData.avatar = uploadRes.id;
        }

        updateUser({
          variables: {
            input: {
              ...updatedProfileData,
            },
          },
        });
      } catch ({ message }) {
        if (avatarChanged) {
          uploadErrorNotification('Avatar');
        } else {
          somethingWentWrongErrorNotification();
        }
        setIsUploading(false);
      }
    };

    const setNickname = (handle: string) => {
      if (!handle) {
        setHandleError('Nickname cannot be empty');
      }
      setEditNickname(handle);
    };

    let content = (
      <View>
        <LoadingIndicator size={IconSizes.x00} color={theme.accent} />
      </View>
    );

    if (!isHandleAvailableLoading && isHandleAvailableCalled) {
      content = (
        <MaterialIcons
          name={
            (!isHandleAvailableData?.isAvailable && editNickname !== nickname) || editNickname.trim() === ''
              ? 'close'
              : 'done'
          }
          color={
            (!isHandleAvailableData?.isAvailable && editNickname !== nickname) || editNickname.trim() === ''
              ? HandleAvailableColor.false
              : HandleAvailableColor.true
          }
          size={IconSizes.x6}
        />
      );
    }

    return (
      <Modalize
        //@ts-ignore
        ref={ref}
        scrollViewProps={{ showsVerticalScrollIndicator: false }}
        modalStyle={styles(theme).container}
        adjustToContentHeight>
        <BottomSheetHeader heading="Edit profile" subHeading="Edit your personal information" />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles(theme).content}>
          <ImageBackground
            source={{ uri: editAvatar ? editAvatar : '' }}
            style={styles(theme).avatar}
            imageStyle={styles(theme).avatarImage}>
            <TouchableOpacity activeOpacity={0.9} onPress={onAvatarPick} style={styles(theme).avatarOverlay}>
              <MaterialIcons name="edit" size={IconSizes.x6} color={ThemeStatic.white} />
            </TouchableOpacity>
          </ImageBackground>

          <FormInput
            ref={null}
            label="Name"
            placeholder="example: Doggo"
            value={editableName}
            onChangeText={setEditableName}
          />
          <FormInput
            ref={null}
            label="Nickname"
            placeholder="example: doggo"
            error={handleError}
            value={editNickname}
            onChangeText={setNickname}>
            {content}
          </FormInput>
          <FormInput
            ref={null}
            label="About"
            placeholder="example: hey, I am a doggo"
            value={intro}
            onChangeText={setIntro}
            multiline
            characterRestriction={200}
          />
          <Button
            label="Done"
            onPress={() => onDone()}
            loading={isUploading}
            containerStyle={styles(theme).doneButton}
          />
        </KeyboardAvoidingView>
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
    },
    avatar: {
      alignSelf: 'center',
      height: 100,
      width: 100,
      marginTop: 20,
    },
    avatarImage: {
      backgroundColor: theme.placeholder,
      borderRadius: 100,
    },
    avatarOverlay: {
      position: 'absolute',
      height: 100,
      width: 100,
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      backgroundColor: theme.accent,
      opacity: 0.8,
    },
    doneButton: {
      marginVertical: 20,
    },
  });

export default EditProfileBottomSheet;
