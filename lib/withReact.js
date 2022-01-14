module.exports = base => ({
  ...base,
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:react/jsx-runtime',
    ...base.extends.filter(ext => ext !== 'airbnb-base')
  ],
  rules: {
    ...base.rules,
    'jsx-a11y/anchor-is-valid': 'warn',
    'jsx-a11y/label-has-associated-control': 'warn',
    'jsx-a11y/media-has-caption': 'off',
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
    'react/style-prop-object': 'off'
  }
})
