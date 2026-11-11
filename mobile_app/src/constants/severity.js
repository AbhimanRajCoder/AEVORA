// Alert severity badge tokens mapped strictly to the neo-botanical palette.

import { COLORS } from './theme';

export const SEVERITY_LEVELS = {
  INFO: 'info',
  WARNING: 'warning',
  CRITICAL: 'critical',
};

export const SEVERITY_STYLES = {
  info: {
    bg: COLORS.sproutWash,
    text: COLORS.mossShadow,
    border: COLORS.mistGreen,
    label: 'INFO',
  },
  warning: {
    bg: COLORS.boneWhite,
    text: COLORS.onyxOlive,
    border: COLORS.paleFern,
    label: 'WARNING',
  },
  critical: {
    bg: COLORS.forestDepths,
    text: COLORS.electricSprout,
    border: COLORS.electricSprout,
    label: 'CRITICAL',
  },
};
