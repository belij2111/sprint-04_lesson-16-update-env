import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { UserCreateModel } from '../api/models/input/create-user.input.model';
import { BcryptService } from '../../../base/bcrypt.service';
import { User } from '../domain/user.entity';
import { UuidProvider } from '../../../base/helpers/uuid.provider';
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
    const existingUser = await this.usersRepository.findByLoginOrEmail({
      loginOrEmail: userCreateModel.login || userCreateModel.email,
      password: userCreateModel.password,
    });
    if (existingUser) {
      throw new BadRequestException([
        { field: 'loginOrEmail', message: 'Login or Email is not unique' },
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
