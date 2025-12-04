// Sistema de logging mejorado para la app móvil
// Guarda logs en consola y en archivo dentro del dispositivo
let FileSystem: any = null;
try {
  FileSystem = require('expo-file-system');
} catch (e) {
  console.warn('expo-file-system not available, using console only');
}

interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'ERROR' | 'WARN' | 'DEBUG';
  message: string;
  error?: string;
  stack?: string;
  context?: Record<string, any>;
}

class Logger {
  private logDir: string;
  private logFile: string;
  private maxLogSize: number = 5 * 1024 * 1024; // 5MB
  private logBuffer: string[] = [];
  private bufferSize: number = 50;

  constructor() {
    if (FileSystem && FileSystem.documentDirectory) {
      this.logDir = `${FileSystem.documentDirectory}logs/`;
      this.logFile = `${this.logDir}mobile.log`;
      this.ensureLogDirectory();
    } else {
      this.logDir = '';
      this.logFile = '';
    }
  }

  private async ensureLogDirectory() {
    if (!FileSystem) return;
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.logDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.logDir, { intermediates: true });
      }
    } catch (error) {
      console.error('Error creating log directory:', error);
    }
  }

  private formatMessage(level: LogEntry['level'], message: string, error?: any, context?: Record<string, any>): string {
    const timestamp = new Date().toISOString();
    let logMessage = `[${timestamp}] [${level}] ${message}`;
    
    if (context && Object.keys(context).length > 0) {
      logMessage += `\nContext: ${JSON.stringify(context, null, 2)}`;
    }
    
    if (error) {
      if (error instanceof Error) {
        logMessage += `\nError: ${error.message}`;
        if (error.stack) {
          logMessage += `\nStack: ${error.stack}`;
        }
      } else {
        logMessage += `\nError: ${JSON.stringify(error, null, 2)}`;
      }
    }
    
    return logMessage;
  }

  async log(level: LogEntry['level'], message: string, error?: any, context?: Record<string, any>) {
    const logMessage = this.formatMessage(level, message, error, context);
    
    // Siempre escribir a consola con formato mejorado
    const consoleMessage = `[${level}] ${message}`;
    if (level === 'ERROR') {
      console.error(consoleMessage, error || '', context || '');
      console.error(logMessage);
    } else if (level === 'WARN') {
      console.warn(consoleMessage, context || '');
    } else if (level === 'DEBUG') {
      console.debug(consoleMessage, context || '');
    } else {
      console.log(consoleMessage, context || '');
    }

    // Guardar en buffer
    this.logBuffer.push(logMessage);
    if (this.logBuffer.length >= this.bufferSize) {
      await this.flushBuffer();
    }

    // Escribir a archivo (solo si FileSystem está disponible)
    if (FileSystem && this.logFile) {
      try {
        await this.ensureLogDirectory();
        
        // Verificar tamaño del archivo
        const fileInfo = await FileSystem.getInfoAsync(this.logFile);
        if (fileInfo.exists && fileInfo.size > this.maxLogSize) {
          // Rotar logs: renombrar el archivo actual y crear uno nuevo
          const rotatedFile = `${this.logFile}.${Date.now()}`;
          await FileSystem.moveAsync({ from: this.logFile, to: rotatedFile });
        }
        
        await FileSystem.appendToFileAsync(this.logFile, logMessage + '\n');
      } catch (fileError) {
        console.error('Error writing to log file:', fileError);
      }
    }
  }

  async flushBuffer() {
    if (this.logBuffer.length === 0 || !FileSystem || !this.logFile) return;
    
    try {
      const bufferContent = this.logBuffer.join('\n') + '\n';
      await FileSystem.appendToFileAsync(this.logFile, bufferContent);
      this.logBuffer = [];
    } catch (error) {
      console.error('Error flushing log buffer:', error);
    }
  }

  info(message: string, context?: Record<string, any>) {
    this.log('INFO', message, undefined, context);
  }

  error(message: string, error?: any, context?: Record<string, any>) {
    this.log('ERROR', message, error, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log('WARN', message, undefined, context);
  }

  debug(message: string, context?: Record<string, any>) {
    this.log('DEBUG', message, undefined, context);
  }

  async getLogs(): Promise<string> {
    if (!FileSystem || !this.logFile) {
      return 'FileSystem not available';
    }
    try {
      const fileInfo = await FileSystem.getInfoAsync(this.logFile);
      if (fileInfo.exists) {
        return await FileSystem.readAsStringAsync(this.logFile);
      }
      return 'No logs available';
    } catch (error) {
      return `Error reading logs: ${error}`;
    }
  }

  async clearLogs() {
    if (!FileSystem || !this.logFile) return;
    try {
      const fileInfo = await FileSystem.getInfoAsync(this.logFile);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(this.logFile, { idempotent: true });
      }
      this.logBuffer = [];
    } catch (error) {
      console.error('Error clearing logs:', error);
    }
  }
}

export const logger = new Logger();

