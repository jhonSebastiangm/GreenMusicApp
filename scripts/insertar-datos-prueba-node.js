/**
 * Script para insertar datos de prueba en PostgreSQL
 * Usa la misma configuración que el backend
 */

const fs = require('fs');
const path = require('path');

// Leer .env manualmente si existe
const envPath = path.join(__dirname, '../backend/.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

// Intentar usar pg si está disponible, sino mostrar instrucciones
let pg;
try {
  pg = require('pg');
} catch (e) {
  console.error('❌ Error: El paquete "pg" no está instalado.');
  console.error('   Instala con: npm install pg --save-dev');
  console.error('   O ejecuta el SQL directamente con psql o pgAdmin');
  process.exit(1);
}

const { Pool } = pg;

// Configuración de conexión (misma que backend)
// Usar DATABASE_* si existe, sino DB_*
const pool = new Pool({
  host: process.env.DATABASE_HOST || process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || process.env.DB_PORT || '5432'),
  database: process.env.DATABASE_NAME || process.env.DB_NAME || 'green_music',
  user: process.env.DATABASE_USER || process.env.DB_USER || 'postgres',
  password: (process.env.DATABASE_PASSWORD || process.env.DB_PASSWORD || '').toString(),
});

async function insertarDatos() {
  const client = await pool.connect();
  
  try {
    console.log('📊 Insertando datos de prueba...\n');
    
    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, 'datos-prueba-completos.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Ejecutar el SQL
    await client.query(sql);
    
    console.log('✅ Datos insertados correctamente!\n');
    
    // Verificar datos insertados
    const songsResult = await client.query('SELECT COUNT(*) as count FROM songs WHERE status = $1', ['active']);
    const productsResult = await client.query('SELECT COUNT(*) as count FROM products WHERE status = $1', ['active']);
    const usersResult = await client.query('SELECT COUNT(*) as count FROM users');
    
    console.log('📈 Resumen:');
    console.log(`   - Canciones activas: ${songsResult.rows[0].count}`);
    console.log(`   - Productos activos: ${productsResult.rows[0].count}`);
    console.log(`   - Usuarios: ${usersResult.rows[0].count}\n`);
    
    console.log('✅ Base de datos lista para pruebas!\n');
    
  } catch (error) {
    console.error('❌ Error al insertar datos:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('   Verifica que PostgreSQL esté corriendo');
    } else if (error.code === '28P01') {
      console.error('   Verifica las credenciales de la base de datos');
    } else if (error.code === '3D000') {
      console.error('   Verifica que la base de datos exista');
    }
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

insertarDatos();

