import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
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
    const decodedToken = await this.firebaseService.verifyToken(token);
    let user = await this.usersService.findByFirebaseUid(decodedToken.uid);

    if (!user) {
      const firebaseUser = await this.firebaseService.getUser(decodedToken.uid);
      const createUserDto: CreateUserDto = {
        firebase_uid: decodedToken.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || firebaseUser.email || 'User',
        role: UserRole.USER,
      };
      user = await this.usersService.create(createUserDto);
    }

    return {
      user,
      token,
    };
  }

  @Post('register')
  async register(@Body('token') token: string) {
    const decodedToken = await this.firebaseService.verifyToken(token);
    const existingUser = await this.usersService.findByFirebaseUid(
      decodedToken.uid,
    );

    if (existingUser) {
      return {
        user: existingUser,
        token,
      };
    }

    const firebaseUser = await this.firebaseService.getUser(decodedToken.uid);
    const createUserDto: CreateUserDto = {
      firebase_uid: decodedToken.uid,
      email: firebaseUser.email || '',
      name: firebaseUser.displayName || firebaseUser.email || 'User',
      role: UserRole.USER,
    };

    const user = await this.usersService.create(createUserDto);

    return {
      user,
      token,
    };
  }

  @Get('me')
  @UseGuards(FirebaseAuthGuard)
  async getMe(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}

