import React, { useContext } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../recoil/theme/atoms';
import { Typography } from '../../theme';
import { ThemeColors } from '../../types/theme';

const { FontWeights, FontSizes } = Typography;

interface SvgBannerProps {
  Svg: any;
  placeholder: string;
  spacing?: number;
  textStyle?: StyleProp<TextStyle>;
}

const SvgBanner: React.FC<SvgBannerProps> = ({ Svg, placeholder, spacing, textStyle }) => {
  const theme = useRecoilValue(themeState);

  return (
    <View style={[styles().container, { marginTop: responsiveHeight(spacing ?? 0) || undefined }]}>
      {Svg}
      <Text style={[styles(theme).placeholderText, textStyle]}>{placeholder}</Text>
    </View>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 10,
    },
    placeholderText: {
      ...FontWeights.Light,
      ...FontSizes.Label,
      color: theme.text02,
      marginTop: 40,
    },
  });

export default SvgBanner;
