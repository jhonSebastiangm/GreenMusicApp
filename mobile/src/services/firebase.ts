// Re-exportar todo desde firebase-fixed
// Esta es la versión que funciona correctamente en React Native/Expo
export { 
  auth, 
  storage, 
  app as default, 
  getAuthInstance 
} from './firebase-fixed';
