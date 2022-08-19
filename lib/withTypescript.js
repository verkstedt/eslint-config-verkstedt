module.exports = (base) => ({
  ...base,
  parser: '@typescript-eslint/parser',
  plugins: [...base.plugins, '@typescript-eslint'],
  rules: {
    ...Object.fromEntries(
      Object.fromEntries(base).map(([name, value]) =>
        // In typescript we don’t use prop types and default props, but
        // instead rely on props’s interfaces and function default values
        name === 'react/require-default-props' ? [name, 'off'] : [name, value]
      )
    ),

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
    ...base.overrides,
    // Empty override to enable linting TS files by default
    // See https://github.com/eslint/rfcs/blob/main/designs/2019-additional-lint-targets/
    { files: ['*.ts', '*.tsx'] },
  ],
})
