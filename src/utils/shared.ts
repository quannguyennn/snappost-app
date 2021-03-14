import ImagePicker, { Options } from 'react-native-image-crop-picker';

import { PhotoIdentifier } from '@react-native-community/cameraroll';
import { noPermissionNotification } from '../helpers/notifications';
import { ThemeStatic } from '../theme';
import { ExplorePost } from '../types/utils';

export const getImageFromLibrary = async (height: number, width: number, circular: boolean = false) => {
  const options: Options = {
    height,
    width,
    cropperCircleOverlay: circular,
    cropping: true,
    cropperActiveWidgetColor: ThemeStatic.accent,
    cropperStatusBarColor: ThemeStatic.accent,
    cropperToolbarColor: ThemeStatic.accent,
    compressImageQuality: 0.8,
    mediaType: 'photo',
    writeTempFile: true,
    multiple: true,
  };

  try {
    const assetData = await ImagePicker.openPicker(options);
    return assetData;
  } catch ({ code }) {
    if (!code.includes('CANCELLED')) {
      noPermissionNotification();
    }
  }
};

export const convertToNormalVideoUri = (media: PhotoIdentifier): string => {
  const appleId = media.node.image.uri.substring(5, 41);
  const fileNameLength = (media?.node?.image?.filename ?? '').length;
  const ext = (media.node.image.filename ?? '').substring(fileNameLength - 3);
  return `assets-library://asset/asset.${ext}?id=${appleId}&ext=${ext}`;
};

export const parseGridImages = (images: ExplorePost[]): ExplorePost[][] => {
  const parsedImages: ExplorePost[][] = [];

  for (let i = 0; i < images.length; i++) {
    let imageGroup: ExplorePost[];

    if (i % 3 === 0) {
      imageGroup = images.slice(i, i + 3);
      parsedImages.push(imageGroup);
    }
  }

  return parsedImages;
};
