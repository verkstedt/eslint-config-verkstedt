module.exports = {
  extends: ['airbnb', 'prettier'],
  plugins: ['prettier'],
  parser: 'babel-eslint',
  env: {
    browser: true,
    jest: true
  },
  rules: {
    'semi': ['error', 'never'],
    'lines-between-class-members': 'off',
    'no-else-return': 'off',
    'comma-dangle': ['error', 'never'],
    'function-paren-newline': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'import/no-useless-path-segments': 'off',
    'import/order': 'off',
    'import/prefer-default-export': 'off',
    'jsx-a11y/anchor-is-valid': 'warn',
    'jsx-a11y/media-has-caption': 'off',
    'jsx-a11y/label-has-associated-control': 'warn',
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
    'react/jsx-one-expression-per-line': 'off',
    'react/destructuring-assignment': 'warn',
    'react/jsx-wrap-multilines': 'off',
    'prettier/prettier': 'error'
  }
}
