import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly usersService: UsersService) {}

  async onModuleInit() {
    const adminEmail = 'admin@adapta.local';
    const existing = await this.usersService.findByEmail(adminEmail);
    if (!existing) {
      await this.usersService.create({
        name: 'Admin',
        email: adminEmail,
        password: 'Admin123!',
        role: 'admin',
        status: 'active',
      } as any);
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
