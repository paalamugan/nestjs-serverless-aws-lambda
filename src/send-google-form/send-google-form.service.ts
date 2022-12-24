import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendGoogleFormRequestDto, SendGoogleFormResponseDto } from './send-google-form.dto';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { getGoogleFormResponseUrl } from '@app/common/utils/helper';
import { GoogleFormConfigType } from '@app/config/googleForm.config';
import * as cheerio from 'cheerio';

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

  getGoogleFormDataFields() {
    const googleFormDataField = this.config.get<GoogleFormConfigType['googleFormDataField']>('googleFormDataField');
    return Object.entries(googleFormDataField);
  }

  getGoogleFormDataFieldKey(fieldValue: string) {
    const googleFormDataFields = this.getGoogleFormDataFields();
    console.log(
      '🚀 ~ file: send-google-form.service.ts:35 ~ SendGoogleFormService ~ getGoogleFormDataFieldKey ~ googleFormDataFields',
      googleFormDataFields,
    );
    const [key] = googleFormDataFields.find(([, value]) => value === fieldValue);
    return key;
  }

  getGoogleFormSearchParams(payload: SendGoogleFormRequestDto) {
    const googleFormDataFields = this.getGoogleFormDataFields();

    const searchParams = new URLSearchParams();

    for (const [key, value] of googleFormDataFields) {
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

    this.logger.log(`[Google Form] - req url: ${googleFormUrl}`);
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
            const $ = cheerio.load(error.response.data as string);
            const invalidInput = $(':is(form div[data-params]):has(span:contains("This is a required question"))');
            const dataParamsValue = invalidInput.attr('data-params');

            if (!dataParamsValue) {
              throw new BadRequestException('Something went wrong, Please try again later!');
            }

            const invalidFieldId = dataParamsValue.split(',')[4].slice(2);
            const fieldKey = this.getGoogleFormDataFieldKey(invalidFieldId);

            throw new BadRequestException(fieldKey ? `${fieldKey} field is required!` : 'Invalid field!');
          }),
        ),
    );
    this.logger.log('[Google Form] - Successfully submitted!');
    return { success: true };
  }
}
