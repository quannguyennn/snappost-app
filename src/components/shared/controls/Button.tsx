import React from 'react';
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle, TextStyle, Image } from 'react-native';
import { Typography, ThemeStatic } from '../../../theme';
import LoadingIndicator from '../LoadingIndicator';

const { FontWeights, FontSizes } = Typography;

interface ButtonProps {
  Icon?: any;
  IconComponent?: any;
  label: string;
  onPress: any;
  loading: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  indicatorColor?: string;

  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  Icon,
  IconComponent,
  label,
  onPress,
  loading,
  containerStyle,
  labelStyle,
  indicatorColor,
  disabled = false,
}) => {
  let content = <LoadingIndicator size={8} color={indicatorColor || ThemeStatic.white} />;
  if (!loading) {
    content = (
      <>
        {Icon && <Image source={Icon} style={{ height: 30, width: 30 }} />}
        {IconComponent && IconComponent}
        <Text style={[styles.label, labelStyle, disabled ? { color: ThemeStatic.placeholder } : {}]}>{label}</Text>
      </>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      disabled={disabled}
      style={[styles.container, containerStyle, disabled ? { backgroundColor: ThemeStatic.translucent } : {}]}>
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 40,
    backgroundColor: ThemeStatic.accent,
  },
  label: {
    ...FontWeights.Regular,
    ...FontSizes.Body,
    marginLeft: 5,
    color: ThemeStatic.white,
  },
});

export default Button;
