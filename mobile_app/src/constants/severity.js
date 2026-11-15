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
    bg: '#FFF2D4',
    text: COLORS.warning,
    border: '#E8CC8B',
    label: 'WARNING',
  },
  critical: {
    bg: '#FCE9E7',
    text: COLORS.danger,
    border: '#E8B7B1',
    label: 'CRITICAL',
  },
};
