import { TrimIsString } from '../../../../../common/decorators/validate/trim-is-string';

export class RegistrationConfirmationCodeModel {
  @TrimIsString()
  code: string;
}
