import { TrimIsString } from '../../../../../common/decorators/validate/trim-is-string';

export class UserInfoInputModel {
  @TrimIsString()
  userId: string;
}
