// FIXME Does it make sense to do that in base config, just as a
//       override for TS files?
module.exports = (base) => ({
  ...base,
  parser: '@typescript-eslint/parser',
  plugins: [...base.plugins, '@typescript-eslint'],
  rules: {
    ...base.rules,

    '@typescript-eslint/array-type': ['error', { default: 'generic' }],
    '@typescript-eslint/prefer-optional-chain': ['error'],

    // @typescript-eslint rules counterparts
    ...['no-shadow', 'no-unused-vars'].reduce(
      (rules, name) => ({
        ...rules,
        [name]: 'off',
        [`@typescript-eslint/${name}`]: base.rules[name],
      }),
      {}
    ),
  },
  overrides: [
    // Empty override to enable linting TS files by default
    // See https://github.com/eslint/rfcs/blob/main/designs/2019-additional-lint-targets/
    { files: ['*.ts', '*.tsx'] },
  ],
})
