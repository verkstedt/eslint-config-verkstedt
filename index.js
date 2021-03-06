module.exports = {
  extends: ['airbnb', 'prettier'],
  plugins: ['prettier', '@typescript-eslint'],
  parser: 'babel-eslint',
  env: {
    browser: true,
    jest: true
  },
  rules: {
    'comma-dangle': ['error', 'never'],
    'complexity': ['error', { max: 10 }],
    'function-paren-newline': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'import/no-useless-path-segments': 'off',
    'import/order': 'off',
    'import/prefer-default-export': 'off',
    'jsx-a11y/anchor-is-valid': 'warn',
    'jsx-a11y/label-has-associated-control': 'warn',
    'jsx-a11y/media-has-caption': 'off',
    'lines-between-class-members': 'off',
    'max-params': ['warn', 2],
    'no-debugger': 'warn',
    'no-else-return': 'off',
    'no-restricted-imports': ['error', { patterns: ['../*'] }],
    'no-restricted-modules': ['error', { patterns: ['../*'] }],
    'prettier/prettier': 'error',
    'react/destructuring-assignment': 'warn',
    'react/jsx-curly-brace-presence': 'off',
    'react/jsx-filename-extension': [
      'error',
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] }
    ],
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-wrap-multilines': 'off',
    'react/prefer-stateless-function': 'off',
    'react/sort-comp': [
      'error',
      {
        order: [
          'static-variables',
          'instance-variables',
          'static-methods',
          'lifecycle',
          'everything-else',
          'render'
        ]
      }
    ],
    'react/style-prop-object': 'off',
    'semi': ['error', 'never']
  }
}
