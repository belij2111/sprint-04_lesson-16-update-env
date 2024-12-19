import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';
import { CoreConfig } from '../core.config';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly coreConfig: CoreConfig) {
    super();
  }

  public validate = async (
    userLogin: string,
    password: string,
  ): Promise<boolean> => {
    if (
      this.coreConfig.ADMIN_LOGIN === userLogin &&
      this.coreConfig.ADMIN_PASSWORD === password
    ) {
      return true;
    }
    throw new UnauthorizedException();
  };
}
