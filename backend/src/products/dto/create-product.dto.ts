import { IsString, IsUrl, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ProductStatus } from '../entities/product.entity';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  image_url?: string;

  @IsNumber()
  points_required: number;

  @IsNumber()
  @IsOptional()
  stock?: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;
}

