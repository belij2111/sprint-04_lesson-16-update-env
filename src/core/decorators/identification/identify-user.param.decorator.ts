import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const IdentifyUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): string | null => {
    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      return null;
    }
    return request.user;
  },
);
