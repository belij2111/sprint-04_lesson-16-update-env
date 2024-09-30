import { EnvironmentVariable } from './configuration';
import { IsNumber } from 'class-validator';

export class ApiSettings {
  constructor(private environmentVariables: EnvironmentVariable) {}
  @IsNumber()
  PORT: number = Number(this.environmentVariables.PORT);
  PATH = {
    USERS: this.environmentVariables.USERS_PATH,
    BLOGS: this.environmentVariables.BLOGS_PATH,
    POSTS: this.environmentVariables.POSTS_PATH,
    TESTING: this.environmentVariables.TESTING_PATH,
  };
}
