import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Redemption, RedemptionStatus } from './entities/redemption.entity';
import { CreateRedemptionDto } from './dto/create-redemption.dto';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class RedemptionsService {
  constructor(
    @InjectRepository(Redemption)
    private redemptionsRepository: Repository<Redemption>,
    private usersService: UsersService,
    private productsService: ProductsService,
  ) {}

  async create(
    createRedemptionDto: CreateRedemptionDto,
    userId: string,
  ): Promise<Redemption> {
    const user = await this.usersService.findOne(userId);
    const product = await this.productsService.findOne(
      createRedemptionDto.productId,
    );

    // Validar que el producto esté activo
    if (product.status !== 'active') {
      throw new BadRequestException('Product is not available');
    }

    // Validar stock
    if (product.stock !== null && product.stock <= 0) {
      throw new BadRequestException('Product is out of stock');
    }

    // Validar puntos suficientes
    if (user.points_balance < product.points_required) {
      throw new BadRequestException('Insufficient points');
    }

    // Crear redención
    const redemption = this.redemptionsRepository.create({
      userId,
      productId: createRedemptionDto.productId,
      points_used: product.points_required,
      status: RedemptionStatus.PENDING,
    });

    const savedRedemption = await this.redemptionsRepository.save(redemption);

    // Descontar puntos del usuario
    await this.usersService.updatePointsBalance(
      user.id,
      -product.points_required,
    );

    // Descontar stock si existe
    if (product.stock !== null) {
      product.stock -= 1;
      await this.productsService.update(product.id, { stock: product.stock });
    }

    return savedRedemption;
  }

  async findAll(): Promise<Redemption[]> {
    return await this.redemptionsRepository.find({
      relations: ['user', 'product'],
      order: { created_at: 'DESC' },
    });
  }

  async findByUser(userId: string): Promise<Redemption[]> {
    return await this.redemptionsRepository.find({
      where: { userId },
      relations: ['product'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Redemption> {
    const redemption = await this.redemptionsRepository.findOne({
      where: { id },
      relations: ['user', 'product'],
    });

    if (!redemption) {
      throw new NotFoundException(`Redemption with ID ${id} not found`);
    }

    return redemption;
  }

  async updateStatus(
    id: string,
    status: RedemptionStatus,
  ): Promise<Redemption> {
    const redemption = await this.findOne(id);
    redemption.status = status;
    return await this.redemptionsRepository.save(redemption);
  }
}

