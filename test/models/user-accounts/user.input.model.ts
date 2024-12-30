import { UserCreateModel } from '../../../src/features/user-accounts/users/api/models/input/create-user.input.model';

export const createValidUserModel = (count: number = 1): UserCreateModel => {
  const userModel = new UserCreateModel();
  userModel.login = `User_${count}`;
  userModel.password = `qwerty_${count}`;
  userModel.email = `user_${count}@gmail.com`;
  return userModel;
};

export const createInValidUserModel = (count: number = 1): UserCreateModel => {
  const invalidUserModel = new UserCreateModel();
  invalidUserModel.login = `User_${count}`;
  invalidUserModel.password = `qwerty_${count}`;
  invalidUserModel.email = `invalid email${count}`;
  return invalidUserModel;
};
