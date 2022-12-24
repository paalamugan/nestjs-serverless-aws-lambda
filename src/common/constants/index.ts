import { Environment } from '@app/types/env';

export const environmentMap = {
  [Environment.dev]: 'development',
  [Environment.prod]: 'production',
  [Environment.test]: 'test',
} as const;
