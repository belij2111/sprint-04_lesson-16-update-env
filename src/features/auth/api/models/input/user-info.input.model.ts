import { TrimIsString } from '../../../../../core/decorators/validate/trim-is-string';

export class UserInfoInputModel {
  @TrimIsString()
  userId: string;
}
