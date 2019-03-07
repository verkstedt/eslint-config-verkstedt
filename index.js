module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  env: {
    browser: true,
    jest: true
  },
  rules: {
    'comma-dangle': ['error', 'never'],
    'complexity': ['error', { 'max': 10 }],
    'function-paren-newline': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-named-as-default': 0,
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
    'semi': ['error', 'never']
  }
}
