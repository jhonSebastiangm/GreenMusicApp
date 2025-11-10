'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function ConfigPage() {
  const [pointsPerPlay, setPointsPerPlay] = useState(10);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await api.get('/config/points-per-play');
      setPointsPerPlay(response.data.points_per_play);
    } catch (error) {
      console.error('Error loading config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/config/points-per-play', {
        points_per_play: pointsPerPlay,
      });
      alert('Configuración guardada correctamente');
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Cargando...</div>;
  }

  return (
    <div>
      <h1 style={styles.title}>Configuración</h1>
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Puntos por Reproducción</h2>
        <p style={styles.cardDescription}>
          Cantidad de puntos que se otorgan por cada reproducción completa de
          una canción
        </p>
        <div style={styles.inputGroup}>
          <input
            type="number"
            value={pointsPerPlay}
            onChange={(e) => setPointsPerPlay(parseInt(e.target.value))}
            style={styles.input}
            min="1"
          />
          <button
            onClick={handleSave}
            disabled={saving}
            style={styles.saveButton}
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
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
  card: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    maxWidth: '600px',
  },
  cardTitle: {
    fontSize: '24px',
    marginBottom: '10px',
  },
  cardDescription: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '20px',
  },
  inputGroup: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    width: '200px',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

