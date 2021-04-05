import { atom } from 'recoil';
import type { GetNewFeedQueryResponse } from '../../graphql/queries/getNewFeed.generated';
import type { MyPostQueryResponse } from '../../graphql/queries/myPost.generated';
import { AppRoutes } from '../../navigator/app-routes';
import { AppAtoms } from '../app-atoms';

export const newFeedState = atom<GetNewFeedQueryResponse['getNewFeed']['items']>({
  key: AppAtoms.NEW_FEED,
  default: [],
});

export const myPostState = atom<MyPostQueryResponse['myPost']['items']>({
  key: AppAtoms.My_POST,
  default: [],
});

export const countNotificationState = atom<number>({
  key: AppAtoms.CountNotification,
  default: 0,
});

export const countMessageState = atom<number[]>({
  key: AppAtoms.CountMessage,
  default: [],
});

export const notificationNavigateState = atom<{ screen?: AppRoutes; params?: any }>({
  key: AppAtoms.NotificationNavigate,
  default: {},
});

export const currentChatState = atom<number>({
  key: AppAtoms.CurrentChat,
  default: 0,
});
