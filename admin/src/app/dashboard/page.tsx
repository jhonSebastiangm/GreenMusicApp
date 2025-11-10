'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    users: 0,
    songs: 0,
    products: 0,
    redemptions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [usersRes, songsRes, productsRes, redemptionsRes] =
        await Promise.all([
          api.get('/users'),
          api.get('/songs'),
          api.get('/products'),
          api.get('/redemptions'),
        ]);

      setStats({
        users: usersRes.data.length,
        songs: songsRes.data.length,
        products: productsRes.data.length,
        redemptions: redemptionsRes.data.length,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Cargando...</div>;
  }

  return (
    <div>
      <h1 style={styles.title}>Dashboard</h1>
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h2 style={styles.statNumber}>{stats.users}</h2>
          <p style={styles.statLabel}>Usuarios</p>
        </div>
        <div style={styles.statCard}>
          <h2 style={styles.statNumber}>{stats.songs}</h2>
          <p style={styles.statLabel}>Canciones</p>
        </div>
        <div style={styles.statCard}>
          <h2 style={styles.statNumber}>{stats.products}</h2>
          <p style={styles.statLabel}>Productos</p>
        </div>
        <div style={styles.statCard}>
          <h2 style={styles.statNumber}>{stats.redemptions}</h2>
          <p style={styles.statLabel}>Canjeos</p>
        </div>
      </div>
    </div>
  );
}

const styles: any = {
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '30px',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  statCard: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: '10px',
  },
  statLabel: {
    fontSize: '18px',
    color: '#666',
  },
};

