import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SecurityDevicesRepository } from '../../features/security-devices/infrastructure/security-devices.repository';
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
    const payload = await this.jwtService.verifyAsync(refreshToken, { secret });
    if (!payload) {
      throw new UnauthorizedException();
    }

    const deviceSession = await this.securityDevicesRepository.findById(
      payload.deviceId,
    );
    if (!deviceSession) {
      throw new UnauthorizedException();
    }
    const tokenVersionFromPayload = new Date(payload.iat! * 1000).toString();
    const tokenVersionInDB = deviceSession.iatDate.toString();
    if (tokenVersionFromPayload !== tokenVersionInDB) {
      throw new UnauthorizedException();
    }
    request.user = payload.userId;
    request.deviceId = payload.deviceId;
    return true;
  }
}
