# `@verkstedt/lint`

Linting configuration for verkstedt projects

## Links

- [🗪 Chat](https://app.slack.com/client/T6HMM3NG2/C8U48QUBA)
- [🗒 Tasks](https://verkstedt.atlassian.net/jira/software/projects/VIP/boards/12?jql=labels%20%3D%20lint)

## Design

See [DESIGN.md](./DESIGN.md).

## Installation

### Automatic

```sh
npx @verkstedt/lint@latest .
```

### Manual

<details>

1. Install:

   ```sh
   npm install --save-dev eslint prettier @verkstedt/lint
   ```

   If you are using TypeScript, also:

   ```sh
   npm install --save-dev jiti
   ```

2. Make your `tsconfig.json` extend ours:

   ```json
   {
     "$schema": "https://json.schemastore.org/tsconfig",
     "extends": "@verkstedt/lint/tsconfig",
   ```

3. Create `prettier.config.ts` (or `prettier.config.mjs`)

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

4. Create `eslint.config.ts` (or `eslint.config.mjs`)

   <!-- ESLINT_CONFIG -- Marker used for extracting code by install.sh -->

   ```mjs
   import { fileURLToPath } from 'node:url';
   import { defineConfig } from 'eslint/config';
   import { createVerkstedtConfig } from '@verkstedt/lint/eslint';

   export default defineConfig([
     await createVerkstedtConfig({
       dir: fileURLToPath(new URL('.', import.meta.url)),
       // If you have TypeScript files that are NOT included in your tsconfig (e.g.
       // config files or scripts), you specify them here.
       // https://typescript-eslint.io/packages/parser/#allowdefaultproject
       allowDefaultProject: [],
     }),
   ]);
   ```

</details>

### First run

```sh
npx eslint .
```

Running this for the first time might ask you to install some additional
packages.

## Tests

Tests are organised as separate packages. They are set up as [npm workspaces].
Running `npm test` will run `eslint` in all of the workspace test
packages.

[npm workspaces]: https://docs.npmjs.com/cli/v8/using-npm/workspaces

## Debugging

Run with `NODE_DEBUG=@verkstedt/lint` to see some debug logs.

## License

[ISC](./LICENSE)
