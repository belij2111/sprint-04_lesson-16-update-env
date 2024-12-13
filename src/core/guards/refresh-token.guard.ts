import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SecurityDevicesRepository } from '../../features/user-accounts/security-devices/infrastructure/security-devices.repository';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '../../settings/env/configuration';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly securityDevicesRepository: SecurityDevicesRepository,
    private readonly configService: ConfigService<ConfigurationType, true>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const apiSettings = this.configService.get('apiSettings', {
      infer: true,
    });
    const secret = apiSettings.REFRESH_TOKEN_SECRET;
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret,
      });
    } catch (error) {
      console.error('Token verification failed:', error);
      throw new UnauthorizedException();
    }

    const deviceSession = await this.securityDevicesRepository.findById(
      payload.deviceId,
    );
    if (!deviceSession) {
      throw new UnauthorizedException();
    }
    const tokenVersionFromPayload = new Date(payload.iat! * 1000).toISOString();
    const tokenVersionInDB = deviceSession.iatDate;
    if (tokenVersionFromPayload !== tokenVersionInDB) {
      throw new UnauthorizedException();
    }
    request.user = payload.userId;
    request.deviceId = payload.deviceId;
    return true;
  }
}
