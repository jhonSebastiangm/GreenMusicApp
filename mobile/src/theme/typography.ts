/**
 * Tipografía - Green Music
 * 
 * Este archivo contiene todas las definiciones de tipografía.
 * Se actualizará según el manual de marca proporcionado.
 */

export const Typography = {
  // Familias de Fuentes - Manual de Marca: Montserrat
  fontFamily: {
    regular: 'Montserrat-Regular',
    medium: 'Montserrat-Medium',
    semibold: 'Montserrat-SemiBold',
    bold: 'Montserrat-Bold',
    light: 'Montserrat-Light',
    // Fallback para React Native
    regularFallback: 'System',
    mediumFallback: 'System',
    boldFallback: 'System',
  },
  
  // Tamaños de Fuente
  fontSize: {
    // Títulos
    h1: 32,
    h2: 28,
    h3: 24,
    h4: 20,
    h5: 18,
    h6: 16,
    
    // Texto
    body: 16,
    bodySmall: 14,
    caption: 12,
    overline: 10,
    
    // Botones
    button: 16,
    buttonSmall: 14,
  },
  
  // Pesos de Fuente
  fontWeight: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  // Altura de Línea
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
};

export default Typography;

