import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppConfig } from './entities/app-config.entity';

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(AppConfig)
    private configRepository: Repository<AppConfig>,
  ) {}

  async getValue(key: string): Promise<string> {
    const config = await this.configRepository.findOne({
      where: { key },
    });

    if (!config) {
      throw new NotFoundException(`Config key ${key} not found`);
    }

    return config.value;
  }

  async setValue(key: string, value: string, description?: string): Promise<AppConfig> {
    let config = await this.configRepository.findOne({
      where: { key },
    });

    if (config) {
      config.value = value;
      if (description) {
        config.description = description;
      }
    } else {
      config = this.configRepository.create({
        key,
        value,
        description,
      });
    }

    return await this.configRepository.save(config);
  }

  async getPointsPerPlay(): Promise<number> {
    try {
      const value = await this.getValue('points_per_play');
      return parseInt(value, 10) || 10;
    } catch {
      return 10; // Valor por defecto
    }
  }

  async setPointsPerPlay(points: number): Promise<AppConfig> {
    return await this.setValue(
      'points_per_play',
      points.toString(),
      'Puntos otorgados por cada reproducción completa de canción',
    );
  }
}

