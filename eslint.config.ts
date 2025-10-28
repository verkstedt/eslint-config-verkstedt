import { fileURLToPath } from 'node:url';
import { defineConfig } from 'eslint/config';
import createVerkstedtConfig from './eslint/index.ts';

export default defineConfig(
  await createVerkstedtConfig({
    dir: fileURLToPath(new URL('.', import.meta.url)),
    ignore: [],
    allowDefaultProject: ['*.config.ts'],
  }),
);
