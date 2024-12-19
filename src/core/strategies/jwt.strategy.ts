import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserAccountConfig } from '../../features/user-accounts/config/user-account.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(userAccountConfig: UserAccountConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: userAccountConfig.ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: any) {
    return payload.userId;
  }
}
