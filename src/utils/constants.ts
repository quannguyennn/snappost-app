import type { DebounceType } from '../types/constant';
import type { ConnectionsType, PollIntervalsType } from '../types/constants';

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

export const PollIntervals: PollIntervalsType = {
  messages: 2 * 1000,
  profile: 1000,
  profileView: 1000,
  postView: 2 * 1000,
  interaction: 1000,
  notification: 2 * 1000,
  lastSeen: 10 * 1000,
  blockList: 1000,
};

export const Timeouts = {
  online: 30,
};
