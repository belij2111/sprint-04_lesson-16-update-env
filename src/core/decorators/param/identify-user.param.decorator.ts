import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const IdentifyUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): string | null => {
    const request = context.switchToHttp().getRequest();
    console.log('IdentifyUser: ', request.headers.authorization);

    if (request.user) {
      return request.user;
    }
    return null;
  },
);
