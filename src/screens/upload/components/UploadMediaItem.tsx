import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import type { SelectedMedia } from '..';
import useDimensions from '../../../hooks/useDimension';
import { convertToNormalVideoUri } from '../../../utils/shared';

type UploadMediaItemProps = {
  media: SelectedMedia;
  onClick: () => void;
  fromCamera: boolean;
};

const UploadMediaItem: React.FC<UploadMediaItemProps> = React.memo(({ media, onClick, fromCamera = false }) => {
  const styles = useStyle();
  const { windowWidth } = useDimensions();

  const openFilter = () => {
    onClick();
  };

  if (media.metadata.node.type === 'video') {
    return (
      <Video
        key={convertToNormalVideoUri(media.metadata)}
        muted
        source={{
          uri: fromCamera ? media.metadata.node.image.uri : convertToNormalVideoUri(media.metadata),
        }}
        style={{ width: windowWidth - 50, aspectRatio: 1 }}
      />
    );
  } else {
    return (
      <TouchableOpacity style={styles.container} onPress={openFilter}>
        <Image source={{ uri: media.metadata.node.image.uri }} style={{ width: windowWidth - 50, aspectRatio: 1 }} />
      </TouchableOpacity>
    );
  }
});

const useStyle = () =>
  StyleSheet.create({
    container: {
      flex: 0.6,
      height: 500,
      marginRight: 20,
    },
  });

export default UploadMediaItem;
