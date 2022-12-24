import { environmentMap } from '@app/common/constants';
import { resolve } from 'path';

export const getGoogleFormResponseUrl = (formId: string) => {
  return `https://docs.google.com/forms/u/0/d/e/${formId}/formResponse`;
};

export function getEnvPaths(destination: string): string[] {
  const envName = environmentMap[process.env.NODE_ENV];

  return [
    resolve(destination, `.env.${envName}.local`),
    resolve(destination, '.env.local'),
    resolve(destination, `.env.${envName}`),
    resolve(destination, `.env`),
  ];
}
