module.exports = {
  extends: ['airbnb-base'],
  env: {
    browser: true,
    jest: true,
  },
  plugins: [],
  reportUnusedDisableDirectives: true,
  rules: {
    'comma-dangle': 'off', // Handled by prettier
    'complexity': ['error', { max: 10 }],
    'function-paren-newline': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'import/no-useless-path-segments': 'off',
    'import/order': 'off',
    'import/prefer-default-export': 'off',
    'lines-between-class-members': 'off',
    'max-params': ['warn', 4],
    'no-shadow': ['error'],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-debugger': 'warn',
    'no-else-return': 'off',
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['../*'],
            message:
              'Use absolute paths for importing files from parent directories.',
          },
        ],
      },
    ],
    'no-restricted-modules': [
      'error',
      {
        // Seems it’s impossible to set up a message for a pattern
        patterns: ['../*'],
      },
    ],
    'semi': ['error', 'never'],
  },
  overrides: [
    // Empty override to enable linting JSX files by default
    // See https://github.com/eslint/rfcs/blob/main/designs/2019-additional-lint-targets/
    { files: ['*.jsx'] },
  ],
}
