// FIXME Does it make sense to do that in base config, just as a
//       override for TS files?
module.exports = (base) => ({
  ...base,
  plugins: [...base.plugins, '@typescript-eslint'],
  parserOptions: {
    ...base.parserOptions,
    // Would make more sense to put it in override for TS files below,
    // but keeping it here makes it easier to override on project level.
    // And non–TS parser will ignore this property anyway.
    project: 'tsconfig.json',
  },
  overrides: [
    ...base.overrides,
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      rules: {
        '@typescript-eslint/array-type': ['error', { default: 'generic' }],
        '@typescript-eslint/prefer-optional-chain': ['error'],
        '@typescript-eslint/consistent-type-definitions': [
          'error',
          'interface',
        ],
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/no-misused-promises': 'error',
        '@typescript-eslint/switch-exhaustiveness-check': 'error',
        '@typescript-eslint/no-extra-non-null-assertion': 'error',
        '@typescript-eslint/no-inferrable-types': 'warn',
        '@typescript-eslint/no-invalid-void-type': [
          'error',
          {
            allowInGenericTypeArguments: true,
          },
        ],
        // @typescript-eslint rules counterparts
        ...['no-shadow', 'no-unused-vars', 'no-redeclare'].reduce(
          (rules, name) => ({
            ...rules,
            [name]: 'off',
            [`@typescript-eslint/${name}`]: base.rules[name],
          }),
          {}
        ),
      },
    },
  ],
})
