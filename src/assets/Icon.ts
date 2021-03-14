import { createIconSetFromFontello, createIconSetFromIcoMoon } from 'react-native-vector-icons';
import fontData from './config.json';
import iconMoonFont from './selection.json';

export const Icon = createIconSetFromFontello(fontData);
export const IconMoon = createIconSetFromIcoMoon(iconMoonFont);
