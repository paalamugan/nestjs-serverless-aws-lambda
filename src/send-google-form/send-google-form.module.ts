import { Module } from '@nestjs/common';
import { SendGoogleFormController } from './send-google-form.controller';
import { SendGoogleFormService } from './send-google-form.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [SendGoogleFormController],
  providers: [SendGoogleFormService],
})
export class SendGoogleFormModule {}
