import { Controller, Post, Get, Body, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body('token') token: string) {
    try {
      console.log('[AUTH] Login attempt - token received:', !!token);
      
      if (!token) {
        console.error('[AUTH] Login failed: No token provided');
        throw new Error('Token is required');
      }

      const decodedToken = await this.firebaseService.verifyToken(token);
      console.log('[AUTH] Token verified - UID:', decodedToken.uid);
      
      let user = await this.usersService.findByFirebaseUid(decodedToken.uid);

      if (!user) {
        console.log('[AUTH] User not found, creating new user...');
        const firebaseUser = await this.firebaseService.getUser(decodedToken.uid);
        const createUserDto: CreateUserDto = {
          firebase_uid: decodedToken.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email || 'User',
          role: UserRole.USER,
        };
        user = await this.usersService.create(createUserDto);
        console.log('[AUTH] User created during login:', user.id);
      } else {
        console.log('[AUTH] User found:', user.id);
      }

      return {
        user,
        token,
      };
    } catch (error: any) {
      console.error('[AUTH] Login error:', error.message);
      console.error('[AUTH] Stack:', error.stack);
      
      if (error.message?.includes('Token')) {
        throw new HttpException(
          { message: 'Token inválido o expirado', error: error.message },
          HttpStatus.UNAUTHORIZED,
        );
      }
      
      throw new HttpException(
        { message: 'Error al iniciar sesión', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('register')
  async register(@Body('token') token: string) {
    try {
      console.log('[AUTH] Register attempt - token received:', !!token);
      
      if (!token) {
        console.error('[AUTH] Register failed: No token provided');
        throw new Error('Token is required');
      }

      const decodedToken = await this.firebaseService.verifyToken(token);
      console.log('[AUTH] Token verified - UID:', decodedToken.uid);
      
      const existingUser = await this.usersService.findByFirebaseUid(
        decodedToken.uid,
      );

      if (existingUser) {
        console.log('[AUTH] User already exists, returning existing user');
        return {
          user: existingUser,
          token,
        };
      }

      console.log('[AUTH] Fetching Firebase user data...');
      const firebaseUser = await this.firebaseService.getUser(decodedToken.uid);
      console.log('[AUTH] Firebase user data:', {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
      });

      const createUserDto: CreateUserDto = {
        firebase_uid: decodedToken.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || firebaseUser.email || 'User',
        role: UserRole.USER,
      };

      console.log('[AUTH] Creating user in database...', createUserDto);
      const user = await this.usersService.create(createUserDto);
      console.log('[AUTH] User created successfully:', user.id);

      return {
        user,
        token,
      };
    } catch (error: any) {
      console.error('[AUTH] Register error:', error.message);
      console.error('[AUTH] Stack:', error.stack);
      
      if (error.message?.includes('Token')) {
        throw new HttpException(
          { message: 'Token inválido o expirado', error: error.message },
          HttpStatus.UNAUTHORIZED,
        );
      }
      
      if (error.message?.includes('user already exists') || error.code === '23505') {
        throw new HttpException(
          { message: 'El usuario ya existe', error: error.message },
          HttpStatus.CONFLICT,
        );
      }
      
      throw new HttpException(
        { message: 'Error al registrar usuario', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('me')
  @UseGuards(FirebaseAuthGuard)
  async getMe(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}

