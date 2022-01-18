// FIXME Does it make sense to do that in base config, just as a
//       override for TS files?
module.exports = (base) => ({
  ...base,
  parser: '@typescript-eslint/parser',
  plugins: [...base.plugins, '@typescript-eslint'],
  rules: {
    ...base.rules,
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
  }
})
