import {
  Controller,
  Post,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { LocalAuthGuard } from '../../../common/guards/local-auth.guard';
import { Request as ExpressRequest } from 'express';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: ExpressRequest) {
    return this.authService.login(req.user);
  }
}
