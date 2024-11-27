import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './jwt.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: 'wjdnjwdj23423',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    AuthService,
    UserService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
