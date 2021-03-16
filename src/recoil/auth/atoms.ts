import { atom } from 'recoil';
import { AppAtoms } from '../app-atoms';

export const isLoginState = atom<boolean>({
  key: AppAtoms.IsLogin,
  default: false,
});
