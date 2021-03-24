import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import NativeImage from '../../../components/shared/NativeImage';

const ChatHeaderAvatar = ({ avatar, onPress }: any) => (
  <TouchableOpacity style={styles.container} activeOpacity={0.9} onPress={onPress}>
    <NativeImage uri={avatar} style={styles.avatarImage} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    height: 36,
    width: 36,
    overflow: 'hidden',
    marginHorizontal: 10,
    borderRadius: 20,
  },
  avatarImage: {
    flex: 1,
  },
});

export default ChatHeaderAvatar;
