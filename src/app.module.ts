import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { appSettings } from './settings/config';
import { UsersModule } from './features/users/users.module';
import { ContentModule } from './features/content/content.module';

@Module({
  imports: [
    UsersModule,
    ContentModule,
    MongooseModule.forRoot(appSettings.getMongoUrl()),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
