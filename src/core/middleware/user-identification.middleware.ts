import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsersRepository } from '../../features/users/infrastructure/users.repository';

@Injectable()
export class UserIdentificationMiddleware implements NestMiddleware {
  constructor(private readonly usersRepository: UsersRepository) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Basic')) {
      const token = authHeader.split(' ')[1];
      const credentials = Buffer.from(token, 'base64').toString('utf-8');
      const [loginOrEmail, password] = credentials.split(':');
      // const loginOrEmail: string = { loginOrEmail, password };
      const userId =
        await this.usersRepository.findByLoginOrEmail(loginOrEmail);
      console.log('userId: ', loginOrEmail);
      if (userId) {
        req.user = { user: userId };
      }
    }
    next();
  }
}
