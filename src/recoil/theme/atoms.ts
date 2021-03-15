import { atom } from 'recoil';
import { Theme } from '../../theme';
import type { ThemeColors } from '../../types/theme';
import { AppAtoms } from '../app-atoms';

export const themeState = atom<ThemeColors>({
  key: AppAtoms.Theme,
  default: Theme.dark.colors,
});

export const themeTypeState = atom<string>({
  key: AppAtoms.ThemeType,
  default: Theme.dark.type,
});
