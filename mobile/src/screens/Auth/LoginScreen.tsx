import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getAuthInstance } from '../../services/firebase';
import { logger } from '../../utils/logger';
import { Colors, Typography, Spacing } from '../../theme';
import Logo from '../../components/Logo';
import { getFontFamily } from '../../utils/fonts';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginDemo } = useAuth();

  const handleDemoMode = async () => {
    try {
      setLoading(true);
      logger.info('LoginScreen: Activating demo mode');
      await loginDemo();
      logger.info('LoginScreen: Demo mode activated successfully');
    } catch (error: any) {
      logger.error('LoginScreen: Error activating demo mode', error);
      Alert.alert('Error', 'No se pudo activar el modo demo');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      logger.warn('LoginScreen: Campos incompletos');
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    logger.info('LoginScreen: Iniciando proceso de login', { email });
    try {
      // Obtener instancia de auth de forma segura
      const authInstance = await getAuthInstance();
      logger.debug('LoginScreen: Autenticando con Firebase');
      const userCredential = await signInWithEmailAndPassword(
        authInstance,
        email,
        password,
      );
      logger.debug('LoginScreen: Firebase auth exitoso, obteniendo token');
      const token = await userCredential.user.getIdToken();
      logger.debug('LoginScreen: Token obtenido, llamando a login del contexto');
      await login(token);
      logger.info('LoginScreen: Login completado exitosamente');
    } catch (error: any) {
      logger.error('LoginScreen: Error en login', error, {
        email,
        errorCode: error.code,
        errorMessage: error.message,
      });
      Alert.alert('Error', error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo size="large" />
      </View>
      <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
        style={styles.linkButton}
      >
        <Text style={styles.linkText}>
          ¿No tienes cuenta? Regístrate aquí
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleDemoMode}
        style={styles.demoButton}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#4CAF50" />
        ) : (
          <Text style={styles.demoButtonText}>
            🎵 Probar sin registro (Modo Demo)
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.padding.lg,
    backgroundColor: Colors.background,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.margin.lg,
  },
  subtitle: {
    fontSize: Typography.fontSize.body,
    fontFamily: getFontFamily('regular'),
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.margin.xl,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Spacing.borderRadius.md,
    padding: Spacing.padding.md,
    marginBottom: Spacing.margin.md,
    fontSize: Typography.fontSize.body,
    fontFamily: getFontFamily('regular'),
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: Spacing.padding.md,
    borderRadius: Spacing.borderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.margin.sm,
  },
  buttonText: {
    color: Colors.textOnPrimary,
    fontSize: Typography.fontSize.button,
    fontFamily: getFontFamily('bold'),
    fontWeight: Typography.fontWeight.bold,
  },
  linkButton: {
    marginTop: Spacing.margin.lg,
    alignItems: 'center',
  },
  linkText: {
    color: Colors.primary,
    fontSize: Typography.fontSize.bodySmall,
    fontFamily: getFontFamily('medium'),
  },
  demoButton: {
    marginTop: Spacing.margin.xl,
    padding: Spacing.padding.md,
    borderRadius: Spacing.borderRadius.md,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
  demoButtonText: {
    color: Colors.secondary,
    fontSize: Typography.fontSize.button,
    fontFamily: getFontFamily('bold'),
    fontWeight: Typography.fontWeight.bold,
  },
});

export default LoginScreen;

