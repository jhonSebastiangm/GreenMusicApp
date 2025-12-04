/**
 * Script de Pruebas Automatizadas - Green Music
 * 
 * Este script prueba todas las funcionalidades del backend:
 * - Conectividad del servidor
 * - Endpoints de autenticación
 * - Endpoints de canciones
 * - Endpoints de usuarios
 * - Endpoints de productos
 * - Endpoints de redenciones
 * - Endpoints de config
 * - Endpoints de reproducciones
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const { URL } = require('url');

// Usar fetch nativo si está disponible (Node 18+), sino usar http/https
let fetch;
try {
  // Intentar usar fetch global (Node 18+)
  if (typeof globalThis.fetch === 'function') {
    fetch = globalThis.fetch;
  } else {
    // Fallback a http/https
    fetch = null;
  }
} catch (e) {
  fetch = null;
}

// Configuración
const API_BASE_URL = process.env.API_URL || 'http://localhost:3000';
const REPORT_DIR = path.join(__dirname, '..', 'test-reports');
const REPORT_FILE = path.join(REPORT_DIR, `test-report-${new Date().toISOString().replace(/:/g, '-')}.txt`);

// Colores para consola (ANSI)
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

// Estadísticas
const stats = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
  errors: [],
};

// Helper para escribir en archivo y consola
function log(message, color = 'reset') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  const coloredMessage = `${colors[color]}${logMessage}${colors.reset}`;
  
  console.log(coloredMessage);
  
  // Crear directorio si no existe
  if (!fs.existsSync(REPORT_DIR)) {
    fs.mkdirSync(REPORT_DIR, { recursive: true });
  }
  
  // Escribir al archivo
  fs.appendFileSync(REPORT_FILE, logMessage + '\n');
}

// Helper para hacer request HTTP
async function makeRequest(method, url, options = {}) {
  const fullUrl = `${API_BASE_URL}${url}`;
  const urlObj = new URL(fullUrl);
  const isHttps = urlObj.protocol === 'https:';
  const httpModule = isHttps ? https : http;
  
  return new Promise((resolve, reject) => {
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      timeout: options.timeout || 10000,
    };
    
    if (options.data) {
      const dataStr = JSON.stringify(options.data);
      requestOptions.headers['Content-Length'] = Buffer.byteLength(dataStr);
    }
    
    const req = httpModule.request(requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        let parsedData;
        try {
          parsedData = data ? JSON.parse(data) : {};
        } catch (e) {
          parsedData = data;
        }
        
        resolve({
          status: res.statusCode,
          statusText: res.statusMessage,
          data: parsedData,
          headers: res.headers,
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    if (options.data) {
      req.write(JSON.stringify(options.data));
    }
    
    req.end();
  });
}

// Helper para probar un endpoint
async function testEndpoint(name, method, url, options = {}) {
  stats.total++;
  const startTime = Date.now();
  
  try {
    log(`\n[TEST] ${name}`, 'cyan');
    log(`  ${method.toUpperCase()} ${url}`, 'gray');
    
    const response = await makeRequest(method, url, {
      data: options.data,
      headers: options.headers,
      timeout: 10000,
    });
    
    const duration = Date.now() - startTime;
    
    // Determinar si pasó o falló
    const expectedStatus = options.expectedStatus || 200;
    const passed = response.status === expectedStatus || 
                   (options.acceptStatus && options.acceptStatus.includes(response.status));
    
    if (passed) {
      stats.passed++;
      log(`  ✓ PASSED (${response.status}) - ${duration}ms`, 'green');
      if (response.data && typeof response.data === 'object') {
        log(`  Response keys: ${Object.keys(response.data).join(', ')}`, 'gray');
      }
      return { success: true, response, duration };
    } else {
      stats.failed++;
      const errorMsg = `Expected ${expectedStatus}, got ${response.status}`;
      log(`  ✗ FAILED - ${errorMsg}`, 'red');
      log(`  Response: ${JSON.stringify(response.data).substring(0, 200)}`, 'gray');
      stats.errors.push({ name, error: errorMsg, status: response.status });
      return { success: false, response, duration, error: errorMsg };
    }
  } catch (error) {
    stats.failed++;
    const duration = Date.now() - startTime;
    let errorMsg = error.message || 'Unknown error';
    
    // Mejorar mensajes de error comunes
    if (error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED')) {
      errorMsg = 'Conexión rechazada - El backend no está corriendo en http://localhost:3000';
    } else if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
      errorMsg = 'Timeout - El servidor no respondió a tiempo';
    } else if (error.message.includes('ENOTFOUND')) {
      errorMsg = 'Host no encontrado - Verifica la URL del API';
    }
    
    log(`  ✗ FAILED - ${errorMsg}`, 'red');
    if (error.code) {
      log(`  Error code: ${error.code}`, 'gray');
    }
    stats.errors.push({ name, error: errorMsg, code: error.code });
    return { success: false, error: errorMsg, duration };
  }
}

// Verificar conectividad inicial
async function checkBackendConnection() {
  log('Verificando conectividad con el backend...', 'yellow');
  try {
    const response = await makeRequest('GET', '/config/points-per-play', { timeout: 3000 });
    log('  ✓ Backend está disponible y respondiendo', 'green');
    return true;
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED')) {
      log('  ✗ ERROR: El backend NO está corriendo', 'red');
      log('  Por favor, inicia el backend primero:', 'yellow');
      log('    cd backend', 'gray');
      log('    npm run start:dev', 'gray');
      log('', 'reset');
      log('  O ejecuta el script de inicio:', 'yellow');
      log('    .\\scripts\\iniciar-todo.ps1', 'gray');
    } else {
      log(`  ✗ Error de conexión: ${error.message}`, 'red');
    }
    return false;
  }
}

// Función principal de pruebas
async function runTests() {
  log('='.repeat(80), 'cyan');
  log('GREEN MUSIC - PRUEBAS AUTOMATIZADAS DE FUNCIONALIDADES', 'cyan');
  log('='.repeat(80), 'cyan');
  log(`API Base URL: ${API_BASE_URL}`, 'blue');
  log(`Reporte: ${REPORT_FILE}`, 'blue');
  log('', 'reset');
  
  // Verificar conectividad antes de continuar
  const backendAvailable = await checkBackendConnection();
  if (!backendAvailable) {
    log('', 'reset');
    log('='.repeat(80), 'red');
    log('PRUEBAS CANCELADAS - Backend no disponible', 'red');
    log('='.repeat(80), 'red');
    log('', 'reset');
    log('Para ejecutar las pruebas:', 'yellow');
    log('1. Inicia el backend: cd backend && npm run start:dev', 'gray');
    log('2. Espera a que el backend esté completamente iniciado', 'gray');
    log('3. Ejecuta este script nuevamente', 'gray');
    log('', 'reset');
    process.exit(1);
  }
  
  log('', 'reset');
  
  // 1. Verificar conectividad del servidor
  log('\n[FASE 1] Verificación de Conectividad', 'yellow');
  log('-'.repeat(80), 'gray');
  
  await testEndpoint(
    'Health Check - Servidor responde',
    'get',
    '/',
    { expectedStatus: 404 } // Esperamos 404 porque no hay ruta raíz, pero el servidor responde
  );
  
  // 2. Endpoints de Configuración (Públicos)
  log('\n[FASE 2] Endpoints de Configuración', 'yellow');
  log('-'.repeat(80), 'gray');
  
  await testEndpoint(
    'GET /config/points-per-play',
    'get',
    '/config/points-per-play'
  );
  
  // 3. Endpoints de Productos (Públicos)
  log('\n[FASE 3] Endpoints de Productos (Públicos)', 'yellow');
  log('-'.repeat(80), 'gray');
  
  const productsResult = await testEndpoint(
    'GET /products - Listar productos activos',
    'get',
    '/products'
  );
  
  let productId = null;
  if (productsResult.success && productsResult.response.data && Array.isArray(productsResult.response.data) && productsResult.response.data.length > 0) {
    productId = productsResult.response.data[0].id;
    await testEndpoint(
      'GET /products/:id - Obtener producto por ID',
      'get',
      `/products/${productId}`
    );
  } else {
    log('  ⚠ No hay productos para probar GET /products/:id', 'yellow');
    stats.skipped++;
  }
  
  // 4. Endpoints de Canciones (Públicos)
  log('\n[FASE 4] Endpoints de Canciones (Públicos)', 'yellow');
  log('-'.repeat(80), 'gray');
  
  const songsResult = await testEndpoint(
    'GET /songs - Listar canciones activas',
    'get',
    '/songs'
  );
  
  let songId = null;
  if (songsResult.success && songsResult.response.data && Array.isArray(songsResult.response.data) && songsResult.response.data.length > 0) {
    songId = songsResult.response.data[0].id;
    await testEndpoint(
      'GET /songs/:id - Obtener canción por ID',
      'get',
      `/songs/${songId}`
    );
  } else {
    log('  ⚠ No hay canciones para probar GET /songs/:id', 'yellow');
    stats.skipped++;
  }
  
  // 5. Endpoints de Autenticación
  log('\n[FASE 5] Endpoints de Autenticación', 'yellow');
  log('-'.repeat(80), 'gray');
  
  // Probar login sin token (debe fallar)
  await testEndpoint(
    'POST /auth/login - Sin token (debe fallar)',
    'post',
    '/auth/login',
    {
      data: {},
      expectedStatus: 400,
      acceptStatus: [400, 401, 500] // Aceptamos varios códigos de error
    }
  );
  
  // Probar register sin token (debe fallar)
  await testEndpoint(
    'POST /auth/register - Sin token (debe fallar)',
    'post',
    '/auth/register',
    {
      data: {},
      expectedStatus: 400,
      acceptStatus: [400, 401, 500]
    }
  );
  
  // Probar /auth/me sin token (debe fallar)
  await testEndpoint(
    'GET /auth/me - Sin autenticación (debe fallar)',
    'get',
    '/auth/me',
    {
      expectedStatus: 401,
      acceptStatus: [401, 403]
    }
  );
  
  // 6. Endpoints Protegidos (sin token - deben fallar con 401)
  log('\n[FASE 6] Endpoints Protegidos (Validación de Seguridad)', 'yellow');
  log('-'.repeat(80), 'gray');
  
  // Users
  await testEndpoint(
    'GET /users/me - Sin autenticación',
    'get',
    '/users/me',
    { expectedStatus: 401, acceptStatus: [401, 403] }
  );
  
  await testEndpoint(
    'GET /users/me/points - Sin autenticación',
    'get',
    '/users/me/points',
    { expectedStatus: 401, acceptStatus: [401, 403] }
  );
  
  await testEndpoint(
    'GET /users/me/history - Sin autenticación',
    'get',
    '/users/me/history',
    { expectedStatus: 401, acceptStatus: [401, 403] }
  );
  
  await testEndpoint(
    'GET /users - Sin autenticación (admin)',
    'get',
    '/users',
    { expectedStatus: 401, acceptStatus: [401, 403] }
  );
  
  // Songs protegidos
  await testEndpoint(
    'POST /songs - Sin autenticación',
    'post',
    '/songs',
    {
      data: { title: 'Test', description: 'Test' },
      expectedStatus: 401,
      acceptStatus: [401, 403]
    }
  );
  
  await testEndpoint(
    'GET /songs/my-songs - Sin autenticación',
    'get',
    '/songs/my-songs',
    { expectedStatus: 401, acceptStatus: [401, 403] }
  );
  
  if (songId) {
    await testEndpoint(
      'PATCH /songs/:id - Sin autenticación',
      'patch',
      `/songs/${songId}`,
      {
        data: { title: 'Updated' },
        expectedStatus: 401,
        acceptStatus: [401, 403]
      }
    );
    
    await testEndpoint(
      'DELETE /songs/:id - Sin autenticación',
      'delete',
      `/songs/${songId}`,
      { expectedStatus: 401, acceptStatus: [401, 403] }
    );
  }
  
  // Products protegidos (admin)
  await testEndpoint(
    'POST /products - Sin autenticación (admin)',
    'post',
    '/products',
    {
      data: { name: 'Test', points_cost: 100 },
      expectedStatus: 401,
      acceptStatus: [401, 403]
    }
  );
  
  if (productId) {
    await testEndpoint(
      'PATCH /products/:id - Sin autenticación (admin)',
      'patch',
      `/products/${productId}`,
      {
        data: { name: 'Updated' },
        expectedStatus: 401,
        acceptStatus: [401, 403]
      }
    );
    
    await testEndpoint(
      'DELETE /products/:id - Sin autenticación (admin)',
      'delete',
      `/products/${productId}`,
      { expectedStatus: 401, acceptStatus: [401, 403] }
    );
  }
  
  // Redemptions
  await testEndpoint(
    'POST /redemptions - Sin autenticación',
    'post',
    '/redemptions',
    {
      data: { product_id: productId || '00000000-0000-0000-0000-000000000000' },
      expectedStatus: 401,
      acceptStatus: [401, 403]
    }
  );
  
  await testEndpoint(
    'GET /redemptions/my-redemptions - Sin autenticación',
    'get',
    '/redemptions/my-redemptions',
    { expectedStatus: 401, acceptStatus: [401, 403] }
  );
  
  await testEndpoint(
    'GET /redemptions - Sin autenticación (admin)',
    'get',
    '/redemptions',
    { expectedStatus: 401, acceptStatus: [401, 403] }
  );
  
  // Song Plays
  await testEndpoint(
    'POST /song-plays - Sin autenticación',
    'post',
    '/song-plays',
    {
      data: { songId: songId || '00000000-0000-0000-0000-000000000000' },
      expectedStatus: 401,
      acceptStatus: [401, 403]
    }
  );
  
  await testEndpoint(
    'GET /song-plays/my-plays - Sin autenticación',
    'get',
    '/song-plays/my-plays',
    { expectedStatus: 401, acceptStatus: [401, 403] }
  );
  
  await testEndpoint(
    'GET /song-plays - Sin autenticación (admin)',
    'get',
    '/song-plays',
    { expectedStatus: 401, acceptStatus: [401, 403] }
  );
  
  if (songId) {
    await testEndpoint(
      'POST /song-plays/songs/:songId/play-complete - Sin autenticación',
      'post',
      `/song-plays/songs/${songId}/play-complete`,
      { expectedStatus: 401, acceptStatus: [401, 403] }
    );
  }
  
  // Config protegido (admin)
  await testEndpoint(
    'PUT /config/points-per-play - Sin autenticación (admin)',
    'put',
    '/config/points-per-play',
    {
      data: { points_per_play: 10 },
      expectedStatus: 401,
      acceptStatus: [401, 403]
    }
  );
  
  // 7. Validación de Estructura de Respuestas
  log('\n[FASE 7] Validación de Estructura de Respuestas', 'yellow');
  log('-'.repeat(80), 'gray');
  
  if (productsResult.success && productsResult.response.data) {
    const products = Array.isArray(productsResult.response.data) 
      ? productsResult.response.data 
      : [];
    
    if (products.length > 0) {
      const product = products[0];
      const requiredFields = ['id', 'name', 'points_cost', 'status'];
      const missingFields = requiredFields.filter(field => !(field in product));
      
      if (missingFields.length === 0) {
        log('  ✓ Estructura de productos válida', 'green');
        stats.passed++;
        stats.total++;
      } else {
        log(`  ✗ Campos faltantes en productos: ${missingFields.join(', ')}`, 'red');
        stats.failed++;
        stats.total++;
      }
    }
  }
  
  if (songsResult.success && songsResult.response.data) {
    const songs = Array.isArray(songsResult.response.data) 
      ? songsResult.response.data 
      : [];
    
    if (songs.length > 0) {
      const song = songs[0];
      const requiredFields = ['id', 'title', 'artist_id', 'status'];
      const missingFields = requiredFields.filter(field => !(field in song));
      
      if (missingFields.length === 0) {
        log('  ✓ Estructura de canciones válida', 'green');
        stats.passed++;
        stats.total++;
      } else {
        log(`  ✗ Campos faltantes en canciones: ${missingFields.join(', ')}`, 'red');
        stats.failed++;
        stats.total++;
      }
    }
  }
  
  // Generar reporte final
  log('\n' + '='.repeat(80), 'cyan');
  log('RESUMEN DE PRUEBAS', 'cyan');
  log('='.repeat(80), 'cyan');
  log(`Total de pruebas: ${stats.total}`, 'blue');
  log(`✓ Pasadas: ${stats.passed}`, 'green');
  log(`✗ Fallidas: ${stats.failed}`, 'red');
  log(`⚠ Omitidas: ${stats.skipped}`, 'yellow');
  log(`Tasa de éxito: ${((stats.passed / stats.total) * 100).toFixed(2)}%`, 
      stats.failed === 0 ? 'green' : 'yellow');
  
  if (stats.errors.length > 0) {
    log('\nErrores encontrados:', 'red');
    stats.errors.forEach((error, index) => {
      log(`  ${index + 1}. ${error.name}: ${error.error}`, 'red');
    });
  }
  
  log('\n' + '='.repeat(80), 'cyan');
  log(`Reporte completo guardado en: ${REPORT_FILE}`, 'blue');
  log('='.repeat(80), 'cyan');
  
  // Retornar código de salida
  process.exit(stats.failed > 0 ? 1 : 0);
}

// Manejo de errores no capturados
process.on('unhandledRejection', (error) => {
  log(`\nERROR NO MANEJADO: ${error.message}`, 'red');
  log(`Stack: ${error.stack}`, 'gray');
  process.exit(1);
});

// Ejecutar pruebas
runTests().catch((error) => {
  log(`\nERROR FATAL: ${error.message}`, 'red');
  log(`Stack: ${error.stack}`, 'gray');
  process.exit(1);
});

