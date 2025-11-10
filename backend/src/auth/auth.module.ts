import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class AuthModule {}

