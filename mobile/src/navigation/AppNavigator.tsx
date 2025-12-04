import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import PlayerScreen from '../screens/Player/PlayerScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import UploadScreen from '../screens/Upload/UploadScreen';
import CatalogScreen from '../screens/Catalog/CatalogScreen';
import { Ionicons } from '@expo/vector-icons';
import { logger } from '../utils/logger';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'musical-notes' : 'musical-notes-outline';
          } else if (route.name === 'Catalog') {
            iconName = focused ? 'gift' : 'gift-outline';
          } else if (route.name === 'Upload') {
            iconName = focused ? 'cloud-upload' : 'cloud-upload-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Catalog" component={CatalogScreen} />
      <Tab.Screen name="Upload" component={UploadScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { user, loading } = useAuth();

  React.useEffect(() => {
    logger.info('AppNavigator: Navigation state changed', {
      hasUser: !!user,
      loading,
      userId: user?.id,
    });
  }, [user, loading]);

  if (loading) {
    logger.debug('AppNavigator: Still loading, showing loading screen');
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Loading" component={() => (
            <React.Fragment>
              {/* Pantalla de carga simple */}
            </React.Fragment>
          )} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  logger.debug('AppNavigator: Rendering navigation', {
    authenticated: !!user,
    screen: user ? 'MainTabs' : 'Auth',
  });

  return (
    <NavigationContainer
      onReady={() => logger.info('AppNavigator: Navigation container ready')}
      onStateChange={(state) => {
        const routeName = state?.routes[state.index]?.name;
        logger.debug('AppNavigator: Navigation state changed', { routeName });
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="Player" component={PlayerScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

