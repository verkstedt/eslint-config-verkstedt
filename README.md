# eslint-config-verkstedt

ESLint and Prettier config

## Integration

- First, install the package along with it’s peer dependencies:

  ```sh
  npx install-peerdeps --dev @verkstedt/eslint-config-verkstedt
  ```

  <details><summary>… or if you use yarn</summary>

  ```sh
  npx install-peerdeps --yarn --dev @verkstedt/eslint-config-verkstedt
  ```

  </details>

- Then:

  <!-- KEEP VERSIONS HERE IN SYNC WITH package.json -->

  - If your project uses TypeScript:

    ```sh
    npm install --save-dev "typescript@^5.2.2" "@typescript-eslint/eslint-plugin@^7.3.1" "@typescript-eslint/parser@^7.3.1"
    ```

    <details><summary>… or if you use yarn</summary>

    ```sh
    yarn add --dev "typescript@^5.2.2" "@typescript-eslint/eslint-plugin@^7.3.1" "@typescript-eslint/parser@^7.3.1"
    ```

    </details>

  - If your project _does not_ use TypeScript, but uses Babel:

    ```sh
    npm install --save-dev "@babel/core@^7.24.3" "@babel/eslint-parser@^7.24.1"
    ```

    <details><summary>… or if you use yarn</summary>

    ```sh
    yarn add --dev "@babel/core@^7.24.3" "@babel/eslint-parser@^7.24.1"
    ```

    </details>

- In your EsLint config use one of those for `extends`:

  | ↓ use this \\ if your project uses →        | Babel  | TypeScript | React | Next.js |
  | ------------------------------------------- | :----: | :--------: | :---: | :-----: |
  | `@verkstedt/verkstedt/typescript-react`[^1] | ☑ /✖️ |     ☑     |  ☑   |   ✖️    |
  | `@verkstedt/verkstedt/typescript-next`      | ☑ /✖️ |     ☑     |  ☑   |   ☑    |
  | `@verkstedt/verkstedt/typescript`           | ☑ /✖️ |     ☑     |  ✖️   |   ✖️    |
  | `@verkstedt/verkstedt/next`                 | ☑ /✖️ |     ✖️     |  ☑   |   ☑    |
  | `@verkstedt/verkstedt/react`                |   ☑   |     ✖️     |  ☑   |   ✖️    |
  | `@verkstedt/verkstedt/babel`                |   ☑   |     ✖️     |  ✖️   |   ✖️    |
  | `@verkstedt/verkstedt/vanilla`              |   ✖️   |     ✖️     |  ✖️   |   ✖️    |

  [^1]: `@verkstedt/verkstedt/typescript-react` is also aliased as `@verkstedt/verkstedt`.

  E.g. make your `.eslintrc.cjs` the following:

  ```js
  module.exports = {
    extends: ['@verkstedt/verkstedt/typescript-next'],
  }
  ```

- Add the following `.prettierrc.json`:

  ```json
  "@verkstedt/eslint-config-verkstedt/prettier-config"
  ```

  You probably also want `.prettierignore` with something like:

  ```gitignore
  /.next/
  /node_modules/
  ```

  If you have any generated files (e.g. lingui locales), also add them
  in there.

- Add the following to `stylelint.config.cjs`:
  ```js
  module.exports = require('@verkstedt/eslint-config-verkstedt/stylelint-config')
  ```

## Upgrading

Use the same commands as in previous section.

After upgrading, review if all of your projects EsLint rule overwrites
are still needed.

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

- `peerDependencies` — stuff that needs to be installed as a direct dependency of a project using this config. These are packages that provide binaries (`eslint`, `prettier`, `stylelint`) as well as some weird packages that don’t work as regular dependency _cough_ `eslint-plugin-prettier` _cough_).

- `devDependencies` — stuff required to run `npm run lint` in _this_ repository. It’s `peerDependencies` and `optionalDependencies` merged together
