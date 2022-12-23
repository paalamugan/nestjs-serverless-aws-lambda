import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import serverlessExpress from '@vendia/serverless-express';
import { Context, Handler } from 'aws-lambda';
import express from 'express';

import { AppModule } from './app.module';

let cachedServer: Handler;

async function bootstrap() {
  if (cachedServer) {
    return cachedServer;
  }

  const expressApp = express();
  const nestApp = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(expressApp));

  nestApp.enableCors();
  nestApp.disable('x-powered-by');

  await nestApp.init();

  cachedServer = serverlessExpress({ app: expressApp });
  return cachedServer;
}

export const handler = async (event: any, context: Context, callback: any) => {
  const server = await bootstrap();
  return server(event, context, callback);
};
