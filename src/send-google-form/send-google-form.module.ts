import { Module } from '@nestjs/common';
import { SendGoogleFormController } from './send-google-form.controller';
import { SendGoogleFormService } from './send-google-form.service';
import { HttpModule } from '@nestjs/axios';
import { googleFormConfig } from '@app/config/googleForm.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      load: [googleFormConfig],
    }),
  ],
  controllers: [SendGoogleFormController],
  providers: [SendGoogleFormService],
})
export class SendGoogleFormModule {}
