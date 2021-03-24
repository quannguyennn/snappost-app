import React from 'react';
import { StyleSheet } from 'react-native';
import { Send } from 'react-native-gifted-chat';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ThemeStatic } from '../../../theme';
import { IconSizes } from '../../../theme/Icon';

const CustomSend: React.FC = (sendProps) => (
  <Send {...sendProps} containerStyle={styles.container}>
    <FontAwesome name="send" size={IconSizes.x5} color={ThemeStatic.accent} />
  </Send>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});

export default CustomSend;
