import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { GlobalConfigType } from './config/global.config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { logger: ['error', 'log'] });

  const configService = app.get(ConfigService<GlobalConfigType>);
  await app.listen(configService.get('port'));

  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
