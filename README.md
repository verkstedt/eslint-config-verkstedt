# eslint-config-verkstedt

ESLint and Prettier config

## Integration

- First, install the package along with it’s peer dependencies:

  ```sh
  npx install-peerdeps --dev @verkstedt/eslint-config-verkstedt
  # or if you use yarn
  npx install-peerdeps --yarn --dev @verkstedt/eslint-config-verkstedt
  ```

- Then:

  - If your project uses TypeScript:

    ```sh
    npm install --save-dev "typescript@^4.5.4" "@typescript-eslint/eslint-plugin@^5.10.0" "@typescript-eslint/parser@^5.10.0"
    # or if you use yarn
    yarn add --dev "typescript@^4.5.4" "@typescript-eslint/eslint-plugin@^5.10.0" "@typescript-eslint/parser@^5.10.0"
    ```

  - If your project _does not_ use TypeScript, but uses Babel:

    ```sh
    npm install --sae-dev "@babel/core@^7.16.7" "@babel/eslint-parser@^7.16.5"
    # or if you use yarn
    yarn add --dev "@babel/core@^7.16.7" "@babel/eslint-parser@^7.16.5"
    ```

- In your EsLint config use one of those for `extends`:

  ↓ use this \\ if your project uses →        | Babel | TypeScript | React | Next.js |
  --------------------------------------------|:-----:|:----------:|:-----:|:-------:|
  `@verkstedt/verkstedt/typescript-react`[^1] | ☑ /✖️  |     ☑      |  ☑    |   ✖️     |
  `@verkstedt/verkstedt/typescript-next`      | ☑ /✖️  |     ☑      |  ☑    |   ☑     |
  `@verkstedt/verkstedt/typescript`           | ☑ /✖️  |     ☑      |  ✖️    |   ✖️     |
  `@verkstedt/verkstedt/next`                 | ☑ /✖️  |     ✖️      |  ☑    |   ☑     |
  `@verkstedt/verkstedt/react`                |  ☑    |     ✖️      |  ☑    |   ✖️     |
  `@verkstedt/verkstedt/babel`                |  ☑    |     ✖️      |  ✖️    |   ✖️     |
  `@verkstedt/verkstedt/vanilla`              |  ✖️    |     ✖️      |  ✖️    |   ✖️     |

  [^1]: `@verkstedt/verkstedt/typescript-react` is also aliased as `@verkstedt/verkstedt`.

  E.g. make your `.eslintrc.cjs` the following:

  ```js
  module.exports = {
    extends: ['@verkstedt/verkstedt/typescript-next'],
  }
  ```

- Add the following `.prettierrc.cjs`:

  ```js
  module.exports = require('@verkstedt/eslint-config-verkstedt/prettier-config')
  ```

  You probably also want `.prettierignore` with something like:

  ```
  /.next
  /node_modules
  ```

- Add the following to `stylelint.config.cjs`:
  ```js
  module.exports = require('@verkstedt/eslint-config-verkstedt/stylelint-config')
  ```

## VIM integration

We recommend to use [CoC][vim-coc] with `coc-eslint` extension.

[vim-coc]: https://github.com/neoclide/coc.nvim

## VS Code Integration

To get this working with VS Code, you will first need to install the [Prettier - Code formatter extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

Next, add the following values to global settings, or to to your per project folder settings (`./.vscode/settings.json`):

```json
  // probably best to use these only in workspace or
  // folder config, and not in global settings:
  "prettier.useEditorConfig": false,
  "eslint.format.enable": true,
  // Per language settings:
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  }
```

## Note on dependencies of this project

- `dependencies` — the usual

- `devDependencies` — stuff required to run `npm run lint` in _this_ repository
-
- `peerDependencies` — stuff that needs to be installed as a direct dependency of a project using this config. These are packages that provide binaries (`eslint`, `prettier`, `stylelint`) as well as some weird packages that don’t work as regular dependency _cough_ `eslint-plugin-prettier` _cough_).
-
- `optionalDependencies` — stuff that might be needed depending on the preset you’ll need to use. Make sure that versions there are being kept in sync with versions used in commands in [“Integration” section](#integration).
