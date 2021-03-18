import React, { useContext, useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AppContext } from '../../../context';
import LoadingIndicator from '../../../components/shared/LoadingIndicator';
import { IconSizes } from '../../../theme/Icon';
import { HandleAvailableColor, ThemeStatic } from '../../../theme';
import BottomSheetHeader from '../../../components/shared/layout/headers/BottomSheetHeader';
import FormInput from '../../../components/shared/controls/FormInput';
import Button from '../../../components/shared/controls/Button';
import type { ThemeColors } from '../../../types/theme';
import { cos } from 'react-native-reanimated';
import { useIsAvailableLazyQuery } from '../../../graphql/queries/isAvailable.generated';

interface EditProfileBottomSheetProps {
  ref: React.Ref<any>;
  avatar: string;
  name: string;
  nickname: string;
  about: string;
}

const EditProfileBottomSheet: React.FC<EditProfileBottomSheetProps> = React.forwardRef(
  ({ avatar, name, nickname, about }, ref) => {
    const { user, updateUser: updateUserContext, theme } = useContext(AppContext);

    const [editableAvatar, setEditableAvatar] = useState(avatar);
    const [editableName, setEditableName] = useState(name);
    const [editableNickname, setEditableNickname] = useState(nickname);
    const [handleError, setHandleError] = useState('');
    const [editableAbout, setEditableAbout] = useState(about);
    const [isUploading, setIsUploading] = useState(false);

    // useEffect(() => {
    //   setEditableAvatar(avatar);
    //   setEditableName(name);
    //   setEditableNickname(nickname);
    //   setEditableAbout(about);
    // }, []);

    const [queryIsAvalable, {
      loading: isHandleAvailableLoading,
      called: isHandleAvailableCalled,
      data: isHandleAvailableData
    }] = useIsAvailableLazyQuery({
      onCompleted: (res) => console.log(res),
      onError: (err) => console.log(err)
    })

    const checkAvailable = () => {
      queryIsAvalable({
        variables: {
          nickname
        }
      })
    }

     useEffect(() => {
   
      // const { isHandleAvailable } : any = isHandleAvailableData;
      if (!isHandleAvailableData?.isAvailable) {
        setHandleError('Nickname not available');
      } else {
        if (!editableNickname) setHandleError('Nickname cannot be empty')
        else setHandleError('');
      
    }
  }, [editableNickname, isHandleAvailableData?.isAvailable]);

  
    const onAvatarPick = async () => {
      //@ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const { path } = await getImageFromLibrary(120, 120, true);
      setEditableAvatar(path);
    };

    const setHandle = (nickname: string) => {
      if (!nickname) {
        setHandleError('username cannot be empty');
      }
      setEditableNickname(nickname);
    };

    // let content = (
    //   <View>
    //     <LoadingIndicator size={IconSizes.x00} color={ThemeStatic.accent} />
    //   </View>
    // );

    // if (!isHandleAvailableLoading && isHandleAvailableCalled) {
    //   content = (
    //     <MaterialIcons
    //       //@ts-ignore
    //       name={isHandleAvailableData?.isHandleAvailable ? 'done' : 'close'}
    //       //@ts-ignore
    //       color={HandleAvailableColor[isHandleAvailableData?.isHandleAvailable]}
    //       size={IconSizes.x6}
    //     />
    //   );
    // }

    const Icon = () => <MaterialIcons name="done" color={ThemeStatic.white} size={IconSizes.x5} />;

    return (
      <Modalize
        //@ts-ignore
        ref={ref}
        scrollViewProps={{ showsVerticalScrollIndicator: false }}
        modalStyle={styles(theme).container}
        adjustToContentHeight>
        <BottomSheetHeader heading="Edit profile" subHeading="Edit your personal information" />
        <View style={styles().content}>
          <ImageBackground
            source={{ uri: editableAvatar ? editableAvatar : '' }}
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
            value={editableNickname}
            onChangeText={setHandle}
            onBlur={checkAvailable}
            >
            {/* {content} */}
          </FormInput>
          <FormInput
            ref={null}
            label="About"
            placeholder="example: hey, I am a doggo"
            value={editableAbout}
            onChangeText={setEditableAbout}
            multiline
            characterRestriction={200}
          />
          <Button
            // Icon={Icon}
            label="Done"
            // onDone
            onPress={() => null}
            loading={isUploading}
            containerStyle={styles().doneButton}
          />
        </View>
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
