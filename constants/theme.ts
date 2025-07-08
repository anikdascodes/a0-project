export const COLORS = {
  primary: '#4CAF50',
  primaryDark: '#388E3C',
  primaryLight: '#A5D6A7',
  secondary: '#607D8B',
  secondaryDark: '#455A64',
  secondaryLight: '#B0BEC5',
  background: '#F5F5F5',
  white: '#FFFFFF',
  black: '#000000',
  text: '#212121',
  textSecondary: '#757575',
  error: '#D32F2F',
  success: '#388E3C',
  warning: '#FFA000',
  info: '#1976D2',
  divider: '#BDBDBD',
};

export const SIZES = {
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  extraLarge: 24,
  xxl: 32,
  xxxl: 40,
};

export const FONTS = {
  regular: {
    fontFamily: 'System',
    fontWeight: 'normal' as 'normal',
  },
  medium: {
    fontFamily: 'System',
    fontWeight: '500' as '500',
  },
  bold: {
    fontFamily: 'System',
    fontWeight: 'bold' as 'bold',
  },
  light: {
    fontFamily: 'System',
    fontWeight: '300' as '300',
  },
};

export const SHADOWS = {
  small: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
};

export default { COLORS, SIZES, FONTS, SHADOWS };