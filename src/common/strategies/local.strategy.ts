import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../../features/auth/application/auth.service';
import { LoginInputModel } from '../../features/auth/api/models/input/login.input.model';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'loginOrEmail',
    });
  }

  async validate(
    loginOrEmail: LoginInputModel,
    password: string,
  ): Promise<string | null> {
    const userId = await this.authService.validateUser(loginOrEmail, password);
    if (!userId) {
      throw new UnauthorizedException();
    }
    return userId;
  }
}
