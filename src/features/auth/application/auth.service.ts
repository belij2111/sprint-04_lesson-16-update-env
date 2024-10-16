import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/application/users.service';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from '../../../base/bcrypt.service';
import { LoginInputModel } from '../api/models/input/login.input.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    loginOrEmail: LoginInputModel,
    password: string,
  ): Promise<string | null> {
    const user = await this.usersService.findOne(loginOrEmail);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isPasswordValid = await this.bcryptService.checkPassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    return user._id.toString();
  }

  async login(userId: any) {
    const payload = { userId: userId };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
