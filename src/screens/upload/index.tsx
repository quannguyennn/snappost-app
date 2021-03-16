import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  PermissionsAndroid,
  Image,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  View,
  Text,
  Platform,
} from 'react-native';
import { useRecoilValue } from 'recoil';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import CameraRoll, { PhotoIdentifier } from '@react-native-community/cameraroll';
import Video from 'react-native-video';
import GoBackHeader from '../../components/shared/layout/headers/GoBackHeader';
import { AppRoutes } from '../../navigator/app-routes';
import { themeState } from '../../recoil/theme/atoms';
import { Typography, ThemeStatic } from '../../theme';
import { IconSizes } from '../../theme/Icon';
import type { ThemeColors } from '../../types/theme';
import { LIMIT_MEDIA } from '../../utils/constants';
import { convertToNormalVideoUri } from '../../utils/shared';

const { FontSizes } = Typography;

export type SelectedMedia = {
  index: number;
  metadata: PhotoIdentifier;
};

const UploadScreen: React.FC = () => {
  const isFocused = useIsFocused();
  const theme = useRecoilValue(themeState);
  const { navigate } = useNavigation();

  const [, setLoading] = useState(false);
  const [medias, setMedias] = useState<PhotoIdentifier[]>([]);
  const [selectedMedias, setSelectedMedias] = useState<SelectedMedia[]>([]);
  const [lastIndex, setLastIndex] = useState(0);
  const [selectable, setSelectable] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSelectable(true);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  async function hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }

  useEffect(() => {
    const getMedia = async () => {
      setLoading(true);
      if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
        return;
      }
      CameraRoll.getPhotos({ first: page * 50, assetType: 'Photos' }).then((res) => {
        setMedias(res.edges);
        setLoading(false);
      });
    };
    getMedia();
  }, [isFocused, page]);

  const getSelectedIndex = (index: number): number => {
    return selectedMedias.findIndex((el) => el.index === index);
  };

  const handleSelectMedia = (index: number, metadata: PhotoIdentifier) => {
    const realIndex = getSelectedIndex(index);
    if (realIndex === -1) {
      if (selectedMedias.length === LIMIT_MEDIA) {
        return;
      }
      setSelectedMedias([...selectedMedias, { index, metadata }]);
      setLastIndex(index);
    } else {
      const temp = [...selectedMedias];
      temp.splice(realIndex, 1);
      setSelectedMedias(temp);
    }
  };

  const renderBigMedia = () => {
    if (!medias.length) {
      return <View />;
    }
    const mediaToshow = selectedMedias.length ? selectedMedias[selectedMedias.length - 1].metadata : medias[lastIndex];
    if (mediaToshow.node.type === 'image') {
      return (
        <Image
          style={[styles(theme).bigMedia, { resizeMode: 'contain' }]}
          source={{ uri: mediaToshow.node.image.uri }}
        />
      );
    } else {
      return (
        <Video
          key={convertToNormalVideoUri(mediaToshow)}
          muted
          source={{
            uri: convertToNormalVideoUri(mediaToshow),
          }}
          style={styles(theme).bigMedia}
        />
      );
    }
  };

  // const openCamera = (type: 'photo' | 'video') => {
  //   ImagePicker.openCamera({
  //     cropping: true,
  //     mediaType: type,
  //     avoidEmptySpaceAroundImage: true,
  //     freeStyleCropEnabled: true,
  //     enableRotationGesture: true,
  //     compressImageQuality: 1,
  //     compressVideoPreset: 'HighestQuality',
  //   })
  //     .then((media) => {
  //       console.log(111, media, 111);
  //       navigate(AppRoutes.FILTER_SCREEN, {
  //         medias: [
  //           {
  //             index: -2,
  //             metadata: {
  //               node: {
  //                 type,
  //                 timestamp: moment().valueOf(),
  //                 group_name: 'camera',
  //                 image: {
  //                   filename: media.filename,
  //                   uri: media.path,
  //                   height: media.height,
  //                   width: media.width,
  //                   fileSize: media.size,
  //                   //@ts-ignore
  //                   playableDuration: media?.duration ?? null,
  //                 },
  //               },
  //             },
  //           },
  //         ],
  //         onCamera: true,
  //       });
  //     })
  //     .catch((err) => console.log(err));
  // };

  return (
    <SafeAreaView style={styles(theme).container}>
      <GoBackHeader
        iconSize={IconSizes.x7}
        title="Upload"
        IconRight={() => (
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
            disabled={!selectedMedias.length}
            onPress={() => {
              navigate(AppRoutes.FILTER_SCREEN, { medias: selectedMedias });
            }}>
            <Text style={{ color: ThemeStatic.accent, ...FontSizes.Label }}>Next</Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles(theme).selectedMediaContainer}>{renderBigMedia()}</View>

      {/* <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 20, marginVertical: 8 }}>
        <Pressable onPress={() => openCamera('photo')} style={styles(theme).cameraBtn}>
          <Feather name="camera" size={20} color={ThemeStatic.white} />
        </Pressable>
        <Pressable onPress={() => openCamera('video')} style={styles(theme).cameraBtn}>
          <Feather name="video" size={20} color={ThemeStatic.white} />
        </Pressable>
      </View> */}

      <FlatList
        data={medias}
        style={{ flex: 1 }}
        contentContainerStyle={styles(theme).content}
        keyExtractor={(item, index) => index.toString() + 'image list'}
        numColumns={3}
        horizontal={false}
        onEndReachedThreshold={0.3}
        onEndReached={() => setPage(page + 1)}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[styles(theme).image]}
            onPress={() => (selectable ? handleSelectMedia(index, item) : null)}>
            <Image source={{ uri: item.node.image.uri }} style={{ height: '100%', width: '100%' }} />
            {item.node.type !== 'image' ? (
              <Text style={styles(theme).durationText}>{Math.round(item.node.image.playableDuration ?? 0)}s</Text>
            ) : null}
            <View style={[styles(theme).tickContainer, getSelectedIndex(index) !== -1 && styles(theme).selectedTick]}>
              {getSelectedIndex(index) !== -1 ? (
                <Text style={styles(theme).indexText}>{getSelectedIndex(index) + 1}</Text>
              ) : (
                <View style={{ height: IconSizes.x5, width: IconSizes.x5 }} />
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.base,
    },
    content: {
      paddingHorizontal: 20,
    },
    selectedMediaContainer: {
      flex: 1.2,
      aspectRatio: 1,
      justifyContent: 'center',
      marginBottom: 10,
    },
    image: {
      width: '32%',
      marginBottom: 8,
      marginRight: 8,
      borderRadius: 20,
      height: 100,
    },
    tickContainer: {
      right: 3,
      top: 3,
      position: 'absolute',
      borderRadius: 10,
      borderColor: ThemeStatic.white,
      borderWidth: 1,
      width: 18,
      height: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    selectedTick: {
      backgroundColor: theme.accent,
      borderWidth: 0,
    },
    indexText: {
      color: ThemeStatic.white,
    },
    durationText: {
      color: ThemeStatic.white,
      position: 'absolute',
      bottom: 0,
      right: 0,
    },
    bigMedia: {
      flex: 1,
    },
    cameraBtn: {
      padding: 12,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.placeholder,
      marginLeft: 10,
    },
  });

export default UploadScreen;
