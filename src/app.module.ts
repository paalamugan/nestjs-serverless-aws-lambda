import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validate } from './validation/env.validation';
import { SendGoogleFormModule } from './send-google-form/send-google-form.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
    }),
    SendGoogleFormModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
