/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { AxiosRequestConfig } from 'axios';
import { useCallback } from 'react';
import { merge } from 'lodash';
import { UPLOAD_URL } from '../environment/env';
import { request } from '../helpers/request';
import { Platform } from 'react-native';
import { storage } from '../helpers/storage';
import type { Media } from '../graphql/type.interface';
import { uploadErrorNotification } from '..//helpers/notifications';

export const useFileUpload = (config?: AxiosRequestConfig) => {
  const upload = useCallback(
    (file: any, customConfig?: AxiosRequestConfig) => {
      return new Promise<Media>((resolve, reject) => {
        const formData = new FormData();

        const getFileName = file.uri.split('/');
        const imgName = getFileName[getFileName.length - 1] ?? 'name';

        const imageInfo = {
          uri: Platform.OS === 'android' ? file.uri : file.uri.replace('file://', ''),
          type: file.type ?? 'image/jpeg',
          name: file.fileName === null || file.fileName === undefined ? imgName : file.fileName,
          height: file.height ?? 0,
          width: file.width ?? 0,
        };

        formData.append('file', imageInfo);
        formData.append('height', file.height);
        formData.append('width', file.width);

        request
          .post(UPLOAD_URL ?? '', formData, {
            ...merge(config, customConfig, {
              headers: {
                ...merge(config?.headers, customConfig?.headers),
                'Content-Type': 'multipart/form-data',
                Authorizarion: storage.get('accessToken'),
              },
            }),
          })
          .then((res) => {
            if (res.status === 200 || res.status === 201) {
              return resolve(res.data);
            }
          })
          .catch((err) => {
            uploadErrorNotification('Media');
            return reject(err.message);
          });
      });
    },
    [config],
  );
  return [upload];
};
