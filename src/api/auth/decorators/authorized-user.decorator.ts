import {
  createParamDecorator,
  type ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { type UserDocument } from 'src/api/user/schema/user.schema';

export const AuthorizedUser = createParamDecorator(
  (data: keyof UserDocument, ctx: ExecutionContext) => {
    const request: Request & { user: UserDocument } = ctx
      .switchToHttp()
      .getRequest();

    const user = request.user;

    if (!user) {
      throw new UnauthorizedException();
    }

    return (data ? user[data] : user) as UserDocument | typeof data;
  },
);
