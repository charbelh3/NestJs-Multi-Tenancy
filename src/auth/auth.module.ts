import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TenantConnectionService } from 'src/services/tenant-connection.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, TenantConnectionService],
  exports: [AuthService]
})
export class AuthModule {}
