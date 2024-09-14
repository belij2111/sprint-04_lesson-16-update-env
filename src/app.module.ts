import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { appSettings } from './settings/config';
import { UserSchema } from './features/users/domain/user.entity';

@Module({
  imports: [
    MongooseModule.forRoot(appSettings.getMongoUrl()),
    MongooseModule.forFeature([
      { name: appSettings.getCollectionNames().USERS, schema: UserSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
