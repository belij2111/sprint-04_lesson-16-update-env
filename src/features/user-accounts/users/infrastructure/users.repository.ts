import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User, UserDocument, UserModelType } from '../domain/user.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

  async create(newUser: User): Promise<{ id: string }> {
    const result = await this.UserModel.create(newUser);
    return { id: result._id.toString() };
  }

  async delete(id: string): Promise<boolean> {
    const deletionResult = await this.UserModel.deleteOne({ _id: id });
    return deletionResult.deletedCount === 1;
  }

  async findByLoginOrEmail(loginOrEmail: string) {
    const filter = {
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    };
    return this.UserModel.findOne(filter);
  }

  async findByConfirmationCode(inputCode: string) {
    const filter = {
      'emailConfirmation.confirmationCode': inputCode,
      'emailConfirmation.expirationDate': { $gt: new Date() },
      'emailConfirmation.isConfirmed': false,
    };
    return this.UserModel.findOne(filter);
  }

  async updateEmailConfirmation(id: string, isConfirmed: boolean) {
    const result = await this.UserModel.updateOne(
      { _id: id },
      { $set: { 'emailConfirmation.isConfirmed': isConfirmed } },
    );
    return result.modifiedCount !== 0;
  }

  async updateRegistrationConfirmation(
    id: string,
    code: string,
    expirationDate: Date,
  ) {
    const result = await this.UserModel.updateOne(
      { _id: id },
      {
        $set: {
          'emailConfirmation.confirmationCode': code,
          'emailConfirmation.expirationDate': expirationDate,
        },
      },
    );
    return result.modifiedCount !== 0;
  }

  async updatePassword(id: string, newPasswordHash: string) {
    const result = await this.UserModel.updateOne(
      { _id: id },
      { $set: { password: newPasswordHash } },
    );
    return result.modifiedCount !== 0;
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({ _id: id });
  }

  async findByIdOrNotFoundFail(id: string) {
    const foundUser = await this.findById(id);
    if (!foundUser) {
      throw new UnauthorizedException(`User with id ${id} not found`);
    }
    return foundUser;
  }
}
