// Script para agregar canción de rock a la base de datos
const { Client } = require('pg');

// Leer .env del backend si existe
const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '..', 'backend', '.env');
let envVars = {};

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      envVars[match[1].trim()] = match[2].trim();
    }
  });
}

const client = new Client({
  host: envVars.DB_HOST || process.env.DB_HOST || 'localhost',
  port: parseInt(envVars.DB_PORT || process.env.DB_PORT || '5432'),
  database: envVars.DB_NAME || process.env.DB_NAME || 'greenmusic',
  user: envVars.DB_USER || process.env.DB_USER || 'postgres',
  password: envVars.DB_PASSWORD || process.env.DB_PASSWORD || 'postgres',
});

async function agregarCancionRock() {
  try {
    await client.connect();
    console.log('✅ Conectado a la base de datos');

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
      RETURNING id, title, points_per_play, status;
    `;

    const result = await client.query(query);
    
    if (result.rows.length > 0) {
      console.log('\n✅ Canción de rock agregada correctamente:');
      console.log(`   - ID: ${result.rows[0].id}`);
      console.log(`   - Título: ${result.rows[0].title}`);
      console.log(`   - Puntos: ${result.rows[0].points_per_play}`);
      console.log(`   - Estado: ${result.rows[0].status}`);
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
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

agregarCancionRock();

