# `@verkstedt/lint`

Linting configuration for verkstedt projects

## Links

- [🗪 Chat](https://app.slack.com/client/T6HMM3NG2/C8U48QUBA)
- [🗒 Tasks](https://verkstedt.atlassian.net/jira/software/projects/VIP/boards/12?jql=labels%20%3D%20lint)

## Usage

### EsLint and Prettier

1. Install:

   ```sh
   npm install --save-dev eslint prettier @verkstedt/lint
   ```

2. Create `prettier.config.mjs`:

   ```mjs
   export * from '@verkstedt/lint/prettier';
   export { default as default } from '@verkstedt/lint/prettier';
   ```

   …and an empty `.prettierignore`:

   ```sh
   touch .prettierignore
   ```

   > [!NOTE]
   > EsLint is set up to also use Prettier, so you don’t have to run it
   > separately, but you can, if you e.g. want to do just the
   > formatting in your editor.

3. Create `eslint.config.js`:

   ```mjs
   import { fileURLToPath } from 'node:url';
   import { defineConfig } from 'eslint/config';
   import { includeIgnoreFile } from 'eslint/compat';
   import { createVerkstedtConfig } from '@verkstedt/lint';

   export default defineConfig([
     // If you want to ignore files, specify them in `.prettierignore`,
     // so that they are also ignored by Prettier.
     // Verkstedt config automatically ignores files specified in
     // `.gitignore` in the same directory as this config file in
     // addition to some other commonly ignored files.
     includeIgnoreFile(
       fileURLToPath(new URL('./.prettierignore', import.meta.url)),
     ),
     await createVerkstedtConfig({
       dir: fileURLToPath(import.meta.url),
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
