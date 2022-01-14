# eslint-config-verkstedt

ESLint and Prettier config

## Integration

- `yarn add --dev @verkstedt/eslint-config-verkstedt@latest`

- `npx install-peerdeps --yarn --dev @verkstedt/eslint-config-verkstedt@latest`

- In your EsLint config use one of those for `extend`:

  - `@verkstedt/verkstedt/base` for react–less JavaScript projects
  - `@verkstedt/verkstedt/typescript` for react–less TypeScript
  - `@verkstedt/verkstedt/react` for react JavaScript projects
  - `@verkstedt/verkstedt/typescript-react` for react TypeScript projects
    Alias: `@verkstedt/verkstedt`

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
