import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendGoogleFormRequestDto, SendGoogleFormResponseDto } from './send-google-form.dto';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { getGoogleFormResponseUrl } from '@app/common/utils/helper';
import { GoogleFormConfigType } from '@app/config/googleForm.config';

@Injectable()
export class SendGoogleFormService {
  private readonly logger = new Logger(SendGoogleFormService.name);

  @Inject(ConfigService)
  private config: ConfigService<GoogleFormConfigType>;

  constructor(private readonly httpService: HttpService) {}

  getGoogleFormUrl(): string {
    const googleFormId = this.config.get<GoogleFormConfigType['googleFormId']>('googleFormId');
    if (!googleFormId) {
      throw new BadRequestException('googleFormId is not configured!');
    }
    return getGoogleFormResponseUrl(googleFormId);
  }

  getGoogleFormSearchParams(payload: SendGoogleFormRequestDto) {
    const googleFormSearchParams = this.config.get<GoogleFormConfigType['googleFormDataField']>('googleFormDataField');

    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(googleFormSearchParams)) {
      const fieldValue = payload[key];
      if (!fieldValue) {
        throw new BadRequestException(`${key} field is required!`);
      }
      const fieldName = /^entry\./.test(value) ? value : `entry.${value}`;
      searchParams.append(fieldName, fieldValue);
    }

    return searchParams;
  }

  async sendDataToGoogleForm(payload: SendGoogleFormRequestDto): Promise<SendGoogleFormResponseDto> {
    const googleFormUrl = this.getGoogleFormUrl();
    const searchParams = this.getGoogleFormSearchParams(payload);

    this.logger.log(`[Google Form] - req body: ${searchParams.toString()}`);

    await firstValueFrom(
      this.httpService
        .post(googleFormUrl, searchParams, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw new BadRequestException('Please make sure that you have filled all the mandatory fields!');
          }),
        ),
    );
    this.logger.log('[Google Form] - Success', 'Form submitted successfully!');
    return { success: true };
  }
}
