import { Module, forwardRef } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [forwardRef(() => UsersModule)], // Usar forwardRef para evitar dependencia circular
  controllers: [AuthController],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class AuthModule {}

