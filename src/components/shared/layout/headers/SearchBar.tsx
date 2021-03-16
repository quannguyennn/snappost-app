import React, { useContext } from 'react';
import { Platform, StyleSheet, TextInput } from 'react-native';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../../../recoil/theme/atoms';
import { Typography } from '../../../../theme';
import { ThemeColors } from '../../../../types/theme';
import { AppContext } from '../../../../context';

const { FontWeights, FontSizes } = Typography;

interface SearchBarProps {
  value: string;
  onChangeText: any;
  onFocus?: any;
  onBlur?: any;
  placeholder: string;
  style?: object;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, onFocus, onBlur, placeholder, style }) => {
  const theme = useRecoilValue(themeState);

  return (
    <TextInput
      onFocus={onFocus}
      onBlur={onBlur}
      style={[styles(theme).container, style]}
      value={value}
      placeholder={placeholder}
      placeholderTextColor={theme.text02}
      onChangeText={onChangeText}
    />
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      ...FontWeights.Light,
      ...FontSizes.Body,
      width: '90%',
      alignSelf: 'center',
      paddingVertical: Platform.select({ ios: 10, android: 5 }),
      paddingHorizontal: 20,
      backgroundColor: theme.placeholder,
      color: theme.text01,
      borderRadius: 20,
      marginVertical: 5,
    },
  });

export default SearchBar;
