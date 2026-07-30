export const colors = {
  primary: '#F0442D',
  primaryDark: '#D93622',
  primarySoft: '#FFF0EC',

  navy: '#17336B',
  navyDark: '#10294A',

  background: '#F8FAFC',
  surface: '#FFFFFF',

  textMain: '#121826',
  textMuted: '#667085',
  textSoft: '#98A2B3',

  borderSoft: '#E5E7EB',

  success: '#16A34A',
  warning: '#F59E0B',
  danger: '#DC2626',

  white: '#FFFFFF',
  black: '#000000',

  overlay: 'rgba(0, 0, 0, 0.45)',
} as const;

export type AppColorName = keyof typeof colors;