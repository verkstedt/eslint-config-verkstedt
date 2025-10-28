# `@verkstedt/lint`

Linting configuration for verkstedt projects

## Usage

### EsLint and Prettier

1. Install:

   ```sh
   npm install --save-dev eslint @verkstedt/lint
   ```

2. Create `prettier.config.mjs`:

   ```mjs
   export * from '@verkstedt/lint/prettier';
   export { default as default } from '@verkstedt/lint/prettier';
   ```

   > [!NOTE]
   > EsLint is set up to also use Prettier.

3. Create `eslint.config.js`:

   ```mjs
   import { fileURLToPath } from 'node:url';
   import { defineConfig } from 'eslint/config';
   import { createVerkstedtConfig } from '@verkstedt/lint';

   export default defineConfig([
     await createVerkstedtConfig({
       dir: fileURLToPath(new URL('.', import.meta.url)),
       // Files you don’t want to be linted, in addition to .gitignore from the
       // root for the project
       // https://eslint.org/docs/latest/use/configure/ignore#name-the-global-ignores-config
       ignore: [],
       // If you have TypeScript files that are NOT included in your tsconfig (e.g.
       // config files), you specify them here.
       // https://typescript-eslint.io/packages/parser/#allowdefaultproject
       allowDefaultProject: [],
     }),
   ]);
   ```

4. Run:

   ```sh
   npx eslint .
   ```

   Running this for the first time will most likely ask you to install
   some additional npm packages.

## Debugging

Run with `NODE_DEBUG=@verkstedt/lint` to see some debug logs.

## License

[ISC](./LICENSE)
