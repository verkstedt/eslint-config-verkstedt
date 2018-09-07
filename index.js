module.exports = {
  'extends': 'airbnb',
  'parser': 'babel-eslint',
  'env': {
    'jest': true
  },
  'rules': {
    'quote-props': ['error', 'consistent-as-needed'],
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
    'no-restricted-imports': ['error', { 'patterns': ['../*'] }],
    'no-restricted-modules': ['error', { 'patterns': ['../*'] }],
    'react/jsx-curly-brace-presence': 'off',
    'react/jsx-filename-extension': ['error', { 'extensions': ['.js', '.jsx'] }],
    'react/prefer-stateless-function': 'off',
    'react/sort-comp': ['error', { order: [ 'static-methods', 'instance-variables', 'lifecycle', 'everything-else', 'render' ] }],
    'react/style-prop-object': 'off',
    'semi': ['error', 'never']
  }
}
