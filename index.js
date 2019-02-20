module.exports = {
  extends: ['airbnb', 'prettier'],
  plugins: ['prettier'],
  parser: 'babel-eslint',
  env: {
    browser: true,
    jest: true
  },
  rules: {
    'comma-dangle': ['error', 'never'],
    'function-paren-newline': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'jsx-a11y/anchor-is-valid': 'warn',
    'jsx-a11y/media-has-caption': 'off',
    'no-debugger': 'warn',
    'no-extra-semi': 'error',
    'no-restricted-imports': ['error', { patterns: ['../*'] }],
    'no-restricted-modules': ['error', { patterns: ['../*'] }],
    'quote-props': ['error', 'consistent-as-needed'],
    'react/jsx-curly-brace-presence': 'off',
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
    'react/prefer-stateless-function': 'off',
    'react/sort-comp': ['error', { order: ['static-methods', 'instance-variables', 'lifecycle', 'everything-else', 'render'] }],
    'react/style-prop-object': 'off',
    'semi': ['error', 'never'],
    'import/extensions': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': 0,
    'import/prefer-default-export': 0,
    'jsx-a11y/anchor-is-valid': 1,
    'jsx-a11y/media-has-caption': 0,
    'no-debugger': 1,
    'react/prefer-stateless-function': 0,
    'react/sort-comp': [
      2,
      {
        'order': [
          'static-methods',
          'instance-variables',
          'lifecycle',
          'everything-else',
          'render'
        ]
      }
    ],
    'react/style-prop-object': 0,
    'no-restricted-imports': [
      2,
      {
        'patterns': ['../*']
      }
    ],
    'no-restricted-modules': [
      2,
      {
        'patterns': ['../*']
      }
    ],
    'prettier/prettier': 'error'
  }
}
