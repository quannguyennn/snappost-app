import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../../../recoil/theme/atoms';
import { Typography } from '../../../../theme';
import type { ThemeColors } from '../../../../types/theme';

const { FontWeights, FontSizes } = Typography;

interface HeaderProps {
  title: string;
  IconRight?: React.FC;
}

const Header: React.FC<HeaderProps> = ({ title, IconRight }) => {
  const theme = useRecoilValue(themeState);
  return (
    <View style={styles(theme).container}>
      <Text style={styles(theme).title}>{title}</Text>
      {IconRight && <IconRight />}
    </View>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    title: {
      ...FontWeights.Bold,
      ...FontSizes.Heading,
      color: theme.text01,
    },
  });

export default Header;
