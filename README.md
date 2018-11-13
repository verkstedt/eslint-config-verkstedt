# eslint-config-verkstedt
ESLint config

## Integration

- `yarn add --dev @verkstedt/eslint-config-verkstedt`
- Add the following `.eslintrc`:

```
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
