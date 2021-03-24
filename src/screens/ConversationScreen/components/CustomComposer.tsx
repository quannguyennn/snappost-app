import React from 'react';
import { StyleSheet } from 'react-native';
import { Composer } from 'react-native-gifted-chat';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../../recoil/theme/atoms';
import { Typography } from '../../../theme';
import type { ThemeColors } from '../../../types/theme';

const { FontWeights, FontSizes } = Typography;

const CustomComposer: React.FC = (composerProps) => {
  const theme = useRecoilValue(themeState);
  return <Composer {...composerProps} multiline textInputStyle={styles(theme).inputStyle} />;
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    inputStyle: {
      ...FontWeights.Light,
      ...FontSizes.Body,
      color: theme.text01,
      paddingTop: 10,
      paddingLeft: 10,
    },
  });

export default CustomComposer;
