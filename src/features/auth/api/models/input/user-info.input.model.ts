import { TrimIsString } from '../../../../../core/decorators/validation/trim-is-string';

export class UserInfoInputModel {
  @TrimIsString()
  userId: string;
}
