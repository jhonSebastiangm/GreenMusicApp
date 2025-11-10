import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { usersService } from '../../services/users.service';
import { SongPlay, Redemption } from '../../types';

const ProfileScreen = () => {
  const { user, logout, refreshUser } = useAuth();
  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState<{
    songPlays: SongPlay[];
    redemptions: Redemption[];
  }>({ songPlays: [], redemptions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      await refreshUser();
      const pointsData = await usersService.getMyPoints();
      const historyData = await usersService.getMyHistory();
      setPoints(pointsData.points_balance);
      setHistory(historyData);
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi Perfil</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Información</Text>
        <Text style={styles.cardText}>Nombre: {user?.name}</Text>
        <Text style={styles.cardText}>Email: {user?.email}</Text>
        <Text style={styles.cardText}>Rol: {user?.role}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Puntos</Text>
        <Text style={styles.points}>{points}</Text>
        <Text style={styles.cardSubtext}>Puntos disponibles</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Historial de Reproducciones</Text>
        {history.songPlays.length === 0 ? (
          <Text style={styles.emptyText}>No hay reproducciones aún</Text>
        ) : (
          history.songPlays.slice(0, 10).map((play) => (
            <View key={play.id} style={styles.historyItem}>
              <Text style={styles.historyText}>
                +{play.points_earned} puntos
              </Text>
              <Text style={styles.historyDate}>
                {new Date(play.played_at).toLocaleDateString()}
              </Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Mis Canjeos</Text>
        {history.redemptions.length === 0 ? (
          <Text style={styles.emptyText}>No hay canjeos aún</Text>
        ) : (
          history.redemptions.map((redemption) => (
            <View key={redemption.id} style={styles.historyItem}>
              <Text style={styles.historyText}>
                {redemption.product?.title || 'Producto'}
              </Text>
              <Text style={styles.historyDate}>
                Estado: {redemption.status}
              </Text>
            </View>
          ))
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  cardText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  cardSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  points: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyText: {
    fontSize: 14,
    color: '#333',
  },
  historyDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    padding: 15,
    margin: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;

