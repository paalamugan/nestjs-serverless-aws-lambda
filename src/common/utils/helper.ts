import { Environment } from '@app/types/env';
import { resolve } from 'path';

export const getGoogleFormResponseUrl = (formId: string) => {
  return `https://docs.google.com/forms/u/0/d/e/${formId}/formResponse`;
};

export function getEnvPaths(destination: string): string[] {
  const envName = Environment[process.env.NODE_ENV] || Environment.development;

  const paths = [
    resolve(destination, `.env.${envName}.local`),
    resolve(destination, `.env.${envName}`),
    resolve(destination, `.env`),
  ];

  // Don't include .env.local if NODE_ENV is test
  if (envName !== Environment.test) {
    paths.splice(2, 0, resolve(destination, '.env.local'));
  }

  return paths;
}
