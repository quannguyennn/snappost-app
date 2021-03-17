export type ConnectionsType = {
  FOLLOWING: string;
  FOLLOWERS: string;
};
export type NotificationTextType = {
  FOLLOW: string;
  COMMENT: string;
  LIKE: string;
};
export const NotificationType: NotificationTextType = {
  FOLLOW: 'FOLLOW',
  COMMENT: 'COMMENT',
  LIKE: 'LIKE'
};
export const NotificationText: NotificationTextType = {
  FOLLOW: 'has started following you',
  COMMENT: 'commented on your post',
  LIKE: 'liked your post'
};
export type PollIntervalsType = {
  messages: number;
  profile: number;
  profileView: number;
  postView: number;
  interaction: number;
  notification: number;
  lastSeen: number;
  blockList: number;
};

export type FollowInteractionType = {
  FOLLOW: string;
  UNFOLLOW: string;
};
export const FollowInteraction: FollowInteractionType = {
  FOLLOW: 'FOLLOW',
  UNFOLLOW: 'UNFOLLOW'
};