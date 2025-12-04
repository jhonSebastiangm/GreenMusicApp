/**
 * Helper para usar fuentes Montserrat con fallback
 */
export const getFontFamily = (weight: 'regular' | 'medium' | 'semibold' | 'bold' | 'light' = 'regular') => {
  const fontMap = {
    regular: 'Montserrat-Regular',
    medium: 'Montserrat-Medium',
    semibold: 'Montserrat-SemiBold',
    bold: 'Montserrat-Bold',
    light: 'Montserrat-Light',
  };

  // En React Native, si la fuente no está cargada, usará el fallback del sistema
  return fontMap[weight] || 'Montserrat-Regular';
};

export default getFontFamily;

