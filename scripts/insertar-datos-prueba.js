/**
 * Script para insertar datos de prueba directamente usando la API
 * o creando un script SQL simplificado
 */

const fs = require('fs');
const path = require('path');

// Leer el archivo SQL
const sqlFile = path.join(__dirname, 'datos-prueba-completos.sql');
const sqlContent = fs.readFileSync(sqlFile, 'utf8');

console.log('📝 Script SQL preparado para insertar datos de prueba');
console.log('');
console.log('Para insertar los datos, ejecuta uno de estos comandos:');
console.log('');
console.log('Opción 1 (si psql está en PATH):');
console.log('  $env:PGPASSWORD="123456"; psql -U postgres -d green_music -f scripts/datos-prueba-completos.sql');
console.log('');
console.log('Opción 2 (desde PowerShell):');
console.log('  cd scripts');
console.log('  $env:PGPASSWORD="123456"');
console.log('  & "C:\\Program Files\\PostgreSQL\\<version>\\bin\\psql.exe" -U postgres -d green_music -f datos-prueba-completos.sql');
console.log('');
console.log('Opción 3 (usando pgAdmin o DBeaver):');
console.log('  1. Abre pgAdmin o DBeaver');
console.log('  2. Conéctate a la base de datos green_music');
console.log('  3. Ejecuta el contenido de: scripts/datos-prueba-completos.sql');
console.log('');
console.log('El script insertará:');
console.log('  - 3 usuarios (admin, user, artist)');
console.log('  - 5 canciones activas');
console.log('  - 6 productos para canjear');
console.log('  - Historial de ejemplo');
console.log('  - Configuración de puntos');



