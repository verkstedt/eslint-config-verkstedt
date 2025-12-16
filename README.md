# `@verkstedt/lint`

Linting configuration for verkstedt projects

## Links

- [🗪 Chat](https://app.slack.com/client/T6HMM3NG2/C8U48QUBA)
- [🗒 Tasks](https://verkstedt.atlassian.net/jira/software/projects/VIP/boards/12?jql=labels%20%3D%20lint)

## Installation

### Automatic

```sh
npx @verkstedt/lint@latest .
```

### Manual

1. Install:

   ```sh
   npm install --save-dev eslint prettier @verkstedt/lint
   ```

2. Create `prettier.config.ts` (or `prettier.config.mjs`)

   <!-- PRETTIER_CONFIG -- Marker used for extracting code by install.sh -->

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

3. Create `eslint.config.ts` (or `eslint.config.mjs`)

   <!-- ESLINT_CONFIG -- Marker used for extracting code by install.sh -->

   ```mjs
   import { fileURLToPath } from 'node:url';
   import { defineConfig } from 'eslint/config';
   import { createVerkstedtConfig } from '@verkstedt/lint/eslint';

   export default defineConfig([
     await createVerkstedtConfig({
       dir: fileURLToPath(new URL('.', import.meta.url)),
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
