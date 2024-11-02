import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { UserCreateModel } from '../api/models/input/create-user.input.model';
import { BcryptService } from '../../../core/crypto/bcrypt.service';
import { User } from '../domain/user.entity';
import { UuidProvider } from '../../../core/helpers/uuid.provider';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '../../../settings/env/configuration';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly bcryptService: BcryptService,
    private readonly uuidProvider: UuidProvider,
    private readonly configService: ConfigService<ConfigurationType, true>,
  ) {}

  async create(userCreateModel: UserCreateModel): Promise<{ id: string }> {
    const existingUserByLogin = await this.usersRepository.findByLoginOrEmail(
      userCreateModel.login,
    );
    if (existingUserByLogin) {
      throw new BadRequestException([
        { field: 'login', message: 'Login is not unique' },
      ]);
    }
    const existingUserByEmail = await this.usersRepository.findByLoginOrEmail(
      userCreateModel.email,
    );
    if (existingUserByEmail) {
      throw new BadRequestException([
        { field: 'email', message: 'Email is not unique' },
      ]);
    }
    const passHash = await this.bcryptService.generateHash(
      userCreateModel.password,
    );
    const expirationTime = this.configService.get(
      'apiSettings.CONFIRMATION_CODE_EXPIRATION',
      {
        infer: true,
      },
    );
    const newUser: User = {
      login: userCreateModel.login,
      password: passHash,
      email: userCreateModel.email,
      createdAt: new Date(),
      emailConfirmation: {
        confirmationCode: this.uuidProvider.generate(),
        expirationDate: new Date(new Date().getTime() + expirationTime),
        isConfirmed: true,
      },
    };
    return this.usersRepository.create(newUser);
  }

  async delete(id: string): Promise<boolean> {
    return this.usersRepository.delete(id);
  }
}
