# eslint-config-verkstedt

ESLint and Prettier config

## Integration

- `yarn add --dev @verkstedt/eslint-config-verkstedt@latest`

- If it does use TypeScript:

  ```sh
  yarn add --dev typescript@^4.5.4 @typescript-eslint/eslint-plugin@^5.10.0 @typescript-eslint/parser@^5.10.0
  ```

- If your project _does not_ use TypeScript, but uses Babel:

  ```sh
  yarn add --dev @babel/core@^7.16.7 @babel/eslint-parser@^7.16.5
  ```

- In your EsLint config use one of those for `extend`:

  - `@verkstedt/verkstedt/typescript-react` for React TypeScript
    _Alias: `@verkstedt/verkstedt`_
  - `@verkstedt/verkstedt/typescript` for React–less TypeScript
  - `@verkstedt/verkstedt/react` for React JavaScript projects using Babel
  - `@verkstedt/verkstedt/babel` for React–less JavaScript projects using Babel
  - `@verkstedt/verkstedt/vanilla` for React–less JavaScript projects

- Add the following `.prettierrc.js`:

  ```json
  module.exports = require('@verkstedt/eslint-config-verkstedt/prettier-config')
  ```

## VIM integration

Install [ale](https://github.com/w0rp/ale) and add the following in your `.vimrc`:

```
" Ale
let g:ale_linters = {
\   'javascript': ['eslint'],
\   'html': ['htmlhint'],
\}

let g:ale_fixers = {
\   'javascript': ['eslint'],
\}

let g:ale_fix_on_save = 1
```
