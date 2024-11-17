import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { verify, JwtPayload } from 'jsonwebtoken';

interface CustomJwtPayload extends JwtPayload {
  userId: string;
}

export const IdentifyUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): string | null => {
    const request = context.switchToHttp().getRequest();
    // console.log('IdentifyUser: ', request.headers.authorization);
    const authHeader = request.headers.authorization;

    if (request.user) {
      return request.user;
    }
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const secret = '123456789';
      const payload = verify(
        token,
        secret, // configService.get('apiSettings.ACCESS_TOKEN_SECRET', { infer: true }),
      ) as CustomJwtPayload;
      return payload.userId;
    }
    return null;
  },
);
