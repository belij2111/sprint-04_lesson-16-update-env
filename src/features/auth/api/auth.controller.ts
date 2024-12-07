import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { LocalAuthGuard } from '../../../core/guards/local-auth.guard';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { UserInfoInputModel } from './models/input/user-info.input.model';
import { LoginSuccessViewModel } from './models/view/login-success.view.model';
import { CurrentUserId } from '../../../core/decorators/param/current-user-id.param.decorator';
import { UsersQueryRepository } from '../../users/infrastructure/users.query-repository';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { UserCreateModel } from '../../users/api/models/input/create-user.input.model';
import { RegistrationConfirmationCodeModel } from './models/input/registration-confirmation-code.model';
import { RegistrationEmailResendingModel } from './models/input/registration-email-resending.model';
import { PasswordRecoveryInputModel } from './models/input/password-recovery-input.model';
import { NewPasswordRecoveryInputModel } from './models/input/new-password-recovery-input.model';
import { RefreshTokenGuard } from '../../../core/guards/refresh-token.guard';
import { CurrentDeviceId } from '../../../core/decorators/param/current-device-id.param.decorator';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Req() req: ExpressRequest,
    @Res() res: ExpressResponse,
    @Req() { user }: UserInfoInputModel,
  ) {
    if (!req.ip) {
      throw new NotFoundException('IP address is required');
    }
    if (!req.headers['user-agent']) {
      throw new NotFoundException('User agent is required');
    }
    const ip = req.ip;
    const deviceName = req.headers['user-agent'];
    const result = await this.authService.login(user, ip, deviceName);
    const { accessToken, refreshToken } = result as LoginSuccessViewModel;
    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .json({ accessToken });
    return;
  }

  @Post('/refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  async refreshToken(
    @Res() res: ExpressResponse,
    @Req() { user, deviceId }: UserInfoInputModel,
  ) {
    const result = await this.authService.refreshToken(user, deviceId);
    const { accessToken, refreshToken } = result as LoginSuccessViewModel;
    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .json({ accessToken });
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  @HttpCode(HttpStatus.OK)
  async get(@CurrentUserId() currentUserId: string) {
    return this.usersQueryRepository.getAuthUserById(currentUserId);
  }

  @Post('/registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() userCreateModel: UserCreateModel) {
    await this.authService.registerUser(userCreateModel);
  }

  @Post('/registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(
    @Body()
    registrationConfirmationCodeModel: RegistrationConfirmationCodeModel,
  ) {
    await this.authService.confirmationRegistrationUser(
      registrationConfirmationCodeModel,
    );
  }

  @Post('/registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(
    @Body() registrationEmailResendingModel: RegistrationEmailResendingModel,
  ) {
    await this.authService.registrationEmailResending(
      registrationEmailResendingModel,
    );
  }

  @Post('/password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(
    @Body() passwordRecoveryInputModel: PasswordRecoveryInputModel,
  ) {
    await this.authService.passwordRecovery(passwordRecoveryInputModel);
  }

  @Post('/new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async newPassword(
    @Body() newPasswordRecoveryInputModel: NewPasswordRecoveryInputModel,
  ) {
    await this.authService.newPassword(newPasswordRecoveryInputModel);
  }

  @Post('/logout')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Res() res: ExpressResponse,
    @CurrentDeviceId() deviceId: string,
  ) {
    await this.authService.logout(deviceId);
    res.clearCookie('refreshToken').json({});
    return;
  }
}
