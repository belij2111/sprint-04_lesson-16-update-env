import { TrimIsString } from '../../../../../core/decorators/validate/trim-is-string';

export class RegistrationConfirmationCodeModel {
  @TrimIsString()
  code: string;
}
