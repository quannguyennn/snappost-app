export const parseLikes = (likeCount: number) => {
  return likeCount < 1 ? `${likeCount} like` : `${likeCount} likes`;
};

export const createAsyncDelay = (duration: number) => {
  return new Promise((resolve, _) =>
    setTimeout(() => {
      resolve();
    }, duration),
  );
};
