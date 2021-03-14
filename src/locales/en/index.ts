import flatten from 'flat';
import translation from './translation.json';
import nav from './nav.json';
import input from './input.json';
import label from './label.json';

export default {
  translation: flatten<Record<string, any>, typeof translation>(translation, {
    delimiter: '_',
  }),

  nav: flatten<Record<string, any>, typeof nav>(nav, {
    delimiter: '_',
  }),
  input: flatten<Record<string, any>, typeof input>(input, {
    delimiter: '_',
  }),

  label: flatten<Record<string, any>, typeof label>(label, {
    delimiter: '_',
  }),
};
