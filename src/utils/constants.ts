import { DebounceType } from '../types/constant';
import { ConnectionsType } from '../types/constants';

export const LIMIT_MEDIA = 5;
export const Debounce: DebounceType = {
  EXPLORE_SEARCH: 400,
};
export type Connection = {
  id: string;
  avatar: string;
  name: string;
  handle: string;
};

export const Connections: ConnectionsType = {
  FOLLOWING: 'FOLLOWING',
  FOLLOWERS: 'FOLLOWERS',
};
