# eslint-config-verkstedt
ESLint config

## Integration

- `yarn add --dev @verkstedt/eslint-config-verkstedt@latest`
- `npx install-peerdeps --yarn --dev @verkstedt/eslint-config-verkstedt@latest`
  (or `yarn add -D @verkstedt/eslint-config-verkstedt@latest $( npm info --json @verkstedt/eslint-config-verkstedt@latest peerDependencies | awk -vFS='"' '$2 { print $2 "@" $4 }' )`)
- Add the following `.eslintrc`:

  ```json
  {
    "extends": "@verkstedt/verkstedt"
  }
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
