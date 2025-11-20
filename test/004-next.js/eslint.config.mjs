import { defineConfig } from 'eslint/config';
import createVerkstedtConfig from '@verkstedt/lint/eslint';
import { fileURLToPath } from 'node:url';

export default defineConfig([
  await createVerkstedtConfig({
    dir: fileURLToPath(new URL('.', import.meta.url)),
    // Files you don’t want to be linted, in addition to .gitignore from the
    // root for the project
    ignore: ['test/*/'],
    allowDefaultProject: [],
  }),
]);
