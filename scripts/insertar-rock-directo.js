// Script para insertar canción de rock directamente usando las credenciales del backend
const { Client } = require('pg');

// Usar las mismas variables de entorno que el backend
const client = new Client({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'greenmusic', // Intentar greenmusic primero
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
});

async function insertarCancionRock() {
  let connected = false;
  
  // Intentar con 'greenmusic' primero
  try {
    await client.connect();
    connected = true;
    console.log('✅ Conectado a la base de datos');
  } catch (error) {
    // Si falla, intentar con 'green_music'
    if (error.message.includes('does not exist') || error.message.includes('database')) {
      console.log('⚠️  Base de datos "greenmusic" no encontrada, intentando "green_music"...');
      await client.end();
      client.database = 'green_music';
      try {
        await client.connect();
        connected = true;
        console.log('✅ Conectado a la base de datos "green_music"');
      } catch (error2) {
        console.error('❌ Error de conexión:', error2.message);
        console.error('\n💡 Verifica que:');
        console.error('   1. PostgreSQL esté corriendo');
        console.error('   2. La base de datos exista (greenmusic o green_music)');
        console.error('   3. Las credenciales sean correctas\n');
        process.exit(1);
      }
    } else {
      console.error('❌ Error de conexión:', error.message);
      process.exit(1);
    }
  }

  if (!connected) {
    process.exit(1);
  }

  try {
    const query = `
      INSERT INTO songs (id, title, description, artist_id, audio_url, cover_url, points_per_play, status, duration, created_at, updated_at)
      VALUES (
        '00000000-0000-0000-0000-000000000206',
        'Rock Verde',
        'Rock potente con mensaje ecológico. Guitarras distorsionadas y ritmo contundente que suena muy fuerte.',
        '00000000-0000-0000-0000-000000000003',
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500',
        15,
        'active',
        240,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (id) DO UPDATE
      SET title = EXCLUDED.title,
          description = EXCLUDED.description,
          audio_url = EXCLUDED.audio_url,
          cover_url = EXCLUDED.cover_url,
          points_per_play = EXCLUDED.points_per_play,
          status = EXCLUDED.status,
          duration = EXCLUDED.duration,
          updated_at = CURRENT_TIMESTAMP
      RETURNING id, title, points_per_play, status, duration;
    `;

    const result = await client.query(query);
    
    if (result.rows.length > 0) {
      console.log('\n✅ Canción de rock agregada correctamente:');
      console.log(`   - ID: ${result.rows[0].id}`);
      console.log(`   - Título: ${result.rows[0].title}`);
      console.log(`   - Puntos: ${result.rows[0].points_per_play}`);
      console.log(`   - Estado: ${result.rows[0].status}`);
      console.log(`   - Duración: ${result.rows[0].duration} segundos`);
      console.log('\n📱 La canción ya está disponible en la app');
      console.log('\n⚠️  IMPORTANTE:');
      console.log('   La URL de audio es de ejemplo.');
      console.log('   Para usar tu propia canción de rock:');
      console.log('   1. Sube tu canción a Firebase Storage');
      console.log('   2. O usa una URL de música libre de rock');
      console.log('   3. Actualiza la URL en la base de datos\n');
    } else {
      console.log('⚠️  La canción ya existía y fue actualizada');
    }

  } catch (error) {
    console.error('❌ Error al insertar canción:', error.message);
    if (error.message.includes('violates foreign key constraint')) {
      console.error('\n💡 El artista_id no existe. Asegúrate de que el usuario artista esté creado.');
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

insertarCancionRock();

