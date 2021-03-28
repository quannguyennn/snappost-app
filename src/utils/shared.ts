import ImagePicker, { Options } from 'react-native-image-crop-picker';
import { noPermissionNotification } from '../helpers/notifications';
import { ThemeStatic } from '../theme';
import type { PhotoIdentifier } from '@react-native-community/cameraroll';
import type { ExplorePost } from '../types/utils';
import { Timeouts } from './constants';
import { MediaType, Message } from '../graphql/type.interface';
import type { IMessage } from 'react-native-gifted-chat';
import moment from 'moment';

export const getImageFromLibrary = async (height: number, width: number, circular: boolean = false) => {
  const options: Options = {
    height,
    width,
    cropperCircleOverlay: circular,
    cropping: true,
    cropperActiveWidgetColor: ThemeStatic.accent,
    cropperStatusBarColor: ThemeStatic.accent,
    cropperToolbarColor: ThemeStatic.accent,
    compressImageQuality: 1,
    mediaType: 'photo',
    writeTempFile: true,
    multiple: false,
  };

  try {
    const assetData = await ImagePicker.openPicker(options);
    return assetData;
  } catch ({ code }) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    if (!code.includes('CANCELLED')) {
      noPermissionNotification();
    }
  }
};

export const parseConnectionsCount = (connectionCount: number) => {
  // parse larger numbers here
  return connectionCount.toString();
};
export const parseTimeElapsed = (utcTime: string) => {
  const timeNow = new Date().getTime();
  const actionTime = new Date(utcTime).getTime();

  let difference = timeNow - actionTime;

  const secondsInMs = 1000;
  const minutesInMs = secondsInMs * 60;
  const hoursInMs = minutesInMs * 60;
  const daysInMs = hoursInMs * 24;
  const weekInMs = daysInMs * 7;

  const elapsedWeeks = parseInt((difference / weekInMs) as any, 10);
  difference = difference % weekInMs;

  const elapsedDays = parseInt((difference / daysInMs) as any, 10);
  difference = difference % daysInMs;

  const elapsedHours = parseInt((difference / hoursInMs) as any, 10);
  difference = difference % hoursInMs;

  const elapsedMinutes = parseInt((difference / minutesInMs) as any, 10);
  difference = difference % minutesInMs;

  let parsedTime = '...';

  if (elapsedWeeks >= 1) {
    if (elapsedWeeks === 1) {
      parsedTime = `${elapsedWeeks} week`;
    } else {
      parsedTime = `${elapsedWeeks} weeks`;
    }
  } else if (elapsedDays >= 1) {
    if (elapsedDays === 1) {
      parsedTime = `${elapsedDays} day`;
    } else {
      parsedTime = `${elapsedDays} days`;
    }
  } else if (elapsedHours >= 1) {
    if (elapsedHours === 1) {
      parsedTime = `${elapsedHours} hr`;
    } else {
      parsedTime = `${elapsedHours} hrs`;
    }
  } else if (elapsedMinutes >= 1) {
    if (elapsedMinutes === 1) {
      parsedTime = `${elapsedMinutes} min`;
    } else {
      parsedTime = `${elapsedMinutes} mins`;
    }
  } else if (elapsedMinutes < 1) {
    parsedTime = 'just now';
  }

  const readableTime = parsedTime === 'just now' ? `${parsedTime}` : `${parsedTime} ago`;

  return {
    parsedTime,
    readableTime,
  };
};
export const convertToNormalVideoUri = (media: PhotoIdentifier): string => {
  const appleId = media.node.image.uri.substring(5, 41);
  const fileNameLength = (media?.node?.image?.filename ?? '').length;
  const ext = (media.node.image.filename ?? '').substring(fileNameLength - 3);
  return `assets-library://asset/asset.${ext}?id=${appleId}&ext=${ext}`;
};

export const isUserOnline = (lastSeen: number) => {
  return moment().subtract(Timeouts.online, "seconds").isBefore(moment(lastSeen));
};

export const filterChatParticipants = (userId: number, participants: any[]) =>
  participants.filter((participant) => userId !== participant.id);

export const sortPostsAscendingTime = (array: any) =>
  // @ts-ignore
  [...array].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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

export const transformMessages = (messages: Message[] | any) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  messages.map((message: Message) => {
    const {
      id,
      content,
      createdAt,
      senderInfo: { id: authorId, name, avatarFilePath },
      media,
      mediaType,
      sent,
      received
    } = message;

    const convertMessage: IMessage = {
      _id: id,
      text: content ?? "",
      createdAt,
      sent,
      received,
      user: {
        _id: authorId,
        name,
        avatar: avatarFilePath ?? '',
      },
    };
    if (media) {
      if (mediaType === MediaType.IMAGE) {
        convertMessage.image = media;
      } else {
        convertMessage.video = media;
      }
    }
    return convertMessage;
  });
