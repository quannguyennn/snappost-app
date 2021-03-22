import React from 'react';
import { View, Text, StyleSheet, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../recoil/theme/atoms';
import { Typography } from '../../theme';
import { ThemeColors } from '../../types/theme';

const { FontWeights, FontSizes } = Typography;

interface ListEmptyComponentProps {
  listType?: string;
  spacing: number;
  style?: StyleProp<ViewStyle>;
  placeholder?: string;
  placeholderStyle?: StyleProp<TextStyle>;
  private?: boolean
}

const ListEmptyComponent: React.FC<ListEmptyComponentProps> = ({
  listType,
  spacing,
  style,
  placeholder,
  placeholderStyle,
  private = false
}) => {
  const theme = useRecoilValue(themeState);
  let content = private ? "This profile is private" : `No ${listType as string} yet`;
  if (placeholder) {
    content = placeholder;
  }

  return (
    <View style={[styles().container, { height: responsiveHeight(spacing) }, style]}>
      <Text style={[styles(theme).placeholderText, placeholderStyle]}>{content}</Text>
    </View>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 10,
    },
    placeholderText: {
      ...FontWeights.Light,
      ...FontSizes.Label,
      color: theme.text02,
    },
  });

export default ListEmptyComponent;
