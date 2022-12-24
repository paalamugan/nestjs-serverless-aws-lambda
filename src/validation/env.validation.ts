import { Environment } from '@app/types/env';
import { plainToInstance } from 'class-transformer';
import { IsEnum, IsString, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  GOOGLE_FORM_ID: string;

  // @IsNumber()
  // PORT?: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length <= 0) {
    return validatedConfig;
  }

  for (const error of errors) {
    const { property, value, constraints } = error;

    if (constraints) {
      const message = Object.values(constraints).join(', ') + `. But we got: ${property}=${value}`;
      throw new Error(message);
    }
  }
}
