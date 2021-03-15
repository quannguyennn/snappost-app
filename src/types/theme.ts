import type { StatusBarStyle } from 'react-native';

export type ThemeStaticType = {
  accent: string;
  white: string;
  black: string;
  text01: string;
  text02: string;
  placeholder: string;
  like: string;
  unlike: string;
  translucent: string;
  delete: string;
  badge: string;
};

export type ThemeColors = {
  accent: string;
  base: string;
  text01: string;
  text02: string;
  placeholder: string;
  white: string;
  shadow: string;
};

export type ThemeVariantType = {
  light: string;
  dark: string;
};

export type ThemeType = {
  type: string;
  colors: ThemeColors;
};

export type HandleAvailableColorType = {
  true: string;
  false: string;
};

export type OnlineDotColorType = {
  true: string;
  false: string;
};

export type DynamicStatusBarType = {
  [key: string]: {
    barStyle: StatusBarStyle;
    backgroundColor: string;
  };
};

export type IconSizesType = {
  x00: number;
  x0: number;
  x1: number;
  x2: number;
  x3: number;
  x4: number;
  x5: number;
  x6: number;
  x7: number;
  x8: number;
  x9: number;
  x10: number;
  x11: number;
  x12: number;
};

export type Dimensions = {
  height: number;
  width: number;
};

export type PostDimensionsType = {
  Small: Dimensions;
  Medium: Dimensions;
  Large: Dimensions;
};
