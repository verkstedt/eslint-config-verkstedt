# eslint-config-verkstedt


ESLint and Prettier config

## Integration

- `yarn add --dev @verkstedt/eslint-config-verkstedt@latest`

- If your project uses TypeScript:

  ```sh
  yarn add --dev typescript@^4.5.4 @typescript-eslint/eslint-plugin@^5.10.0 @typescript-eslint/parser@^5.10.0
  ```

- If your project _does not_ use TypeScript, but uses Babel:

  ```sh
  yarn add --dev @babel/core@^7.16.7 @babel/eslint-parser@^7.16.5
  ```

- In your EsLint config use one of those for `extends`:

  ↓ use this \\ if your project uses →        | Babel | TypeScript | React | Next.js |
  --------------------------------------------|:-----:|:----------:|:-----:|:-------:|
  `@verkstedt/verkstedt/typescript-react`[^1] | ☑ /✖️  |     ☑      |  ☑    |   ✖️     |
  `@verkstedt/verkstedt/typescript-next`      | ☑ /✖️  |     ☑      |  ☑    |   ☑     |
  `@verkstedt/verkstedt/typescript`           | ☑ /✖️  |     ☑      |  ✖️    |   ✖️     |
  `@verkstedt/verkstedt/react`                |  ☑    |     ✖️      |  ☑    |   ✖️     |
  `@verkstedt/verkstedt/babel`                |  ☑    |     ✖️      |  ✖️    |   ✖️     |
  `@verkstedt/verkstedt/vanilla`              |  ✖️    |     ✖️      |  ✖️    |   ✖️     |

  [^1]: `@verkstedt/verkstedt/typescript-react` is also aliased as `@verkstedt/verkstedt`.

- Add the following `.prettierrc.js`:

  ```js
  module.exports = require('@verkstedt/eslint-config-verkstedt/prettier-config')
  ```

## VIM integration

We recommend to use [CoC][vim-coc] with `coc-eslint` extension.

[vim-coc]: https://github.com/neoclide/coc.nvim
