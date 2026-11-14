// Tomorro-inspired neo-botanical design system tokens from mobile_app/design.md.

import { Platform } from 'react-native';

export const COLORS = {
  forestDepths: '#102D3A',
  mossShadow: '#224556',
  lichenSage: '#788C92',
  paleFern: '#BDCFD1',
  electricSprout: '#89E3CA',
  deepVerdant: '#087563',
  sproutWash: '#DDF3ED',
  mistGreen: '#CFDEDF',
  onyxOlive: '#203742',
  onyxOliveGlass: 'rgba(32, 55, 66, 0.94)',
  pureWhite: '#ffffff',
  boneWhite: '#F3F7F7',
  softMist: '#dcdfe3',
  coolStone: '#d6d6d6',
  carbon: '#222222',
};

export const FONTS = {
  display: Platform.select({ ios: 'System', android: 'sans-serif-condensed', default: 'System' }),
  ui: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }),
  serif: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' }),
};

export const TYPE = {
  caption: { fontSize: 12, lineHeight: 18, letterSpacing: -0.04, fontWeight: '400' },
  body: { fontSize: 14, lineHeight: 21, letterSpacing: -0.04, fontWeight: '400' },
  bodyMd: { fontSize: 16, lineHeight: 24, letterSpacing: -0.3, fontWeight: '400' },
  subheading: { fontSize: 18, lineHeight: 27, letterSpacing: -0.35, fontWeight: '400' },
  headingSm: { fontSize: 20, lineHeight: 28, letterSpacing: -0.3, fontWeight: '600' },
  heading: { fontSize: 24, lineHeight: 32, letterSpacing: -0.36, fontWeight: '700' },
  headingLg: { fontSize: 32, lineHeight: 38, letterSpacing: -0.67, fontWeight: '700' },
  display: { fontSize: 40, lineHeight: 44, letterSpacing: -1.1, fontWeight: '700' },
  displayHero: { fontSize: 48, lineHeight: 42, letterSpacing: -0.78, fontWeight: '700' },
};

// Strict 8px spacing rhythm (4px allowed only for badge vertical padding)
export const SPACING = {
  badgeV: 4,
  s8: 8,
  s16: 16,
  s24: 24,
  s32: 32,
  s40: 40,
  s48: 48,
  s56: 56,
  s64: 64,
};

export const RADIUS = {
  buttonCompact: 8,
  card: 20,
  badge: 28,
  input: 24,
  pill: 28,
  nav: 28,
  orb: 9999,
};

export const ELEVATION = {
  floatingNav: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  floatingMockup: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
  },
};
