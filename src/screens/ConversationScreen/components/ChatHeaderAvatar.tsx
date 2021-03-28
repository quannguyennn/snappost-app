import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import NativeImage from '../../../components/shared/NativeImage';
import { OnlineDotColor } from '../../../theme';

const ChatHeaderAvatar = ({ avatar, onPress, isOnline = false }: any) => {
  const onlineDotColor = OnlineDotColor[isOnline as any];
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.9} onPress={onPress}>
      <NativeImage uri={avatar ?? ''} style={styles.avatarImage} />
      <View style={[styles.onlineDot, { backgroundColor: onlineDotColor }]} />
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
  container: {
    height: 36,
    width: 36,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  avatarImage: {
    flex: 1,
    borderRadius: 20,
  },
  onlineDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    bottom: 2.5,
    right: 2.5,
    borderRadius: 10,
  },
});

export default ChatHeaderAvatar;
