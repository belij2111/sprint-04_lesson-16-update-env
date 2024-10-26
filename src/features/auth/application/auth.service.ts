import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from '../../../base/bcrypt.service';
import { LoginInputModel } from '../api/models/input/login.input.model';
import { UserInfoInputModel } from '../api/models/input/user-info.input.model';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '../../../settings/env/configuration';
import { LoginSuccessViewModel } from '../api/models/output/login-success.view.model';
import { UsersRepository } from '../../users/infrastructure/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<ConfigurationType, true>,
  ) {}

  async validateUser(
    loginOrEmail: LoginInputModel,
    password: string,
  ): Promise<string | null> {
    const user = await this.usersRepository.findOne(loginOrEmail);
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

  async login(userId: UserInfoInputModel): Promise<LoginSuccessViewModel> {
    const payload = { userId: userId };
    const accessToken = this.jwtService.sign(payload);
    const apiSettings = this.configService.get('apiSettings', {
      infer: true,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: apiSettings.REFRESH_TOKEN_SECRET,
      expiresIn: apiSettings.REFRESH_TOKEN_EXPIRATION,
    });
    return {
      accessToken,
      refreshToken,
    };
  }
}
