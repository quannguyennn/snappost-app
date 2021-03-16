import React from 'react';
import { Image, StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../recoil/theme/atoms';
import Typography from '../../theme/Typography';
import { ThemeColors } from '../../types/theme';

const { FontWeights, FontSizes } = Typography;

interface BannerProps {
  img: any;
  placeholder: string;
  spacing?: number;
  textStyle?: StyleProp<TextStyle>;
}

const ImageBanner: React.FC<BannerProps> = ({ img, placeholder, spacing = 0, textStyle }) => {
  const theme = useRecoilValue(themeState);

  return (
    <View style={[styles().container, { marginTop: responsiveHeight(spacing) || undefined }]}>
      <Image source={img} />
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

export default ImageBanner;
