import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { Role } from '../users/entities/role.enum';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async seedAdminIfNeeded(): Promise<void> {
    const shouldSeed = this.configService.get<boolean>('SEED_ADMIN');
    if (!shouldSeed) {
      this.logger.log('SEED_ADMIN=false, saltando seed de admin');
      return;
    }

    const adminEmail = this.configService.get<string>('ADMIN_EMAIL')!;
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD')!;
    const adminName = this.configService.get<string>('ADMIN_NAME')!;

    const existingAdmin = await this.usersService.findByEmail(adminEmail);
    if (existingAdmin) {
      this.logger.log(`Admin ${adminEmail} ya existe, no se crea seed`);
      return;
    }

    try {
      await this.usersService.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: Role.ADMIN,
      });
      this.logger.log(`Admin seed creado: ${adminEmail}`);
    } catch (error) {
      this.logger.warn(`Error en seed admin: ${error}`);
    }
  }
}