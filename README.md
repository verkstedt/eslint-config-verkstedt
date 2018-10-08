# eslint-config-verkstedt
ESLint config

## Integration

- `yarn add --dev eslint babel-eslint eslint-config-verkstedt eslint-plugin-react`
- Add the following `.eslintrc`:

```
{
  "extends": "@verkstedt/verkstedt"
}
```

## Troubleshooting

Issue: **vim can't find the local `eslint` binary, because it's located under `node_modules`.**

Solution: There's a [nice workaround](http://blog.pixelastic.com/2015/10/05/use-local-eslint-in-syntastic/) for that, or use [ale](https://github.com/w0rp/ale).
