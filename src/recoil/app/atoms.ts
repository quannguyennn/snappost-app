import { atom } from 'recoil';
import type { GetNewFeedQueryResponse } from '../../graphql/queries/getNewFeed.generated';
import type { MyPostQueryResponse } from '../../graphql/queries/myPost.generated';
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
