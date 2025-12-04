/**
 * Tema Centralizado - Green Music
 * 
 * Este archivo exporta todos los elementos del tema.
 * Se actualizará según el manual de marca proporcionado.
 */

import Colors from './colors';
import Typography from './typography';
import Spacing from './spacing';

export const Theme = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  
  // Componentes pre-estilizados (se agregarán según el manual de marca)
  components: {
    button: {
      primary: {
        backgroundColor: Colors.primary,
        color: Colors.textOnPrimary,
        borderRadius: Spacing.borderRadius.md,
        paddingVertical: Spacing.padding.md,
        paddingHorizontal: Spacing.padding.lg,
      },
      secondary: {
        backgroundColor: Colors.secondary,
        color: Colors.textOnSecondary,
        borderRadius: Spacing.borderRadius.md,
        paddingVertical: Spacing.padding.md,
        paddingHorizontal: Spacing.padding.lg,
      },
    },
    card: {
      backgroundColor: Colors.surface,
      borderRadius: Spacing.borderRadius.lg,
      padding: Spacing.padding.lg,
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
  },
};

export default Theme;
export { Colors, Typography, Spacing };

