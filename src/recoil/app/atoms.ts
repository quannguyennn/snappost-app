import { atom } from 'recoil';
import type { GetNewFeedQueryResponse } from '../../graphql/queries/getNewFeed.generated';
import { AppAtoms } from '../app-atoms';

export const newFeedState = atom<GetNewFeedQueryResponse['getNewFeed']['items']>({
  key: AppAtoms.NEW_FEED,
  default: [],
});
