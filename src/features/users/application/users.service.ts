import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { UserCreateModel } from '../api/models/input/create-user.input.model';
import { BcryptService } from '../../../base/bcrypt.service';
import { User } from '../domain/user.entity';
import { LoginInputModel } from '../../auth/api/models/input/login.input.model';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly bcryptService: BcryptService,
  ) {}

  async create(userCreateModel: UserCreateModel): Promise<{ id: string }> {
    const existingUser = await this.usersRepository.findByLoginOrEmail({
      loginOrEmail: userCreateModel.login || userCreateModel.email,
      password: userCreateModel.password,
    });
    if (existingUser) {
      throw new BadRequestException('Login or email is not unique');
    }
    const passHash = await this.bcryptService.generateHash(
      userCreateModel.password,
    );
    const newUser: User = {
      login: userCreateModel.login,
      password: passHash,
      email: userCreateModel.email,
      createdAt: new Date(),
    };
    return this.usersRepository.create(newUser);
  }

  async delete(id: string): Promise<boolean> {
    return this.usersRepository.delete(id);
  }

  async findOne(loginOrEmail: LoginInputModel) {
    return this.usersRepository.findOne(loginOrEmail);
  }
}
