import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { SendGoogleFormService } from './send-google-form.service';
import { SendGoogleFormRequestDto } from './send-google-form.dto';

@Controller()
export class SendGoogleFormController {
  constructor(private readonly sendGoogleFormService: SendGoogleFormService) {}

  @Post('/sendForm')
  @HttpCode(200)
  sendForm(@Body() sendGoogleFormData: SendGoogleFormRequestDto) {
    const result = this.sendGoogleFormService.sendDataToGoogleForm(sendGoogleFormData);
    return result;
  }
}
