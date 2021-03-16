import { responsiveWidth } from 'react-native-responsive-dimensions';
import type { PostDimensionsType } from '../types/theme';
import { Theme, ThemeStatic, ThemeVariant, MaterialColors, HandleAvailableColor, OnlineDotColor } from './Colors';
import Typography from './Typography';

const PostDimensions: PostDimensionsType = {
  Small: { height: responsiveWidth(29), width: responsiveWidth(29) },
  Medium: { height: responsiveWidth(43), width: responsiveWidth(43) },
  Large: { height: responsiveWidth(90), width: responsiveWidth(90) },
};

export {
  Theme,
  ThemeStatic,
  ThemeVariant,
  MaterialColors,
  HandleAvailableColor,
  OnlineDotColor,
  Typography,
  PostDimensions,
};
