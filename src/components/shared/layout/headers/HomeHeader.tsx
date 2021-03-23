import moment from 'moment';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../../../recoil/theme/atoms';
import { Typography } from '../../../../theme';
import type { ThemeColors } from '../../../../types/theme';

const { FontWeights, FontSizes } = Typography;

interface HomeHeaderProps {
  IconRight?: React.FC;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ IconRight }) => {
  const theme = useRecoilValue(themeState);
  const weekdayNow = moment(new Date()).format('dddd');
  return (
    <View style={styles(theme).container}>
      <View>
        <Text style={styles(theme).topTitle}>SNAPPOST</Text>
        <Text style={styles(theme).title}>{weekdayNow}</Text>
      </View>
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
    topTitle: {
      ...FontWeights.Light,
      ...FontSizes.Caption,
      color: theme.text02,
      letterSpacing: 4,
    },
    title: {
      ...FontWeights.Light,
      ...FontSizes.Heading,
      marginTop: Platform.select({ ios: 2, android: 0 }),
      color: theme.text01,
    },
  });

export default HomeHeader;
