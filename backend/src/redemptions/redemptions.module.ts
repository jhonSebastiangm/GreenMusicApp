import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedemptionsService } from './redemptions.service';
import { RedemptionsController } from './redemptions.controller';
import { Redemption } from './entities/redemption.entity';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Redemption]),
    UsersModule, // Ya está importado, también sirve para FirebaseAuthGuard
    ProductsModule,
    AuthModule, // Para FirebaseAuthGuard (FirebaseService)
  ],
  controllers: [RedemptionsController],
  providers: [RedemptionsService],
  exports: [RedemptionsService],
})
export class RedemptionsModule {}

