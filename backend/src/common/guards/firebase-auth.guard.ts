import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseService } from '../../auth/firebase.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private firebaseService: FirebaseService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Modo demo: permitir acceso sin autenticación real
    const demoMode = request.headers['x-demo-mode'];
    if (demoMode === 'true') {
      // Crear usuario demo temporal
      const demoUser = {
        id: 'demo-user-id',
        email: 'demo@greenmusic.app',
        name: 'Usuario Demo',
        role: 'user',
        points_balance: 1000,
      };
      request.user = demoUser;
      return true;
    }

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.substring(7);

    try {
      const decodedToken = await this.firebaseService.verifyToken(token);
      const user = await this.usersService.findByFirebaseUid(
        decodedToken.uid,
      );

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

