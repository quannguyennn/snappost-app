import React from 'react';
import { Shine, ShineOverlay } from 'rn-placeholder';
import { useRecoilValue } from 'recoil';
import { themeTypeState } from '../../recoil/theme/atoms';
import { ThemeVariant } from '../../theme';

const AnimationBackground = {
  light: '#DFDFDF',
  dark: '#242424',
};

const PlaceholderAnimation = (props: any) => {
  const themeType = useRecoilValue(themeTypeState);
  const backgroundColor = AnimationBackground[themeType];

  if (themeType === ThemeVariant.light) {
    return <ShineOverlay {...props} />;
  }

  return <Shine {...props} style={{ backgroundColor }} />;
};

export default PlaceholderAnimation;
