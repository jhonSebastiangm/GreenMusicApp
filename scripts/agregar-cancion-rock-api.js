// Script para agregar canción de rock usando la API del backend
const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3000';
const ARTIST_ID = '00000000-0000-0000-0000-000000000003'; // Artista Demo

async function agregarCancionRock() {
  try {
    console.log('🎸 Agregando canción de rock...\n');

    // En modo demo, el backend acepta requests sin autenticación real
    const response = await axios.post(
      `${API_URL}/songs`,
      {
        title: 'Rock Verde',
        description: 'Rock potente con mensaje ecológico. Guitarras distorsionadas y ritmo contundente que suena muy fuerte.',
        artist_id: ARTIST_ID,
        audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
        cover_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500',
        points_per_play: 15,
        status: 'active',
        duration: 240, // 4 minutos
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Demo-Mode': 'true', // Modo demo
        },
      }
    );

    console.log('✅ Canción de rock agregada correctamente:');
    console.log(`   - ID: ${response.data.id}`);
    console.log(`   - Título: ${response.data.title}`);
    console.log(`   - Puntos: ${response.data.points_per_play}`);
    console.log(`   - Estado: ${response.data.status}`);
    console.log('\n📱 La canción ya está disponible en la app');
    console.log('\n⚠️  IMPORTANTE:');
    console.log('   La URL de audio es de ejemplo.');
    console.log('   Para usar tu propia canción de rock:');
    console.log('   1. Sube tu canción a Firebase Storage');
    console.log('   2. O usa una URL de música libre de rock');
    console.log('   3. Actualiza la URL en la base de datos\n');

  } catch (error) {
    if (error.response) {
      console.error('❌ Error del servidor:', error.response.data.message || error.response.data);
    } else if (error.request) {
      console.error('❌ No se pudo conectar al backend. Asegúrate de que esté corriendo en', API_URL);
    } else {
      console.error('❌ Error:', error.message);
    }
    process.exit(1);
  }
}

agregarCancionRock();

