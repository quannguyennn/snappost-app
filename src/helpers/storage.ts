import AsyncStorageFactory from '@react-native-community/async-storage';
import LegacyStorage from '@react-native-community/async-storage-backend-legacy';

const legacyStorage = new LegacyStorage();

export type StorageModel = {
  accessToken: string;
  refreshToken: string;
  theme: string;
};

export const storage = AsyncStorageFactory.create<StorageModel>(legacyStorage, {
  errorHandler: false,
  logger: false,
});

type SaveTokenInput = {
  accessToken: string;
  refreshToken: string;
};
export const saveToken = async (data: SaveTokenInput) => {
  return Promise.all([storage.set('accessToken', data.accessToken), storage.set('refreshToken', data.refreshToken)]);
};

export const removeToken = async () => {
  return storage.removeMultiple(['accessToken', 'refreshToken']);
};

export const loadThemeType = () => {
  return storage.get('theme');
};

export const saveThemeType = (themeType: string) => {
  return storage.set('theme', themeType);
};
