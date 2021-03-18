import React from 'react';
import { StyleSheet } from 'react-native';
import { TextField } from 'rn-material-ui-textfield';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../../recoil/theme/atoms';
import { Typography } from '../../../theme';
import type { ThemeColors } from '../../../types/theme';

const { FontWeights, FontSizes } = Typography;

interface FormInputProps {
  ref: React.Ref<any>;
  label: string;
  placeholder: string;
  value: string;
  onChangeText: any;
  multiline?: boolean;
  characterRestriction?: number;
  children?: any;
  error?: string;
  onBlur?: () => void
}

const FormInput: React.FC<FormInputProps> = React.forwardRef(
  ({ label, placeholder, value, onChangeText, children, multiline, characterRestriction, error, onBlur }, ref) => {
    const theme = useRecoilValue(themeState);
    return (
      <TextField
        ref={ref}
        error={error}
        autoCapitalize="none"
        tintColor={theme.accent}
        baseColor={theme.accent}
        fontSize={FontSizes.Body.fontSize}
        labelFontSize={FontSizes.Body.fontSize}
        labelTextStyle={styles().labelTextStyle}
        style={styles(theme).textStyle}
        lineWidth={0}
        activeLineWidth={0}
        label={label}
        placeholder={placeholder}
        placeholderTextColor={theme.text02}
        onBlur={onBlur}
        onChangeText={onChangeText}
        value={value}
        multiline={multiline || false}
        characterRestriction={characterRestriction}
        renderRightAccessory={() => children}
      />
    );
  },
);

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    labelTextStyle: {
      ...FontWeights.Regular,
    },
    textStyle: {
      ...FontWeights.Light,
      color: theme.text01,
    },
  });

export default FormInput;
