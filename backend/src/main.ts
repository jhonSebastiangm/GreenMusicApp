import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';

// Función para escribir logs
function writeLog(message: string, level: 'INFO' | 'ERROR' | 'WARN' = 'INFO') {
  const logDir = path.join(__dirname, '..', 'logs');
  const logFile = path.join(logDir, 'backend.log');
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}\n`;
  
  // Crear directorio de logs si no existe
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  // Escribir al archivo
  fs.appendFileSync(logFile, logMessage);
  
  // También escribir a consola
  console.log(logMessage.trim());
}

async function bootstrap() {
  try {
    writeLog('Starting NestJS application...');
    const app = await NestFactory.create(AppModule);
    
    writeLog('Configuring global pipes...');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    writeLog('Enabling CORS...');
    app.enableCors({
      origin: process.env.CORS_ORIGIN?.split(',') || '*',
      credentials: true,
    });

    const port = process.env.PORT || 3000;
    await app.listen(port);
    writeLog(`Application is running on: http://localhost:${port}`, 'INFO');
  } catch (error) {
    writeLog(`Error starting application: ${error.message}`, 'ERROR');
    writeLog(`Stack trace: ${error.stack}`, 'ERROR');
    process.exit(1);
  }
}

// Capturar errores no manejados
process.on('unhandledRejection', (reason, promise) => {
  writeLog(`Unhandled Rejection at: ${promise}, reason: ${reason}`, 'ERROR');
});

process.on('uncaughtException', (error) => {
  writeLog(`Uncaught Exception: ${error.message}`, 'ERROR');
  writeLog(`Stack trace: ${error.stack}`, 'ERROR');
  process.exit(1);
});

bootstrap();

