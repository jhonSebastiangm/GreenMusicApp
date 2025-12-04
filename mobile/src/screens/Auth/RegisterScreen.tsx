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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, getAuthInstance } from '../../services/firebase';
import { logger } from '../../utils/logger';

const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      // Validar y obtener auth de forma segura (ahora es async)
      let authInstance;
      try {
        logger.debug('RegisterScreen: Obteniendo auth instance...');
        authInstance = await getAuthInstance();
        logger.debug('RegisterScreen: Auth instance obtenida correctamente');
      } catch (authError: any) {
        logger.error('RegisterScreen: Error al obtener auth instance', authError);
        Alert.alert(
          'Error de Configuración',
          'Firebase no está configurado correctamente. Por favor, verifica la configuración de la app.\n\n' + authError.message
        );
        setLoading(false);
        return;
      }

      logger.info('RegisterScreen: Creando usuario en Firebase', { email });
      const userCredential = await createUserWithEmailAndPassword(
        authInstance,
        email,
        password,
      );
      logger.debug('RegisterScreen: Usuario creado en Firebase', { uid: userCredential.user.uid });
      await userCredential.user.updateProfile({ displayName: name });
      const token = await userCredential.user.getIdToken();
      await register(token);
    } catch (error: any) {
      console.error('Register error:', error);
      let errorMessage = 'Error al registrarse';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email ya está registrado. Intenta iniciar sesión.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El email no es válido';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es muy débil';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>
      <Text style={styles.subtitle}>Únete a Green Music</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
      />

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
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Registrarse</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={styles.linkButton}
      >
        <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#4CAF50',
    fontSize: 14,
  },
});

export default RegisterScreen;

