/**
 * Script para insertar datos de prueba usando la API del backend
 * Esto requiere que el backend esté corriendo y que tengas un token de admin
 * 
 * NOTA: Este script inserta datos directamente en la BD usando TypeORM
 * Para una solución más simple, ejecuta el SQL manualmente
 */

const http = require('http');
const { URL } = require('url');

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000';

console.log('⚠️  Este script requiere acceso directo a la base de datos.');
console.log('');
console.log('OPCIÓN RECOMENDADA: Ejecuta el SQL manualmente');
console.log('');
console.log('1. Abre pgAdmin, DBeaver o cualquier cliente SQL');
console.log('2. Conéctate a:');
console.log('   - Host: localhost');
console.log('   - Puerto: 5432');
console.log('   - Base de datos: green_music');
console.log('   - Usuario: postgres');
console.log('   - Password: 123456');
console.log('');
console.log('3. Ejecuta el contenido del archivo:');
console.log('   scripts/datos-prueba-completos.sql');
console.log('');
console.log('O usa este comando si tienes psql:');
console.log('   $env:PGPASSWORD="123456"; psql -U postgres -d green_music -f scripts/datos-prueba-completos.sql');
console.log('');
console.log('Después de insertar los datos, ejecuta:');
console.log('   node scripts/simular-usuario-completo-e2e.js');



