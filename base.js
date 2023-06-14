const config = {
  extends: ['airbnb-base'],
  env: {
    browser: true,
    jest: true,
  },
  plugins: ['eslint-plugin-import', 'prefer-optional-chaining'],
  ignorePatterns: ['!/.*', '/node_modules/.*'],
  reportUnusedDisableDirectives: true,
  rules: {
    'complexity': ['error', { max: 10 }],
    'function-paren-newline': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'import/no-useless-path-segments': 'off',
    'import/order': [
      'error',
      {
        // Check https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md#options
        // for an explaination of these groups
        'groups': ['builtin', 'external', 'parent', 'sibling', 'index', 'type'],
      },
    ],
    'import/first': 'off',
    'import/prefer-default-export': 'off',
    'lines-between-class-members': 'off',
    'max-params': ['warn', 4],
    'no-void': [
      'error',
      {
        // Compat with @typescript-eslint/no-floating-promises
        allowAsStatement: true,
      },
    ],
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
    'prefer-optional-chaining/prefer-optional-chaining': ['error'],
  },
  overrides: [
    // Empty override to enable linting on other file extensions by default
    // See https://github.com/eslint/rfcs/blob/main/designs/2019-additional-lint-targets/
    { files: '*.cjs' },
    {
      files: '*.mjs',
      rules: {
        // Allow using relative paths in .mjs files, since they are
        // often used natively in the browser where absolute paths will
        // not work.
        'no-restricted-imports': 'off',
        'no-restricted-modules': 'off',
      },
    },
  ],
}

module.exports = config
