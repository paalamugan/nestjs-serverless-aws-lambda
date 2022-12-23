import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendGoogleFormRequestDto, SendGoogleFormResponseDto } from './send-google-form.dto';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class SendGoogleFormService {
  private readonly logger = new Logger(SendGoogleFormService.name);
  constructor(private readonly configService: ConfigService, private readonly httpService: HttpService) {}

  getGoogleFormUrl(): string {
    const googleFormUrl = this.configService.get<string>('googleFormUrl');
    if (!googleFormUrl) {
      throw new BadRequestException('googleFormUrl is not configured!');
    }
    return googleFormUrl;
  }

  async sendDataToGoogleForm(payload: SendGoogleFormRequestDto): Promise<SendGoogleFormResponseDto> {
    const { name, email, contactNumber, serviceRequired } = payload;

    if (!name) {
      throw new BadRequestException('name field is required!');
    }
    if (!email) {
      throw new BadRequestException('email field is required!');
    }
    if (!contactNumber) {
      throw new BadRequestException('contactNumber field is required!');
    }
    if (!serviceRequired || serviceRequired === '---') {
      throw new BadRequestException('serviceRequired field is required!');
    }

    const googleFormUrl = this.getGoogleFormUrl();

    const searchParams = new URLSearchParams();
    searchParams.append('entry.1107925060', name);
    searchParams.append('entry.1315868081', email);
    searchParams.append('entry.1700347251', contactNumber);
    searchParams.append('entry.1062054307', serviceRequired);
    this.logger.log('[Google Form] - req body: ?', searchParams.toString());

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
            throw new BadRequestException(
              'Something went wrong! You can try again later, (OR) Please make sure you have filled all the mandatory fields!',
            );
          }),
        ),
    );
    this.logger.log('[Google Form] - Success', 'Form submitted successfully!');
    return { success: true };
  }
}
