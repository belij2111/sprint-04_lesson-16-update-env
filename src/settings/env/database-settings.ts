import { EnvironmentVariable } from './configuration';
import { IsString } from 'class-validator';

export class DatabaseSettings {
  constructor(private environmentVariables: EnvironmentVariable) {}
  @IsString()
  MONGO_URL: string = this.environmentVariables.MONGO_URL;

  @IsString()
  MONGO_URL_FOR_TESTS: string = this.environmentVariables.MONGO_URL_FOR_TESTS;

  @IsString()
  COLLECTION_NAME = {
    USERS: this.environmentVariables.USERS_COLLECTION_NAME,
    BLOGS: this.environmentVariables.BLOGS_COLLECTION_NAME,
    POSTS: this.environmentVariables.POSTS_COLLECTION_NAME,
  };
}
