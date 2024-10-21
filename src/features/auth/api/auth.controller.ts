import {
  Controller,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { LocalAuthGuard } from '../../../common/guards/local-auth.guard';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { UserInfoInputModel } from './models/input/user-info.input.model';
import { LoginSuccessViewModel } from './models/output/login-success.view.model';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: ExpressRequest, @Res() res: ExpressResponse) {
    const result = await this.authService.login(req.user as UserInfoInputModel);
    const { accessToken, refreshToken } = result as LoginSuccessViewModel;
    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .json({ accessToken });
    return;
  }
}
