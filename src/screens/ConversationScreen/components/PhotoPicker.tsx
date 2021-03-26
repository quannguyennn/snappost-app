import CameraRoll, { PhotoIdentifier } from '@react-native-community/cameraroll';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, PermissionsAndroid, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { useRecoilValue } from 'recoil';
import NativeImage from '../../../components/shared/NativeImage';
import { noPermissionNotification } from '../../../helpers/notifications';
import { themeState } from '../../../recoil/theme/atoms';
import type { ThemeColors } from '../../../types/theme';

export type PhotoPickerProps = {
  ref: React.Ref<Modalize>;
};

const PhotoPicker = React.forwardRef((ref) => {
  const theme = useRecoilValue(themeState);
  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(false);
  const [medias, setMedias] = useState<PhotoIdentifier[]>([]);
  const [page, setPage] = useState(1);

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
        noPermissionNotification();
        return;
      }
      CameraRoll.getPhotos({ first: page * 50, assetType: 'Photos' }).then((res) => {
        setMedias(res.edges);
        setLoading(false);
      });
    };
    getMedia();
  }, [isFocused, page]);

  return (
    <Modalize
      //@ts-ignore
      ref={ref}
      scrollViewProps={{ showsVerticalScrollIndicator: false }}
      modalStyle={styles(theme).container}>
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
          <TouchableOpacity style={[styles(theme).image]} onPress={() => {}}>
            <NativeImage uri={item.node.image.uri} style={{ height: '100%', width: '100%' }} />
          </TouchableOpacity>
        )}
      />
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
    image: {
      width: '32%',
      marginBottom: 8,
      marginRight: 8,
      borderRadius: 20,
      height: 100,
    },
  });

export default PhotoPicker;
