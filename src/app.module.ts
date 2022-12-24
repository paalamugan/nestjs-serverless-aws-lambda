import { join } from 'path';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { globalConfig } from './config/global.config';
import { validate } from './validation/env.validation';
import { SendGoogleFormModule } from './send-google-form/send-google-form.module';
import { getEnvPaths } from './common/utils/helper';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: false,
      envFilePath: getEnvPaths(join(__dirname, 'common', 'envs')),
      isGlobal: true,
      cache: true,
      load: [globalConfig],
      validate,
    }),
    SendGoogleFormModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
