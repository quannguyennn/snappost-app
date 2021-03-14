import React from 'react';
import FastImage from 'react-native-fast-image';

interface NativeImageProps {
  uri: string;
  style: any;
}

const NativeImage: React.FC<NativeImageProps> = ({ uri, style }) => {
  return <FastImage style={style} source={{ uri }} resizeMode={FastImage.resizeMode.stretch} />;
};

export default NativeImage;
