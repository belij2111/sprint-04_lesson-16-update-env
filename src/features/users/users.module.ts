import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { UsersRepository } from './infrastructure/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/user.entity';
import { UsersQueryRepository } from './infrastructure/users.query-repository';
import { CryptoModule } from '../../base/crypto/crypto.module';
import { UuidProvider } from '../../base/helpers/uuid.provider';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CryptoModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    UuidProvider,
  ],
  exports: [UsersRepository, UsersQueryRepository],
})
export class UsersModule {}
